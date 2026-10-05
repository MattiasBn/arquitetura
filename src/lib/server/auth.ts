import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { verifyUserCredentials } from "@/lib/server/users";

/**
 * Autenticação do administrador.
 *
 * - Credenciais: utilizadores na base de dados (tabela admin_users), com
 *   palavras-passe guardadas por scrypt. O primeiro utilizador é semeado a
 *   partir de ADMIN_USERNAME / ADMIN_PASSWORD na primeira execução.
 * - Sessão: cookie httpOnly assinado (HMAC-SHA256), 12h.
 */

const COOKIE_NAME = "algugest_admin";

const SECRET = process.env.ADMIN_SECRET ?? "algugest-dev-secret-trocar-em-producao";

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const expected = Buffer.from(sign(payload));
    const given = Buffer.from(sig);
    if (expected.length !== given.length) return false;
    if (!timingSafeEqual(expected, given)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  return verifyUserCredentials(username, password);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : false;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;