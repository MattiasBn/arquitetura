import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfólio de Obras e Projetos",
  description:
    "Veja obras, edifícios e projetos de telecomunicações da Algugest em Angola. Vídeos e fotografias reais de construção civil e obras públicas.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}