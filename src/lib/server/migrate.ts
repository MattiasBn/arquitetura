import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { Pool, RowDataPacket } from "mysql2/promise";

/**
 * Migração única do antigo `data/content.json` para a base de dados.
 *
 * Só corre quando a tabela `content` está vazia e o ficheiro ainda existe,
 * pelo que é inofensiva em arranques seguintes. Serve para não se perderem
 * as personalizações feitas antes de existir base de dados.
 */
export async function migrateLegacyContent(pool: Pool): Promise<void> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM content");
    if (Number((rows[0] as { total: number }).total) > 0) return;

    const file = join(process.cwd(), "data", "content.json");
    if (!existsSync(file)) return;

    const raw = JSON.parse(readFileSync(file, "utf8")) as {
      services?: Array<Record<string, unknown> & { slug?: string }>;
      site?: Record<string, unknown>;
    };

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (raw.site && Object.keys(raw.site).length > 0) {
        await connection.execute(
          "INSERT INTO content (content_key, content_value) VALUES (?, ?)",
          ["site", JSON.stringify(raw.site)]
        );
      }

      for (const service of raw.services ?? []) {
        if (!service || typeof service.slug !== "string") continue;
        const { slug, ...patch } = service;
        await connection.execute(
          "INSERT INTO content (content_key, content_value) VALUES (?, ?)",
          [`service:${slug}`, JSON.stringify(patch)]
        );
      }

      await connection.commit();
      console.info("[db] Conteúdo importado de data/content.json para a base de dados.");
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.warn("[db] Migração de data/content.json ignorada:", error);
  }
}

/**
 * Migração única do antigo `data/analytics.json` para a tabela `visits`.
 * Só corre quando a tabela está vazia e o ficheiro existe, pelo que é
 * inofensiva em arranques seguintes.
 */
export async function migrateLegacyAnalytics(pool: Pool): Promise<void> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM visits");
    if (Number((rows[0] as { total: number }).total) > 0) return;

    const file = join(process.cwd(), "data", "analytics.json");
    if (!existsSync(file)) return;

    const records = JSON.parse(readFileSync(file, "utf8")) as Array<Record<string, unknown>>;
    if (!Array.isArray(records) || records.length === 0) return;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const record of records) {
        await connection.execute(
          `INSERT IGNORE INTO visits
             (id, ts, vid, path, title, device, browser, country, region, hour, referrer)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            String(record.id),
            Number(record.ts) || Date.now(),
            String(record.vid ?? "desconhecido"),
            String(record.path ?? "/"),
            record.title == null ? null : String(record.title),
            String(record.device ?? "other"),
            String(record.browser ?? "Outro"),
            String(record.country ?? "Angola"),
            String(record.region ?? "—"),
            Number(record.hour) || 0,
            record.referrer == null ? null : String(record.referrer),
          ]
        );
      }
      await connection.commit();
      console.info(`[db] ${records.length} visitas importadas de data/analytics.json.`);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.warn("[db] Migração de data/analytics.json ignorada:", error);
  }
}
