import { NextRequest, NextResponse } from "next/server";

import { detectBrowser, detectDevice, recordVisit } from "@/lib/server/analytics";

export const runtime = "nodejs";

/**
 * Endpoint público de trackeamento de visitas.
 * O Tracker (cliente) chama isto em cada mudança de página.
 * Guarda dispositivo, navegador, zona e hora local, sem identificar o visitante.
 */
export async function POST(request: NextRequest) {
  let body: { path?: string; title?: string; referrer?: string; hour?: number };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const vid = request.cookies.get("algugest_vid")?.value ?? crypto.randomUUID();

  const ua = request.headers.get("user-agent");
  const device = detectDevice(ua);
  if (device === "bot") {
    // Continua a contar bots, mas sem inflar os totais de pessoas.
  }

  const country = request.headers.get("cf-ipcountry") ?? request.headers.get("x-vercel-ip-country") ?? "Angola";
  const region = request.headers.get("cf-region") ?? request.headers.get("x-vercel-ip-country-region") ?? "—";

  await recordVisit({
    vid,
    path: body.path ?? "/",
    title: body.title,
    device,
    browser: detectBrowser(ua),
    country,
    region,
    hour: typeof body.hour === "number" ? Math.max(0, Math.min(23, Math.round(body.hour))) : 12,
    referrer: body.referrer || undefined,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("algugest_vid", vid, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 400 * 24 * 60 * 60,
  });
  return response;
}