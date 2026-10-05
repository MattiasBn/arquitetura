import type { Metadata } from "next";

import { getSiteInfo } from "@/lib/server/content";
import { SITE_URL } from "@/lib/site";
import SobreView from "@/components/site/sobre-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sobre Nós | Algugest Serviços",
  description:
    "Conheça a Algugest - SERVIÇOS, (SU), LDA: telecomunicações, construção civil e obras públicas. Missão, visão, valores e a equipa por trás do slogan 'A tua melhor escolha'.",
  alternates: { canonical: `${SITE_URL}/sobre` },
};

export default async function SobrePage() {
  const { contacts, brand, values } = await getSiteInfo();
  return (
    <SobreView
      content={{
        brand: brand as unknown as Record<string, string>,
        contacts: contacts as unknown as Record<string, string>,
        values: values.map((v) => ({ title: v.title, text: v.text })),
      }}
    />
  );
}