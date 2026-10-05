import "server-only";

import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";

import mysql, { type Pool, type RowDataPacket, type SslOptions } from "mysql2/promise";

import { hashPassword } from "@/lib/server/password";
import { migrateLegacyAnalytics, migrateLegacyContent } from "@/lib/server/migrate";

/**
 * Ligação à base de dados MySQL (pool partilhado).
 *
 * As credenciais vêm de variáveis de ambiente (DB_*). Os valores por omissão
 * servem apenas para desenvolvimento local (MySQL no Docker).
 *
 * A Aiven exige SSL: basta DB_SSL=true. Com DB_SSL_CA_FILE (ou DB_SSL_CA)
 * a ligação valida o certificado; sem ele, o TLS continua cifrado mas sem
 * validar a cadeia.
 *
 * O esquema é criado de forma idempotente no primeiro acesso. O utilizador
 * admin inicial é semeado a partir de ADMIN_USERNAME/ADMIN_PASSWORD quando a
 * tabela está vazia — depois disso, a fonte de verdade é a base de dados.
 */

let pool: Pool | null = null;
let initPromise: Promise<void> | null = null;

/** Opções de SSL para serviços que exigem TLS cifrado (Aiven, PlanetScale...). */
function sslOptions(): SslOptions | undefined {
  const mode = (process.env.DB_SSL ?? "").toLowerCase();
  if (!mode || mode === "false" || mode === "0" || mode === "off") return undefined;

  const ca =
    (process.env.DB_SSL_CA ?? "").replaceAll("\\n", "\n").trim() ||
    (() => {
      const file = process.env.DB_SSL_CA_FILE ?? "certs/aiven-ca.pem";
      const path = isAbsolute(file) ? file : join(process.cwd(), file);
      try {
        return readFileSync(path, "utf8").trim();
      } catch {
        return "";
      }
    })();

  // Com CA validamos o servidor; sem CA aceitamos o TLS sem verificar a cadeia.
  return ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false };
}

function connect(): Pool {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "algugest",
    password: process.env.DB_PASSWORD ?? "algugest",
    database: process.env.DB_NAME ?? "algugest",
    ssl: sslOptions(),
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60_000,
    queueLimit: 0,
    charset: "utf8mb4",
    timezone: "Z",
    enableKeepAlive: true,
  });
  return pool;
}

async function init(): Promise<void> {
  const p = connect();

  await p.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(191) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      display_name VARCHAR(191) NOT NULL DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_admin_users_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS content (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      content_key VARCHAR(191) NOT NULL,
      content_value JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_content_key (content_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id VARCHAR(80) NOT NULL,
      ts BIGINT NOT NULL,
      vid VARCHAR(64) NOT NULL,
      path VARCHAR(512) NOT NULL,
      title VARCHAR(512) NULL,
      device ENUM('mobile','tablet','desktop','bot','other') NOT NULL,
      browser VARCHAR(64) NOT NULL,
      country VARCHAR(96) NOT NULL,
      region VARCHAR(96) NOT NULL,
      hour TINYINT UNSIGNED NOT NULL,
      referrer VARCHAR(512) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_visits_ts (ts),
      KEY idx_visits_vid (vid),
      KEY idx_visits_device (device)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await seedAdmin(p);
  await migrateLegacyContent(p);
  await migrateLegacyAnalytics(p);
}

async function seedAdmin(p: Pool): Promise<void> {
  const [rows] = await p.query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM admin_users");
  if (Number((rows[0] as { total: number }).total) > 0) return;

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "algugest2026";
  await p.execute(
    "INSERT INTO admin_users (username, password_hash, display_name) VALUES (?, ?, ?)",
    [username, hashPassword(password), username]
  );
}

/** Devolve o pool, garantindo que o esquema já existe. */
export async function db(): Promise<Pool> {
  if (!initPromise) {
    initPromise = init().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  await initPromise;
  return connect();
}
