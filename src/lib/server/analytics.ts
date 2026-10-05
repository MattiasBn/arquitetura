import "server-only";

import type { RowDataPacket } from "mysql2/promise";

import type { AnalyticsSummary, VisitRecord } from "@/lib/analytics-types";
import { db } from "@/lib/server/db";

/**
 * Estatísticas de visitas guardadas na tabela `visits` (MySQL).
 *
 * Cada visita é uma linha. Os resumos são calculados com agregações SQL,
 * pelo que o painel continua rápido mesmo com muitas visitas — nada disto
 * vive em ficheiros nem em memória.
 */

export function detectDevice(userAgent: string | null): VisitRecord["device"] {
  const ua = (userAgent ?? "").toLowerCase();
  if (/bot|spider|crawler|preview|slurp|bingpreview/i.test(ua)) return "bot";
  if (/ipad|tablet|kindle|silk|playbook/i.test(ua)) return "tablet";
  if (/iphone|ipod|android.*mobile|mobile|opera mini|blackberry|windows phone/i.test(ua)) return "mobile";
  if (/windows|macintosh|linux|x11|cros/i.test(ua)) return "desktop";
  return "other";
}

export function detectBrowser(userAgent: string | null): string {
  const ua = userAgent ?? "";
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return "Opera";
  if (/chrome|crios|chromium/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/safari/i.test(ua)) return "Safari";
  return "Outro";
}

function toCounts(rows: RowDataPacket[]): Array<{ label: string; count: number }> {
  return rows.map((row) => ({ label: String(row.label ?? "—"), count: Number(row.count) }));
}

function rowToVisit(row: RowDataPacket): VisitRecord {
  return {
    id: String(row.id),
    ts: Number(row.ts),
    vid: String(row.vid),
    path: String(row.path),
    title: row.title == null ? undefined : String(row.title),
    device: row.device as VisitRecord["device"],
    browser: String(row.browser),
    country: String(row.country),
    region: String(row.region),
    hour: Number(row.hour),
    referrer: row.referrer == null ? undefined : String(row.referrer),
  };
}

export async function recordVisit(input: Omit<VisitRecord, "id" | "ts">): Promise<void> {
  const pool = await db();
  const id = `${input.vid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await pool.execute(
    `INSERT INTO visits (id, ts, vid, path, title, device, browser, country, region, hour, referrer)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      Date.now(),
      input.vid,
      input.path,
      input.title ?? null,
      input.device,
      input.browser,
      input.country,
      input.region,
      input.hour,
      input.referrer ?? null,
    ]
  );
}

export async function clearAnalytics(): Promise<void> {
  const pool = await db();
  await pool.execute("DELETE FROM visits");
}

export async function summarizeAnalytics(days: number): Promise<AnalyticsSummary> {
  const pool = await db();
  const now = Date.now();
  const cutoff = days === 0 ? 0 : now - days * 86400000;
  const where = "ts >= ? AND device <> 'bot'";

  const [totalsRows] = await pool.execute<RowDataPacket[]>(
    `SELECT
       COALESCE(SUM(device <> 'bot'), 0) AS total,
       COUNT(DISTINCT CASE WHEN device <> 'bot' THEN vid END) AS uniq,
       COALESCE(SUM(device = 'bot'), 0) AS bots
     FROM visits WHERE ts >= ?`,
    [cutoff]
  );
  const totals = totalsRows[0] as { total: number | string; uniq: number | string; bots: number | string };

  const [perDayRows] = await pool.execute<RowDataPacket[]>(
    `SELECT DATE_FORMAT(FROM_UNIXTIME(ts / 1000), '%Y-%m-%d') AS date,
            COUNT(*) AS visits,
            COUNT(DISTINCT vid) AS uniq
     FROM visits WHERE ${where}
     GROUP BY date ORDER BY date`,
    [cutoff]
  );

  const [topPagesRows] = await pool.execute<RowDataPacket[]>(
    `SELECT path AS label, COUNT(*) AS count FROM visits WHERE ${where} GROUP BY label ORDER BY count DESC`,
    [cutoff]
  );
  const [deviceRows] = await pool.execute<RowDataPacket[]>(
    `SELECT device AS label, COUNT(*) AS count FROM visits WHERE ${where} GROUP BY label ORDER BY count DESC`,
    [cutoff]
  );
  const [browserRows] = await pool.execute<RowDataPacket[]>(
    `SELECT browser AS label, COUNT(*) AS count FROM visits WHERE ${where} GROUP BY label ORDER BY count DESC`,
    [cutoff]
  );
  const [zoneRows] = await pool.execute<RowDataPacket[]>(
    `SELECT CASE
              WHEN region IS NOT NULL AND region <> '—' THEN CONCAT(region, ' — ', country)
              ELSE country
            END AS label,
            COUNT(*) AS count
     FROM visits WHERE ${where} GROUP BY label ORDER BY count DESC`,
    [cutoff]
  );
  const [referrerRows] = await pool.execute<RowDataPacket[]>(
    `SELECT referrer AS label, COUNT(*) AS count
     FROM visits WHERE ${where} AND referrer IS NOT NULL AND referrer <> ''
     GROUP BY label ORDER BY count DESC`,
    [cutoff]
  );
  const [audienceRows] = await pool.execute<RowDataPacket[]>(
    `SELECT CASE
              WHEN device = 'mobile' AND (hour >= 17 OR hour < 8) THEN 'Jovens (estimativa)'
              WHEN device = 'mobile' THEN 'Público móvel'
              ELSE 'Adultos (estimativa)'
            END AS label,
            COUNT(*) AS count
     FROM visits WHERE ${where} GROUP BY label ORDER BY count DESC`,
    [cutoff]
  );
  const [recentRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, ts, vid, path, title, device, browser, country, region, hour, referrer
     FROM visits WHERE ${where} ORDER BY ts DESC LIMIT 30`,
    [cutoff]
  );

  const total = Number(totals.total);
  const audience = toCounts(audienceRows).map((entry) => ({
    ...entry,
    part: total ? +((entry.count / total) * 100).toFixed(1) : 0,
  }));

  return {
    total,
    unique: Number(totals.uniq),
    bots: Number(totals.bots),
    periodStart: cutoff,
    periodEnd: now,
    perDay: perDayRows.map((row) => ({
      date: String(row.date),
      visits: Number(row.visits),
      unique: Number(row.uniq),
    })),
    topPages: toCounts(topPagesRows),
    devices: toCounts(deviceRows),
    browsers: toCounts(browserRows),
    zones: toCounts(zoneRows),
    referrers: toCounts(referrerRows),
    audience,
    recent: recentRows.map(rowToVisit),
  };
}
