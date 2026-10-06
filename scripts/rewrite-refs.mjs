/**
 * Troca as referencias locais (/imagens/..., /videos/...) pelos URLs da
 * Cloudinary, usando o mapa gerado por scripts/migrate-media.mjs.
 *
 * Uso:
 *   node scripts/rewrite-refs.mjs            # ficheiros de codigo e conteudo legado
 *   node scripts/rewrite-refs.mjs --verify   # so mostra referencias que sobraram
 *
 * NAO mexe em src/lib/server/images.ts (constroi caminhos em runtime) nem no
 * proprio mapa.
 */
import { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = process.cwd();
const MAPA = join(RAIZ, "data", "migracao-cloudinary.json");
const SO_VERIFICAR = process.argv.includes("--verify");

// Excecoes: ficheiros que constroem caminhos em runtime ou sao artefactos.
const IGNORAR = new Set([
  "src/lib/server/images.ts",
  "data/migracao-cloudinary.json",
]);

const PADRAO = /(\/(?:imagens|headervideos|videos|obraNova|projectoNvo)\/[^\s"'`)<>]+)/g;

/** Variante percent-encoded do caminho (h codigo com /imagens/x%20y.jpg). */
function variacoes(relativo) {
  const alvos = new Set([`/${relativo}`]);
  const codificado = relativo.split("/").map(encodeURIComponent).join("/");
  if (codificado !== relativo) alvos.add(`/${codificado}`);
  const espacos = relativo.replaceAll(" ", "%20");
  if (espacos !== relativo) alvos.add(`/${espacos}`);
  const acentos = relativo
    .split("/")
    .map((p) => encodeURIComponent(p).replace(/%20/g, " "))
    .join("/");
  if (acentos !== relativo) alvos.add(`/${acentos}`);
  return [...alvos];
}

/** Corta os URLs da cloud: eles proprios terminam em /imagens/... e dariam falso positivo. */
function semUrlsDaCloud(texto) {
  return texto.replace(/https:\/\/res\.cloudinary\.com\/[^"'`)<>]+/g, "");
}

if (!existsSync(MAPA)) {
  console.error(`Falta o mapa: ${MAPA}. Corre antes: node scripts/migrate-media.mjs`);
  process.exit(1);
}
const mapa = JSON.parse(readFileSync(MAPA, "utf8"));
const entradas = Object.entries(mapa).sort((a, b) => b[0].length - a[0].length);
console.log(`Mapa com ${entradas.length} URLs.`);

function listarFicheiros() {
  const ficheiros = [];
  for (const raiz of [join(RAIZ, "src"), join(RAIZ, "data")]) {
    if (!existsSync(raiz)) continue;
    const andar = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.name.startsWith(".")) continue;
        const caminho = join(dir, e.name);
        if (e.isDirectory()) {
          andar(caminho);
          continue;
        }
        if (!/\.(ts|tsx|json)$/.test(e.name)) continue;
        const relativo = relative(RAIZ, caminho).replaceAll("\\", "/");
        if (IGNORAR.has(relativo)) continue;
        ficheiros.push(caminho);
      }
    };
    andar(raiz);
  }
  return ficheiros;
}

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const alvoParaUrl = new Map();
for (const [relativo, url] of entradas) {
  for (const alvo of variacoes(relativo)) alvoParaUrl.set(alvo, url);
}
// Mais longos primeiro: evita que um caminho curto coma parte de um longo.
const alvosOrdenados = [...alvoParaUrl.keys()].sort((a, b) => b.length - a.length);
const regexAlvos = new RegExp(alvosOrdenados.map(escaparRegex).join("|"), "g");

/**
 * Substitui numa unica passagem (replace nao volta a analisar o que inseriu)
 * e ignora completamente os URLs da cloud, que tambem terminam em /imagens/...
 */
function substituir(texto) {
  const partes = texto.split(/(https:\/\/res\.cloudinary\.com\/[^"'`)<>]+)/g);
  let trocas = 0;
  const saida = partes
    .map((parte, i) => {
      if (i % 2 === 1) return parte; // URL da cloud: preservar
      return parte.replace(regexAlvos, (encontrado) => {
        trocas++;
        return alvoParaUrl.get(encontrado);
      });
    })
    .join("");
  return { texto: saida, trocas };
}

const ficheiros = listarFicheiros();

if (SO_VERIFICAR) {
  let sobram = 0;
  for (const caminho of ficheiros) {
    const texto = semUrlsDaCloud(readFileSync(caminho, "utf8"));
    const encontrados = texto.match(PADRAO);
    if (encontrados) {
      console.log(`  ${relative(RAIZ, caminho)}: ${encontrados.length}`);
      for (const e of [...new Set(encontrados)].slice(0, 4)) console.log(`      ${e}`);
      sobram += encontrados.length;
    }
  }
  console.log(sobram === 0 ? "\nSem referencias locais. Tudo trocado." : `\nAinda sobram ${sobram} referencias locais.`);
  process.exit(sobram === 0 ? 0 : 1);
}

let ficheirosAlterados = 0;
let totalTrocas = 0;
for (const caminho of ficheiros) {
  const antes = readFileSync(caminho, "utf8");
  const { texto, trocas } = substituir(antes);
  if (trocas === 0) continue;
  writeFileSync(caminho, texto);
  ficheirosAlterados++;
  totalTrocas += trocas;
  console.log(`  ${relative(RAIZ, caminho)}: ${trocas} troca(s)`);
}

console.log(`\nFicheiros alterados: ${ficheirosAlterados} | trocas totais: ${totalTrocas}`);