import "server-only";

import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { db } from "@/lib/server/db";
import { hashPassword, verifyPassword } from "@/lib/server/password";

/**
 * Utilizadores do painel /admin, guardados na base de dados.
 *
 * As palavras-passe nunca são guardadas em claro: usamos scrypt com salt.
 * A comparação com um hash "isca" quando o utilizador não existe evita
 * revelar por temporização quais os utilizadores válidos.
 */

let dummyHash: string | null = null;

function getDummyHash(): string {
  if (!dummyHash) dummyHash = hashPassword("algugest-dummy-password");
  return dummyHash;
}

export async function verifyUserCredentials(username: string, password: string): Promise<boolean> {
  const pool = await db();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT password_hash FROM admin_users WHERE username = ? LIMIT 1",
    [username]
  );

  if (rows.length === 0) {
    verifyPassword(password, getDummyHash());
    return false;
  }

  return verifyPassword(password, String(rows[0].password_hash));
}

export async function countUsers(): Promise<number> {
  const pool = await db();
  const [rows] = await pool.execute<RowDataPacket[]>("SELECT COUNT(*) AS total FROM admin_users");
  return Number((rows[0] as { total: number }).total);
}

export async function setUserPassword(username: string, password: string): Promise<boolean> {
  const pool = await db();
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE admin_users SET password_hash = ? WHERE username = ?",
    [hashPassword(password), username]
  );
  return result.affectedRows > 0;
}
