import { NextResponse } from "next/server";

import { createSessionToken, verifyCredentials, ADMIN_COOKIE_NAME } from "@/lib/server/auth";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    attempts.set(ip, { count: entry.count, resetAt: entry.resetAt });
    return true;
  }
  attempts.set(ip, entry);
  return false;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "Demasiadas tentativas falhadas. Por segurança, aguarde alguns minutos antes de voltar a tentar.",
      },
      { status: 429 }
    );
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json({ error: "Preencha o utilizador e a palavra-passe." }, { status: 400 });
  }

  if (!(await verifyCredentials(username, password))) {
    return NextResponse.json(
      { error: "Credenciais inválidas. Verifique o utilizador e a palavra-passe." },
      { status: 401 }
    );
  }

  attempts.delete(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}