import "server-only";

import { revalidatePath } from "next/cache";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { SERVICES, type Service } from "@/data/services";
import { BRAND, CONTACTS, DESTAQUES, HOME_IMAGES, HERO_VIDEOS, VALUES, type Destaque } from "@/lib/site";
import { db } from "@/lib/server/db";

/**
 * Conteúdo editável pelo administrador, guardado na base de dados MySQL.
 *
 * Os valores padrão vivem em src/data/services.ts e src/lib/site.ts.
 * As alterações do admin são gravadas na tabela `content` como "sobras"
 * (overrides) e aqui fundidas com os padrão. Depois de gravar, revalidamos
 * as rotas para o site apresentativo dos dados novos.
 *
 * Chaves usadas na tabela `content`:
 *   - "site"            -> SiteOverrides
 *   - "service:<slug>"  -> ServiceOverride (sem o slug, que vem na chave)
 */

type ImageOverride = string[];

type ServiceOverride = Partial<
  Pick<Service, "title" | "summary" | "intro" | "description" | "includes">
> & { slug: string } & { images?: ImageOverride };

type SiteOverrides = {
  contacts?: Record<string, string>;
  brand?: Record<string, string>;
  values?: { title: string; text: string }[];
  videos?: string[];
  destaques?: Destaque[];
  home?: {
    edificio?: string;
    equipa?: string;
    projetos?: { alt: string; image: string }[];
  };
  [key: string]: unknown;
};

type ContentFile = {
  services: ServiceOverride[];
  site?: SiteOverrides;
};

const SITE_KEY = "site";
const SERVICE_PREFIX = "service:";

function parseValue(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

async function readOverrides(): Promise<ContentFile> {
  const pool = await db();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT content_key, content_value FROM content"
  );

  const site: SiteOverrides = {};
  const services: ServiceOverride[] = [];

  for (const row of rows) {
    const key = String(row.content_key);
    const value = parseValue(row.content_value);

    if (key === SITE_KEY) {
      if (value && typeof value === "object") Object.assign(site, value as object);
    } else if (key.startsWith(SERVICE_PREFIX)) {
      const slug = key.slice(SERVICE_PREFIX.length);
      if (value && typeof value === "object") {
        services.push({ ...(value as object), slug } as ServiceOverride);
      }
    }
  }

  return { services, site };
}

export type SiteInfo = {
  contacts: Record<string, string>;
  brand: Record<string, string>;
  values: Array<{ title: string; text: string }>;
  videos: string[];
  destaques: Destaque[];
  home: {
    edificio: string;
    equipa: string;
    projetos: Array<{ alt: string; image: string }>;
  };
};

export async function getServices(): Promise<Service[]> {
  const overrides = await readOverrides();
  return SERVICES.map((service) => {
    const patch = overrides.services.find((s) => s.slug === service.slug);
    if (!patch) return service;
    return {
      ...service,
      ...(patch.title ? { title: patch.title } : {}),
      ...(patch.summary ? { summary: patch.summary } : {}),
      ...(patch.intro ? { intro: patch.intro } : {}),
      ...(patch.description ? { description: patch.description } : {}),
      ...(patch.includes ? { includes: patch.includes } : {}),
      ...(patch.images ? { images: patch.images } : {}),
    };
  });
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((service) => service.slug === slug);
}

export async function getSiteInfo(): Promise<SiteInfo> {
  const overrides = (await readOverrides()).site ?? {};
  const contacts: Record<string, string> = { ...CONTACTS };
  const brand: Record<string, string> = { ...BRAND };
  let values: Array<{ title: string; text: string }> = [...VALUES];
  let videos: string[] = [...HERO_VIDEOS];
  let destaques: Destaque[] = DESTAQUES.map((d) => ({ ...d }));
  let home = {
    edificio: HOME_IMAGES.edificio,
    equipa: HOME_IMAGES.equipa,
    projetos: HOME_IMAGES.projetos.map((p) => ({ ...p })),
  };

  for (const key of Object.keys(overrides)) {
    const value = overrides[key];
    if (value === undefined) continue;
    if (key === "contacts" && value && typeof value === "object") {
      Object.assign(contacts, value);
    } else if (key === "brand" && value && typeof value === "object") {
      Object.assign(brand, value);
    } else if (key === "values") {
      values = (value as Array<{ title: string; text: string }> | undefined) ?? [...VALUES];
    } else if (key === "videos") {
      videos = (value as string[] | undefined) ?? HERO_VIDEOS;
    } else if (key === "destaques") {
      destaques = ((value as Destaque[] | undefined) ?? []).map((d) => ({
        id: d.id,
        title: d.title,
        text: d.text,
        image: d.image,
        date: d.date,
      }));
    } else if (key === "home") {
      const patch = value as SiteInfo["home"];
      home = {
        edificio: patch.edificio || home.edificio,
        equipa: patch.equipa || home.equipa,
        projetos: (patch.projetos ?? []).map((p) => ({ alt: p.alt, image: p.image })),
      };
    } else if (key in contacts) {
      contacts[key] = value as string;
    } else if (key in brand) {
      brand[key] = value as string;
    }
  }

  return { contacts, brand, values, videos, destaques, home };
}

function flattenSite(site: SiteOverrides): SiteOverrides {
  return {
    ...(site.contacts ?? {}),
    ...(site.brand ?? {}),
    ...(Array.isArray(site.values) ? { values: site.values } : {}),
    ...(Array.isArray(site.videos) ? { videos: site.videos } : {}),
    ...(Array.isArray(site.destaques) ? { destaques: site.destaques } : {}),
    ...(site.home !== undefined ? { home: site.home } : {}),
  };
}

function cleanServices(services: ServiceOverride[] | undefined): ServiceOverride[] {
  return (services ?? [])
    .filter((s) => typeof s.slug === "string")
    .map((s) => {
      const patch: ServiceOverride = { slug: s.slug };
      for (const key of ["title", "summary", "intro", "description", "includes", "images"] as const) {
        if (s[key] !== undefined) {
          (patch as Record<string, unknown>)[key] = s[key];
        }
      }
      return patch;
    })
    .filter((s) => Object.keys(s).length > 1);
}

function revalidateSite(): void {
  revalidatePath("/", "layout");
  revalidatePath("/servicos", "page");
  revalidatePath("/servicos/[slug]", "page");
  revalidatePath("/sobre", "page");
  revalidatePath("/contactos", "page");
  revalidatePath("/portfolio", "page");
  revalidatePath("/destaques", "page");
}

export async function saveContent(body: ContentFile): Promise<void> {
  const siteOverrides = flattenSite(body.site ?? {});
  const services = cleanServices(body.services);

  const pool = await db();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute<ResultSetHeader>(
      "INSERT INTO content (content_key, content_value) VALUES (?, ?) " +
        "ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)",
      [SITE_KEY, JSON.stringify(siteOverrides)]
    );

    await connection.execute<ResultSetHeader>("DELETE FROM content WHERE content_key LIKE ?", [
      `${SERVICE_PREFIX}%`,
    ]);

    for (const service of services) {
      await connection.execute<ResultSetHeader>(
        "INSERT INTO content (content_key, content_value) VALUES (?, ?)",
        [`${SERVICE_PREFIX}${service.slug}`, JSON.stringify(service)]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  revalidateSite();
}

export async function resetContent(): Promise<void> {
  const pool = await db();
  await pool.execute<ResultSetHeader>("DELETE FROM content");
  revalidateSite();
}
