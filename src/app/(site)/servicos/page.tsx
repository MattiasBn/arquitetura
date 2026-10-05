import type { Metadata } from "next";

import { getServices } from "@/lib/server/content";
import { BRAND, CONTACTS, SITE_URL } from "@/lib/site";
import ServicosView, { type ServicesContent } from "@/components/site/servicos-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Serviços | Algugest Serviços",
  description:
    "Telecomunicações, construção civil e obras públicas, acabamentos, carpintaria, jardinagem, ar-condicionado e mais. Conheça os 9 serviços da Algugest e peça o seu orçamento.",
  alternates: { canonical: `${SITE_URL}/servicos` },
};

export default async function ServicosPage() {
  const services = await getServices();
  const content: ServicesContent = {
    services: services.map((s) => ({
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      intro: s.intro,
      description: s.description,
      includes: s.includes,
      images: s.images,
    })),
    brand: BRAND as unknown as Record<string, string>,
    contacts: CONTACTS as unknown as Record<string, string>,
  };
  return <ServicosView content={content} />;
}