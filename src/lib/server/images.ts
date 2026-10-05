import "server-only";

import { readdirSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { Readable } from "node:stream";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import {
  ALLOWED_IMAGE_EXT,
  ALLOWED_VIDEO_EXT,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_MB,
  MAX_VIDEO_BYTES,
  MAX_VIDEO_MB,
} from "@/lib/media";

/**
 * Imagens e vídeos do site.
 *
 * Existem dois modos, escolhidos pela variável CLOUDINARY_URL:
 *
 *  - **Cloudinary** (produção, ex. Render): os uploads vão para a cloud e a
 *    listagem vem da API. O servidor fica sem disco persistente, portanto é
 *    obrigatório que os ficheiros vivam fora dele.
 *  - **Disco local** (desenvolvimento): escreve em public/imagens/uploads e
 *    lista o que existe em public/imagens.
 *
 * Os URLs da Cloudinary são absolutos (https://res.cloudinary.com/...), por isso
 * funcionam em qualquer domínio — ver `images.remotePatterns` no next.config.ts.
 */

const IMAGES_DIR = join(process.cwd(), "public", "imagens");
const UPLOADS_REL = "uploads";
const UPLOADS_DIR = join(IMAGES_DIR, UPLOADS_REL);

export type MediaEntry = {
  path: string;
  folder: string;
  name: string;
  type: "image" | "video";
};

function cloudinaryAtivo(): boolean {
  return Boolean(process.env.CLOUDINARY_URL);
}

function pastaCloudinary(): string {
  return (process.env.CLOUDINARY_FOLDER ?? "algugest").replace(/^\/+|\/+$/g, "");
}

function configurarCloudinary(): void {
  // Lê CLOUDINARY_URL (cloudinary://chave:segredo@nome-da-cloud).
  cloudinary.config({ secure: true });
}

/** Lista o que existe no disco (apenas no modo local). */
function listarDisco(kind: "images" | "videos" | "all"): MediaEntry[] {
  if (!existsSync(IMAGES_DIR)) return [];
  const entries: MediaEntry[] = [];
  const walk = (dir: string, folder: string) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      if (name.name.startsWith(".")) continue;
      if (name.isDirectory()) {
        walk(join(dir, name.name), `${folder}/${name.name}`);
        continue;
      }
      const ext = extname(name.name).slice(1).toLowerCase();
      const isImage = ALLOWED_IMAGE_EXT.includes(ext);
      const isVideo = ALLOWED_VIDEO_EXT.includes(ext);
      if (kind === "images" && !isImage) continue;
      if (kind === "videos" && !isVideo) continue;
      if (kind === "all" && !isImage && !isVideo) continue;
      entries.push({
        path: `/imagens${folder}/${encodeURIComponent(name.name)}`.replaceAll("%2520", "%20"),
        folder: folder.replace("/", "") || "imagens",
        name: name.name,
        type: isVideo ? "video" : "image",
      });
    }
  };
  walk(IMAGES_DIR, "");
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

type RecursoCloudinary = { public_id?: string; secure_url?: string };

/** Lista os ficheiros que já estão na Cloudinary (todas as páginas). */
async function listarCloudinary(kind: "images" | "videos" | "all"): Promise<MediaEntry[]> {
  const tipos: Array<"image" | "video"> =
    kind === "all" ? ["image", "video"] : kind === "videos" ? ["video"] : ["image"];

  const entradas: MediaEntry[] = [];
  for (const tipo of tipos) {
    let cursor: string | undefined;
    do {
      const resposta = (await cloudinary.api.resources({
        resource_type: tipo,
        type: "upload",
        max_results: 100,
        ...(cursor ? { next_cursor: cursor } : {}),
      })) as { resources: RecursoCloudinary[]; next_cursor?: string };

      for (const item of resposta.resources) {
        const url = item.secure_url;
        if (!url) continue;
        const partes = String(item.public_id ?? "").split("/");
        entradas.push({
          path: url,
          folder: partes.slice(0, -1).join("/") || "cloudinary",
          name: partes[partes.length - 1] || basename(new URL(url).pathname),
          type: tipo === "video" ? "video" : "image",
        });
      }
      cursor = resposta.next_cursor;
    } while (cursor);
  }
  return entradas.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Lista os ficheiros disponíveis.
 *
 * Quando a Cloudinary está ativa devolvemos as DUAS fontes: o que já vem no
 * repositório (public/imagens, servido pelo próprio site) e o que está na
 * cloud. Sem esta união, os ficheiros antigos desapareceriam do seletor do
 * `/admin` assim que os uploads passassem a ir para a Cloudinary.
 */
export async function listMedia(kind: "images" | "videos" | "all" = "images"): Promise<MediaEntry[]> {
  const doDisco = listarDisco(kind);
  if (!cloudinaryAtivo()) return doDisco;
  configurarCloudinary();
  try {
    const daCloud = await listarCloudinary(kind);
    const jaVistos = new Set(doDisco.map((entrada) => entrada.path));
    const extras = daCloud.filter((entrada) => !jaVistos.has(entrada.path));
    return [...doDisco, ...extras].sort((a, b) => a.name.localeCompare(b.name));
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "erro desconhecido";
    console.error("Falha ao listar ficheiros na Cloudinary:", mensagem);
    return doDisco;
  }
}

function sanitizeFileName(name: string): string {
  const base = basename(name).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
  const ext = extname(base).toLowerCase();
  const stem = base.slice(0, base.length - ext.length).slice(0, 60) || "ficheiro";
  return `${stem}${ext}`;
}

export async function saveUpload(file: File): Promise<{ path: string; error?: string }> {
  const ext = extname(file.name).slice(1).toLowerCase();
  const isImage = ALLOWED_IMAGE_EXT.includes(ext);
  const isVideo = ALLOWED_VIDEO_EXT.includes(ext);
  if (!isImage && !isVideo) {
    const allowed = [...ALLOWED_IMAGE_EXT, ...ALLOWED_VIDEO_EXT].join(", ");
    return { path: "", error: `Formato não permitido (${file.name}). Use ${allowed}.` };
  }
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return {
      path: "",
      error: isVideo
        ? `Vídeo demasiado grande (máx. ${MAX_VIDEO_MB} MB).`
        : `Imagem demasiado grande (máx. ${MAX_IMAGE_MB} MB).`,
    };
  }

  if (cloudinaryAtivo()) {
    configurarCloudinary();
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const resultado = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: pastaCloudinary(),
            resource_type: isVideo ? "video" : "image",
            use_filename: true,
            unique_filename: true,
            overwrite: false,
          },
          (erro, resposta) => {
            if (erro) reject(erro);
            else if (resposta) resolve(resposta);
            else reject(new Error("A Cloudinary não devolveu resposta."));
          },
        );
        Readable.from(buffer).pipe(stream);
      });
      if (!resultado.secure_url) {
        return { path: "", error: "A Cloudinary não devolveu o endereço do ficheiro." };
      }
      return { path: resultado.secure_url };
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "erro desconhecido";
      return { path: "", error: `Falha no envio para a Cloudinary: ${mensagem}` };
    }
  }

  mkdirSync(UPLOADS_DIR, { recursive: true });
  const uniqueName = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  writeFileSync(join(UPLOADS_DIR, uniqueName), Buffer.from(bytes));
  return { path: `/imagens/${UPLOADS_REL}/${uniqueName}` };
}