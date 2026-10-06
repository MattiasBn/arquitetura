import "./globals.css";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";

import { BRAND, CONTACTS, OG_IMAGE, SITE_URL } from "@/lib/site";
import MediaLoader from "@/components/ui/media-loader";
import { CookieConsent } from "@/components/ui/cookie-consent";

/**
 * Fonte unica do site. Carregada com next/font (self-hosted, sem pedido ao
 * Google em runtime) e exposta como variavel CSS para o --font-sans.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const NOME = CONTACTS.legalName;
const TITULO = "Algugest Serviços | Construção Civil e Telecomunicações em Angola";
const DESCRICAO =
  "Construção civil, obras públicas, telecomunicações e acabamentos de interior em Luanda, Angola. Empresa angolana, prazos cumpridos e qualidade garantida.";

const KEYWORDS = [
  "construção civil Luanda",
  "obras públicas Angola",
  "telecomunicações Luanda",
  "engenharia civil Angola",
  "acabamentos de interior Luanda",
  "construtor Luanda",
  "Algugest",
  "Angola construção",
];

const IMAGEM_OG = {
  url: OG_IMAGE,
  width: 1200,
  height: 630,
  alt: `${NOME} — construção civil, obras públicas e telecomunicações em Luanda, Angola`,
};

/**
 * Base absoluta usada nas URLs canónicas, no OpenGraph e no JSON-LD.
 *
 * Ordem de preferência:
 *  1. NEXT_PUBLIC_SITE_URL, quando definida (domínio final, ex.: https://algugest.ao);
 *  2. Host do pedido — assim o link partilhado tem sempre a descrição e o
 *     logótipo certos, quer o site esteja no onrender.com, em localhost ou
 *     no domínio próprio.
 */
async function obterBase(): Promise<string> {
  const definida = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (definida) return definida.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE_URL;

  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const base = await obterBase();

  return {
    metadataBase: new URL(base),
    title: {
      default: TITULO,
      template: "%s | Algugest Serviços",
    },
    description: DESCRICAO,
    applicationName: NOME,
    authors: [{ name: NOME }],
    creator: NOME,
    publisher: NOME,
    keywords: KEYWORDS,
    category: "construction",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "pt_AO",
      url: "/",
      siteName: NOME,
      title: TITULO,
      description: DESCRICAO,
      images: [IMAGEM_OG],
    },
    twitter: {
      card: "summary_large_image",
      title: TITULO,
      description: DESCRICAO,
      images: [IMAGEM_OG.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: false },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

/** Dados estruturados para o Google — URLs absolutas da base do site. */
function dadosEstruturados(base: string) {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${base}/#organizacao`,
    name: NOME,
    alternateName: "Algugest",
    legalName: CONTACTS.legalName,
    vatID: CONTACTS.nif,
    slogan: BRAND.slogan,
    description: DESCRICAO,
    url: base,
    image: IMAGEM_OG.url,
    logo: `${base}/icon.png`,
    telephone: CONTACTS.phoneInternational,
    email: CONTACTS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Expressa – Benfica, Rua 10 de Dezembro",
      addressLocality: "Talatona",
      addressRegion: "Luanda",
      addressCountry: "AO",
    },
    areaServed: [
      { "@type": "Country", name: "Angola" },
      { "@type": "City", name: "Luanda" },
    ],
    knowsAbout: [
      "Construção civil",
      "Obras públicas",
      "Telecomunicações",
      "Acabamentos de interior",
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = await obterBase();

  return (
    <html lang="pt-AO" className={inter.variable}>
      <body>
        {/* A primeira imagem paga DNS + ligação TLS à Cloudinary; com isto a
            ligação já está pronta quando o browser pedir os ficheiros.
            (O React 19 iça estas tags para o <head> automaticamente.) */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <MediaLoader />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dadosEstruturados(base)),
          }}
        />
        {children}
      </body>
    </html>
  );
}
