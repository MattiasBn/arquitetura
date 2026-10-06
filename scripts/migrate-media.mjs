/**
 * Migra a media de public/ para a Cloudinary.
 *
 * Uso:
 *   node scripts/migrate-media.mjs
 *
 * A credencial vem de process.env.CLOUDINARY_URL ou do ficheiro
 * .env.cloudinary (gitignored) na raiz do projeto.
 *
 * O mapa local -> URL da cloud fica em data/migracao-cloudinary.json, por isso
 * o processo e retomavel: cada execucao pula o que ja enviou.
 *
 * Importante: este script SO envia. Passar as referencias do conteudo e do
 * codigo para URLs da cloud e um passo separado, feito depois de validar o mapa.
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, extname, basename, dirname } from "node:path";
import { v2 as cloudinary } from "cloudinary";

const RAIZ = process.cwd();
const PUBLIC = join(RAIZ, "public");
const MAPA = join(RAIZ, "data", "migracao-cloudinary.json");
const PASTA_CLOUD = (process.env.CLOUDINARY_FOLDER ?? "algugest").replace(/^\/+|\/+$/g, "");

// Pastas de conteudo. imagens/uploads fica de fora (ficheiros descartaveis).
const PASTAS = ["imagens", "headervideos", "videos", "obraNova", "projectoNvo"];
const EXT_IMG = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"]);
const EXT_VID = new Set(["mp4", "webm", "mov", "m4v"]);

function carregarCredencial() {
  if (process.env.CLOUDINARY_URL) return;
  const ficheiro = join(RAIZ, ".env.cloudinary");
  if (!existsSync(ficheiro)) {
    console.error("Falta a credencial: define CLOUDINARY_URL ou cria .env.cloudinary na raiz.");
    process.exit(1);
  }
  for (const linha of readFileSync(ficheiro, "utf8").split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  if (!process.env.CLOUDINARY_URL) {
    console.error(".env.cloudinary nao contem CLOUDINARY_URL.");
    process.exit(1);
  }
}

function listarFicheiros() {
  const ficheiros = [];
  for (const pasta of PASTAS) {
    const raiz = join(PUBLIC, pasta);
    if (!existsSync(raiz)) continue;
    const andar = (dir) => {
      for (const entrada of readdirSync(dir, { withFileTypes: true })) {
        if (entrada.name.startsWith(".")) continue;
        const caminho = join(dir, entrada.name);
        if (entrada.isDirectory()) {
          andar(caminho);
          continue;
        }
        const relativo = relative(PUBLIC, caminho).replaceAll("\\", "/");
        const ext = extname(entrada.name).slice(1).toLowerCase();
        if (!EXT_IMG.has(ext) && !EXT_VID.has(ext)) continue;
        ficheiros.push({ caminho, relativo });
      }
    };
    andar(raiz);
  }
  return ficheiros;
}

function carregarMapa() {
  if (!existsSync(MAPA)) return {};
  return JSON.parse(readFileSync(MAPA, "utf8"));
}

async function enviar(ficheiros, mapa) {
  let enviados = 0;
  let falhados = 0;
  for (const [i, ficheiro] of ficheiros.entries()) {
    if (mapa[ficheiro.relativo]) continue;
    const ext = extname(ficheiro.relativo).slice(1).toLowerCase();
    const tipo = EXT_VID.has(ext) ? "video" : "image";
    const nome = basename(ficheiro.relativo);
    const subpasta = dirname(ficheiro.relativo) === "." ? "" : `/${dirname(ficheiro.relativo)}`;
    try {
      const resultado = await cloudinary.uploader.upload(ficheiro.caminho, {
        folder: `${PASTA_CLOUD}${subpasta}`,
        public_id: nome.slice(0, nome.length - extname(nome).length),
        resource_type: tipo,
        use_filename: false,
        unique_filename: false,
        overwrite: true,
      });
      mapa[ficheiro.relativo] = resultado.secure_url;
      writeFileSync(MAPA, JSON.stringify(mapa, null, 1));
      enviados++;
      console.log(`  [${i + 1}/${ficheiros.length}] ${ficheiro.relativo} -> ok`);
    } catch (erro) {
      falhados++;
      const msg =
        erro?.error?.message ?? erro?.message ?? (typeof erro === "object" ? JSON.stringify(erro) : String(erro));
      console.error(`  [${i + 1}/${ficheiros.length}] FALHOU ${ficheiro.relativo}: ${msg}`);
    }
  }
  return { enviados, falhados };
}

carregarCredencial();

// O SDK le CLOUDINARY_URL no momento do import; como a credencial so e lida
// depois (carregarCredencial), configuramos explicitamente a partir do URL.
{
  const url = new URL(process.env.CLOUDINARY_URL);
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: decodeURIComponent(url.username),
    api_secret: decodeURIComponent(url.password),
    secure: true,
  });
}

const ficheiros = listarFicheiros();
const mapa = carregarMapa();
console.log(`Ficheiros encontrados: ${ficheiros.length}`);
console.log(`Ja enviados: ${Object.keys(mapa).length} | por enviar: ${ficheiros.length - Object.keys(mapa).length}`);
if (ficheiros.length === Object.keys(mapa).length) {
  console.log("Nada por enviar.");
  process.exit(0);
}

console.log(`A enviar para a Cloudinary (pasta "${PASTA_CLOUD}")...`);
const { enviados, falhados } = await enviar(ficheiros, mapa);
console.log(`\nEnviados agora: ${enviados} | falhados: ${falhados} | total no mapa: ${Object.keys(mapa).length}`);
console.log(`Mapa guardado em: ${MAPA}`);
if (falhados > 0) process.exit(1);