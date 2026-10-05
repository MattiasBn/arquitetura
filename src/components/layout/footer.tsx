import { getSiteInfo } from "@/lib/server/content";
import FooterShell from "@/components/layout/footer-shell";

export default async function Footer() {
  const { contacts } = await getSiteInfo();
  return <FooterShell contacts={contacts as unknown as Record<string, string>} />;
}