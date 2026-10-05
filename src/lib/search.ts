/**
 * Indice de pesquisa do site.
 * Centraliza o conteudo de todas as paginas numa lista padrao:
 * titulo, url, grupo, descricao e palavras-chave.
 *
 * Os dados vem das fontes unicas: src/data/services.ts e src/lib/site.ts.
 */

import { SERVICES } from "@/data/services";
import { BRAND, CONTACTS, VALUES } from "@/lib/site";

export type SearchItem = {
  title: string;
  url: string;
  group: "Início" | "Serviço" | "Projeto" | "Sobre" | "Empresa" | "Contacto";
  description: string;
  keywords: string[];
};

const asKeywords = (...values: string[]) =>
  values
    .flatMap((value) => value.split(/[\s,-]+/))
    .map((word) => word.trim())
    .filter(Boolean);

export const SEARCH_INDEX: SearchItem[] = [
  // --- Páginas estáticas ---
  {
    title: "Início",
    url: "/",
    group: "Início",
    description: `Página inicial — ${BRAND.slogan}`,
    keywords: [
      "algugest",
      "início",
      "home",
      ...asKeywords(BRAND.slogan, BRAND.specialty),
      "orçamento",
      "slogan",
    ],
  },
  {
    title: "Serviços — 9 áreas",
    url: "/servicos",
    group: "Início",
    description:
      "Índice de todos os serviços da Algugest: construa o seu projeto do início ao fim.",
    keywords: ["serviços", "índice", "áreas", "orçamento", "o que fazemos"],
  },
  {
    title: "Portfólio — 18 obras",
    url: "/portfolio",
    group: "Início",
    description:
      "18 obras em fotografia e vídeo, nas especialidades da Algugest.",
    keywords: ["portfólio", "obras", "projetos", "galeria", "fotos", "vídeos", "portfolio"],
  },
  {
    title: "Sobre Nós",
    url: "/sobre",
    group: "Sobre",
    description:
      "História, missão, visão, valores e a equipa da Algugest.",
    keywords: [
      "sobre",
      "empresa",
      "equipa",
      "quem somos",
      ...asKeywords(BRAND.mission, BRAND.vision, BRAND.objective),
      "missão",
      "visão",
      "objetivo",
      "valores",
      ...VALUES.flatMap((value) => [value.title, ...asKeywords(value.text)]),
      CONTACTS.director,
      "diretor",
      "director geral",
      "sede",
      "história",
    ],
  },
  {
    title: "Contactos",
    url: "/contactos",
    group: "Contacto",
    description:
      "Todos os canais para falar com a Algugest — WhatsApp, telefone, email e morada.",
    keywords: [
      "contactos",
      "contacto",
      "telefone",
      "whatsapp",
      "email",
      "e-mail",
      "morada",
      "endereço",
      "mapa",
      "como chegar",
      ...asKeywords(CONTACTS.email, CONTACTS.address),
      CONTACTS.phoneWhatsApp,
      CONTACTS.phoneCall,
      CONTACTS.phoneInternational,
      "benfica",
      "talatona",
      "luanda",
      "hemodiálise",
      "nif",
      CONTACTS.nif,
      "orçamento",
    ],
  },

  // --- Serviços ---
  ...SERVICES.map<SearchItem>((service) => ({
    title: service.title,
    url: `/servicos/${service.slug}`,
    group: "Serviço",
    description: service.intro || service.summary,
    keywords: [
      ...asKeywords(service.title, service.summary, service.description),
      ...service.includes,
      "serviço",
      "orçamento",
    ],
  })),

  // --- Projetos (categorias do portfólio) ---
  {
    title: "Projetos de Telecomunicações",
    url: "/portfolio",
    group: "Projeto",
    description:
      "Montagem de antenas e redes de comunicação — obras reais no portfólio.",
    keywords: [
      "telecomunicações",
      "antenas",
      "torres",
      "redes",
      "sinal",
      "comunicação",
      "projeto",
      "obra",
    ],
  },
  {
    title: "Projetos de Obras Públicas",
    url: "/portfolio",
    group: "Projeto",
    description:
      "Infraestruturas e obras públicas executadas pela Algugest.",
    keywords: [
      "obras públicas",
      "infraestruturas",
      "postes",
      "iluminação pública",
      "manutenção",
      "obra",
      "projeto",
    ],
  },
  {
    title: "Projetos de Construção & Edifícios",
    url: "/portfolio",
    group: "Projeto",
    description:
      "Construção de edifícios e casas — do terreno vazio ao prédio entregue.",
    keywords: [
      "construção",
      "edifícios",
      "prédios",
      "casas",
      "imoveis",
      "imóveis",
      "obra nova",
      "obra",
      "projeto",
    ],
  },

  // --- Dados institucionais ---
  {
    title: CONTACTS.legalName,
    url: "/sobre",
    group: "Empresa",
    description: `${CONTACTS.legalName} — NIF ${CONTACTS.nif}. ${BRAND.specialty}`,
    keywords: [
      "algugest",
      "serviços",
      "lda",
      "nif",
      CONTACTS.nif,
      "sede",
      ...asKeywords(BRAND.specialty, CONTACTS.address),
      CONTACTS.director,
      "direção",
    ],
  },
];