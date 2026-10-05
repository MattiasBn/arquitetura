import type { Metadata } from "next";

import { isAuthenticated } from "@/lib/server/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Área do Administrador | Algugest",
  description:
    "Acesso restrito à equipa Algugest para consulta de estatísticas de visitas e gestão do conteúdo do site.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
      noarchive: true,
    },
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  return (
    <main className="min-h-dvh bg-slate-100">
      {authed ? <AdminDashboard /> : <AdminLogin />}
    </main>
  );
}