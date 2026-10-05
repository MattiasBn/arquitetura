import type { Destaque } from "@/lib/site";

export type EditableService = {
  slug: string;
  title: string;
  summary: string;
  intro: string;
  description: string;
  includes: string[];
  images: string[];
};

export type SiteState = {
  contacts: {
    legalName: string;
    brandName: string;
    nif: string;
    phoneWhatsApp: string;
    phoneCall: string;
    email: string;
    address: string;
    director: string;
  };
  brand: { slogan: string; mission: string; vision: string; objective: string; specialty: string };
  values: { title: string; text: string }[];
  videos: string[];
  destaques: Destaque[];
  home: {
    edificio: string;
    equipa: string;
    projetos: { alt: string; image: string }[];
  };
};

export type Snapshot = {
  services: EditableService[];
  site: SiteState;
};

export const EMPTY_SITE: SiteState = {
  contacts: {
    legalName: "",
    brandName: "",
    nif: "",
    phoneWhatsApp: "",
    phoneCall: "",
    email: "",
    address: "",
    director: "",
  },
  brand: { slogan: "", mission: "", vision: "", objective: "", specialty: "" },
  values: [{ title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }],
  videos: [],
  destaques: [],
  home: { edificio: "", equipa: "", projetos: [] },
};

/** Cria um novo destaque em branco para o admin preencher. */
export function makeDestaque(): Destaque {
  return {
    id: `destaque-${Date.now()}`,
    title: "Novo destaque",
    text: "Escreva aqui a descrição do destaque.",
    image: "/imagens/obras/obra-01.jpg",
    date: new Date().toISOString().slice(0, 10),
  };
}

export const SITE_LABELS: Record<string, string> = {
  legalName: "Razão social",
  brandName: "Nome de marca",
  nif: "NIF",
  phoneWhatsApp: "WhatsApp",
  phoneCall: "Telefone (chamada)",
  email: "E-mail",
  address: "Morada",
  director: "Diretor-geral",
  slogan: "Slogan",
  mission: "Missão",
  vision: "Visão",
  objective: "Objetivo",
  specialty: "Especialidade",
};

export const SERVICE_FIELD_LABELS: Record<string, string> = {
  title: "Título",
  summary: "Resumo",
  intro: "Apresentação",
  description: "Descrição",
  includes: "Itens incluídos",
  images: "Imagens",
};

const join = (values: string[]) => values.join("|");

export function serviceFieldChanged(
  service: EditableService,
  original: EditableService | undefined,
  key: keyof EditableService
): boolean {
  if (!original) return false;
  if (key === "includes" || key === "images") return join(service[key]) !== join(original[key]);
  return service[key] !== original[key];
}

export function siteFieldChanged(
  section: keyof SiteState,
  key: string,
  site: SiteState,
  snapshot: Snapshot | null
): boolean {
  if (!snapshot) return false;
  const current = site[section] as SiteState[typeof section];
  const original = snapshot.site[section] as SiteState[typeof section];
  if (!original || !current) return false;
  if (Array.isArray(original) || Array.isArray(current)) return false;
  return (current as Record<string, unknown>)[key] !== (original as Record<string, unknown>)[key];
}

export function valueChanged(
  index: number,
  key: "title" | "text",
  site: SiteState,
  snapshot: Snapshot | null
): boolean {
  if (!snapshot) return false;
  return site.values[index][key] !== snapshot.site.values[index]?.[key];
}

export function countServicesChanges(services: EditableService[], snapshot: Snapshot | null): number {
  if (!snapshot) return 0;
  let n = 0;
  services.forEach((service, i) => {
    const original = snapshot.services[i];
    if (!original) {
      n += 1;
      return;
    }
    for (const key of ["title", "summary", "intro", "description"] as const) {
      if (service[key] !== original[key]) n += 1;
    }
    if (join(service.includes) !== join(original.includes)) n += 1;
    if (join(service.images) !== join(original.images)) n += 1;
  });
  return n;
}

export function countContactsChanges(site: SiteState, snapshot: Snapshot | null): number {
  if (!snapshot) return 0;
  let n = 0;
  for (const key of Object.keys(site.contacts) as Array<keyof SiteState["contacts"]>) {
    if (site.contacts[key] !== snapshot.site.contacts[key]) n += 1;
  }
  return n;
}

export function countBrandChanges(
  site: SiteState,
  snapshot: Snapshot | null,
  keys?: Array<keyof SiteState["brand"]>
): number {
  if (!snapshot) return 0;
  const target = keys ?? (Object.keys(site.brand) as Array<keyof SiteState["brand"]>);
  let n = 0;
  for (const key of target) {
    if (site.brand[key] !== snapshot.site.brand[key]) n += 1;
  }
  return n;
}

export function countValuesChanges(site: SiteState, snapshot: Snapshot | null): number {
  if (!snapshot) return 0;
  let n = 0;
  site.values.forEach((value, i) => {
    const original = snapshot.site.values[i];
    if (!original || value.title !== original.title) n += 1;
    if (!original || value.text !== original.text) n += 1;
  });
  return n;
}

export function countVideosChanges(site: SiteState, snapshot: Snapshot | null): number {
  if (!snapshot) return 0;
  return join(site.videos) !== join(snapshot.site.videos) ? 1 : 0;
}

export function countHomeChanges(site: SiteState, snapshot: Snapshot | null): number {
  if (!snapshot) return 0;
  let n = 0;
  const current = site.home;
  const original = snapshot.site.home;
  if (current.edificio !== original.edificio) n += 1;
  if (current.equipa !== original.equipa) n += 1;
  if (current.projetos.length !== original.projetos.length) n += 1;
  current.projetos.forEach((projeto, i) => {
    const ref = original.projetos[i];
    if (!ref || projeto.image !== ref.image || projeto.alt !== ref.alt) n += 1;
  });
  return n;
}

export function countDestaquesChanges(site: SiteState, snapshot: Snapshot | null): number {
  if (!snapshot) return 0;
  const current = site.destaques;
  const original = snapshot.site.destaques;
  let n = Math.abs(current.length - original.length);
  const max = Math.min(current.length, original.length);
  for (let i = 0; i < max; i++) {
    const a = current[i];
    const b = original[i];
    if (a.title !== b.title) n += 1;
    if (a.text !== b.text) n += 1;
    if (a.image !== b.image) n += 1;
    if (a.date !== b.date) n += 1;
  }
  return n;
}

export function countChanges(services: EditableService[], site: SiteState, snapshot: Snapshot | null): number {
  if (!snapshot) return 0;
  return (
    countServicesChanges(services, snapshot) +
    countContactsChanges(site, snapshot) +
    countBrandChanges(site, snapshot) +
    countValuesChanges(site, snapshot) +
    countVideosChanges(site, snapshot) +
    countDestaquesChanges(site, snapshot) +
    countHomeChanges(site, snapshot)
  );
}