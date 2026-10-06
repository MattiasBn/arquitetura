/**
 * Dados institucionais da Algugest.
 * Fonte: Carta de Apresentacao 2025 (pagina 1).
 * Alterar aqui e reflecte no layout, no rodape, nas paginas de servico e no SEO.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://algugest.ao";

export const CONTACTS = {
  legalName: "ALGUGEST - SERVIÇOS, (SU), LDA",
  brandName: "Algugest",
  nif: "5002302713",
  // 950 521 741 é o WhatsApp; 925 212 282 é a chamada normal.
  phoneWhatsApp: "950 521 741",
  phoneCall: "925 212 282",
  phonePrimary: "950 521 741",
  phoneSecondary: "925 212 282",
  phoneInternational: "+244 950 521 741",
  email: "algugestservicoslda@gmail.com",
  address: "Via Expressa – Benfica, Rua 10 de Dezembro, Bairro Benfica, Talatona, Luanda",
  director: "Armindo António Augusto",
} as const;

/** Ligação para abrir o WhatsApp já com uma mensagem pré-escrita. */
export function whatsappLink(message?: string): string {
  const number = `244${CONTACTS.phoneWhatsApp.replace(/\s/g, "")}`;
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Carrossel de vídeos da página inicial (public/headervideos/).
 * Editável no admin (Início → Vídeos do carrossel).
 */
export const HERO_VIDEOS = [
  "https://res.cloudinary.com/z50slpsg/video/upload/v1791285260/algugest/headervideos/v002.mp4",
  "https://res.cloudinary.com/z50slpsg/video/upload/v1791285431/algugest/headervideos/v005.mp4",
  "https://res.cloudinary.com/z50slpsg/video/upload/v1791285435/algugest/headervideos/v007.mp4",
  "https://res.cloudinary.com/z50slpsg/video/upload/v1791285430/algugest/headervideos/v004.mp4",
  "https://res.cloudinary.com/z50slpsg/video/upload/v1791285433/algugest/headervideos/v006.mp4",
];

/**
 * Fotografias da página inicial (Início → Fotos da Home).
 * "edificio" é a imagem em largura total; "equipa" a do bloco final;
 * "projetos" as fotos da galeria de obras (ampliáveis no site).
 */
export const HOME_IMAGES: {
  edificio: string;
  equipa: string;
  projetos: Array<{ alt: string; image: string }>;
} = {
  edificio: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284926/algugest/imagens/edificios/edificio.jpg",
  equipa: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284941/algugest/imagens/empresa/equipa.jpg",
  projetos: [
    { alt: "Obra 1", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285140/algugest/imagens/obras/obra-01.jpg" },
    { alt: "Obra 2", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285142/algugest/imagens/obras/obra-02.jpg" },
    { alt: "Obra 3", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285143/algugest/imagens/obras/obra-03.jpg" },
    { alt: "Obra 4", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285145/algugest/imagens/obras/obra-04.jpg" },
    { alt: "Obra 5", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285147/algugest/imagens/obras/obra-05.jpg" },
    { alt: "Obra 6", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285148/algugest/imagens/obras/obra-06.jpg" },
    { alt: "Obra 7", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285149/algugest/imagens/obras/obra-07.jpg" },
    { alt: "Obra 8", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285151/algugest/imagens/obras/obra-10.jpg" },
    { alt: "Obra 9", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285152/algugest/imagens/obras/obra-18.jpg" },
    { alt: "Obra 10", image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285153/algugest/imagens/obras/obra-19.jpg" },
  ],
};

/**
 * Destaques / novidades publicados pelo administrador.
 * O mais recente aparece na home (carrossel abaixo da imagem principal) e
 * todos ficam listados na página pública /destaques.
 */
export type Destaque = {
  id: string;
  title: string;
  text: string;
  image: string;
  /** Data em formato ISO (YYYY-MM-DD) para o seletor de data do admin. */
  date: string;
};

export const DESTAQUES: Destaque[] = [
  {
    id: "destaque-1",
    title: "Telecomunicações concluídas em Talatona",
    text: "Concluímos a instalação e manutenção de infraestrutura de telecomunicações numa nova urbanização em Talatona, com entrega dentro do prazo e sem interrupções.",
    image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285158/algugest/imagens/telecomunicacoes/obra-08.jpg",
    date: "2026-01-20",
  },
  {
    id: "destaque-2",
    title: "Nova frente de obras públicas na Via Expressa",
    text: "Arrancaram os trabalhos de construção civil e obras públicas na Via Expressa, reforçando a nossa presença em Luanda com equipas e equipamento próprios.",
    image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284908/algugest/imagens/construcao-civil/obra-20.jpg",
    date: "2026-02-05",
  },
  {
    id: "destaque-3",
    title: "Equipa reforçada para 2026",
    text: "Alargámos o nosso quadro técnico com novos colaboradores especializados, para responder com ainda mais rapidez aos projetos dos nossos clientes.",
    image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284941/algugest/imagens/empresa/equipa.jpg",
    date: "2026-02-18",
  },
];

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** Converte "YYYY-MM-DD" em "20 de janeiro de 2026" (sem depender do locale). */
export function formatDestaqueDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const name = MONTHS_PT[Number(month) - 1] ?? "";
  return `${Number(day)} de ${name} de ${year}`;
}

export const BRAND = {
  slogan: "A tua melhor escolha.",
  mission:
    "Trabalhar de forma a satisfazer as necessidades dos nossos clientes com maior rapidez e qualidade.",
  vision:
    "Tornar-se uma marca de maior referência, onde pessoas singulares ou coletivas possam solicitar os serviços, com confiança em todo o território nacional e internacional.",
  objective: "Prestar serviços de alta qualidade de forma rápida.",
  specialty:
    "Telecomunicações, Construção Civil e Obras Públicas, com quadro técnico experiente.",
} as const;

/** Valores institucionais (pagina 1 da carta). */
export const VALUES = [
  {
    title: "Inovação",
    text: "Buscamos constantemente soluções criativas e eficazes que superem as expectativas dos nossos clientes.",
  },
  {
    title: "Integridade",
    text: "Agimos com respeito, honestidade e transparência em todas as nossas ações e relações, primando pela solidariedade e amor ao próximo.",
  },
  {
    title: "Comprometimento",
    text: "Estamos comprometidos com o sucesso dos nossos clientes, colaboradores e parceiros prestando um atendimento eficiente e rápido. A Algugest é uma empresa digital usando IA, o que significa que tem a capacidade de dar resposta de forma muito rápida.",
  },
] as const;
