import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Hash de palavras-passe com scrypt (nativo do Node, sem dependências).
 *
 * Formato guardado: `scrypt$<salt-base64url>$<hash-base64url>`.
 * O salt é aleatório por utilizador, pelo que a mesma palavra-passe gera
 * hashes diferentes. A verificação é feita em tempo constante.
 */

const KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, saltEncoded, hashEncoded] = stored.split("$");
    if (scheme !== "scrypt" || !saltEncoded || !hashEncoded) return false;
    const salt = Buffer.from(saltEncoded, "base64url");
    const expected = Buffer.from(hashEncoded, "base64url");
    const actual = scryptSync(password, salt, expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
