import type { Metadata } from "next";

import { getServices, getSiteInfo } from "@/lib/server/content";
import HeroVideoSection from "@/components/sections/HeroVideoSection";
import { AboutImpactSection } from "@/components/home/about-impact";
import { AlgugestValuesSection } from "@/components/home/algugest-values-section";
// Importa aqui as tuas próximas secções à medida que as criares:
// import BentoGridSection from "@/components/sections/BentoGridSection";
// import SplitSection from "@/components/sections/SplitSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Construção Civil, Obras Públicas e Telecomunicações em Luanda",
  description:
    "A Algugest é uma empresa angolana de construção civil, obras públicas, telecomunicações e acabamentos de interior. Peça orçamento rápido no WhatsApp.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [{ contacts, brand, values, videos, destaques, home }, services] = await Promise.all([
    getSiteInfo(),
    getServices(),
  ]);
  return (
    <main className="min-h-screen bg-transparent">
      {/* 1. Secção Hero com Vídeo e Texto Dinâmico */}
      <HeroVideoSection
        eyebrowLabel={contacts.brandName}
        subtitle={brand.specialty}
        tagline={brand.slogan}
        videos={videos}
      />

      <AboutImpactSection
        mission={brand.mission}
        edificio={home.edificio}
        equipa={home.equipa}
        projetos={home.projetos}
        destaques={destaques}
      />
      {/* 2. Próximas secções serão adicionadas aqui em sequência */}
      <AlgugestValuesSection services={services} values={values} phoneWhatsApp={contacts.phoneWhatsApp} />
      {/* <BentoGridSection /> */}
      {/* <SplitSection /> */}
    </main>
  );
}