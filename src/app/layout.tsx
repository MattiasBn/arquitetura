import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { BRAND, CONTACTS, SITE_URL } from "@/lib/site";

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
  url: "/imagens/empresa/og-algugest.jpg",
  width: 1200,
  height: 630,
  alt: `${NOME} — construção civil, obras públicas e telecomunicações em Luanda, Angola`,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

const DADOS_ESTRUTURADOS = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${SITE_URL}/#organizacao`,
  name: NOME,
  alternateName: "Algugest",
  legalName: CONTACTS.legalName,
  vatID: CONTACTS.nif,
  slogan: BRAND.slogan,
  description: DESCRICAO,
  url: SITE_URL,
  image: `${SITE_URL}${IMAGEM_OG.url}`,
  logo: `${SITE_URL}/icon.png`,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-AO" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(DADOS_ESTRUTURADOS),
          }}
        />
        {children}
      </body>
    </html>
  );
}
