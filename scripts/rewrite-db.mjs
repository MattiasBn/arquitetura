/**
 * Passa as referencias locais de media nas linhas da tabela `content` para os
 * URLs da Cloudinary, usando o mapa de scripts/migrate-media.mjs.
 *
 * Uso (na raiz do projeto, para a Aiven):
 *   DB_HOST=... DB_PORT=... DB_USER=... DB_PASSWORD=... DB_NAME=... DB_SSL=true \
 *   node scripts/rewrite-db.mjs
 *
 * Uso (dentro do contentor, para a base de dados local):
 *   docker exec arquitetura-app-1 sh -c "cd /app && node scripts/rewrite-db.mjs"
 *
 * So altera valores que realmente mudam e mostra um resumo.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = process.cwd();
const MAPA = join(RAIZ, "data", "migracao-cloudinary.json");

if (!existsSync(MAPA)) {
  console.error(`Falta o mapa: ${MAPA}`);
  process.exit(1);
}
const mapa = JSON.parse(readFileSync(MAPA, "utf8"));

const alvoParaUrl = new Map();
for (const [relativo, url] of Object.entries(mapa)) {
  alvoParaUrl.set(`/${relativo}`, url);
  const espacos = `/${relativo.replaceAll(" ", "%20")}`;
  alvoParaUrl.set(espacos, url);
  const codificado = `/${relativo.split("/").map(encodeURIComponent).join("/")}`;
  alvoParaUrl.set(codificado, url);
}
const alvos = [...alvoParaUrl.keys()].sort((a, b) => b.length - a.length);
const escapar = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const regex = new RegExp(alvos.map(escapar).join("|"), "g");

/** Troca numa unica passagem e ignora URLs da cloud ja inseridos. */
function trocar(texto) {
  const partes = texto.split(/(https:\/\/res\.cloudinary\.com\/[^"\\]+)/g);
  let mudou = 0;
  const saida = partes
    .map((p, i) => {
      if (i % 2 === 1) return p;
      return p.replace(regex, (encontrado) => {
        mudou++;
        return alvoParaUrl.get(encontrado);
      });
    })
    .join("");
  return { texto: saida, mudou };
}

const ssl = (process.env.DB_SSL ?? "").toLowerCase();
const caPath = join(RAIZ, process.env.DB_SSL_CA_FILE ?? "certs/aiven-ca.pem");
const opcoesSSL =
  ssl && ssl !== "false" && ssl !== "0" && existsSync(caPath)
    ? { ca: readFileSync(caPath, "utf8"), rejectUnauthorized: true }
    : ssl && ssl !== "false"
      ? { rejectUnauthorized: false }
      : undefined;

const { createConnection } = await import("mysql2/promise");
const ligacao = await createConnection({
  host: process.env.DB_HOST ?? "db",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "algugest",
  password: process.env.DB_PASSWORD ?? "algugest",
  database: process.env.DB_NAME ?? "algugest",
  ssl: opcoesSSL,
  charset: "utf8mb4",
  timezone: "Z",
});

const [linhas] = await ligacao.query(
  "SELECT content_key, CAST(content_value AS CHAR) AS valor FROM content",
);

let alteradas = 0;
let trocas = 0;
for (const linha of linhas) {
  const { texto, mudou } = trocar(linha.valor);
  if (mudou === 0) continue;
  await ligacao.execute(
    "UPDATE content SET content_value = ? WHERE content_key = ?",
    [texto, linha.content_key],
  );
  alteradas++;
  trocas += mudou;
  console.log(`  ${linha.content_key}: ${mudou} troca(s)`);
}

const [restam] = await ligacao.query(
  "SELECT content_key, CAST(content_value AS CHAR) AS valor FROM content",
);
const pendentes = restam.filter((l) => trocar(l.valor).mudou > 0).map((l) => l.content_key);

console.log(`\nLinhas alteradas: ${alteradas} | trocas: ${trocas}`);
console.log(pendentes.length === 0 ? "Sem referencias locais na base de dados." : `Ainda por trocar: ${pendentes.join(", ")}`);
await ligacao.end();
if (pendentes.length > 0) process.exit(1);