import Navbar from "@/components/layout/Navibar";
import Footer from "@/components/layout/footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { Tracker } from "@/components/analytics/Tracker";

// O conteúdo vem da base de dados, por isso renderizamos a pedido (SSR).
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <WhatsAppFloat />
      <Tracker />
      <Footer />
    </>
  );
}