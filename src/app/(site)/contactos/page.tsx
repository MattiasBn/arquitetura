import type { Metadata } from "next";

import { getSiteInfo } from "@/lib/server/content";
import { SITE_URL } from "@/lib/site";
import ContactosView from "@/components/site/contactos-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contactos | Algugest Serviços",
  description:
    "Contacte a Algugest - SERVIÇOS, (SU), LDA. WhatsApp 950 521 741, telefone 925 212 282, email algugestservicoslda@gmail.com. Visite-nos no Bairro Benfica, Rua 10 de Dezembro, Luanda.",
  alternates: { canonical: `${SITE_URL}/contactos` },
};

export default async function ContactosPage() {
  const { contacts, brand } = await getSiteInfo();
  return (
    <ContactosView
      content={{
        brand: brand as unknown as Record<string, string>,
        contacts: contacts as unknown as Record<string, string>,
      }}
    />
  );
}