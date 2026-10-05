import type { Metadata } from "next";

import { getSiteInfo } from "@/lib/server/content";
import { SITE_URL } from "@/lib/site";
import { DestaquesView } from "@/components/site/destaques-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Destaques | Algugest Serviços",
  description:
    "Novidades, obras concluídas e marcos da Algugest — telecomunicações, construção civil e obras públicas em Luanda. O destaque mais recente aparece também na página inicial.",
  alternates: { canonical: `${SITE_URL}/destaques` },
};

export default async function DestaquesPage() {
  const { destaques } = await getSiteInfo();
  return <DestaquesView destaques={destaques} />;
}
