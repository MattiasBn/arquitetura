import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SERVICES } from "@/data/services";
import { getServiceBySlug, getServices } from "@/lib/server/content";
import { CONTACTS, SITE_URL } from "@/lib/site";
import ServiceDetailView from "@/components/site/service-detail-view";
import type { ServiceType } from "@/components/site/servicos-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return { title: "Serviço não encontrado" };

  return {
    title: `${service.title} | Algugest Serviços`,
    description: service.intro,
    alternates: { canonical: `${SITE_URL}/servicos/${service.slug}` },
    openGraph: {
      title: `${service.title} | Algugest Serviços`,
      description: service.intro,
      url: `${SITE_URL}/servicos/${service.slug}`,
      locale: "pt_AO",
      type: "article",
      images: service.images[0]
        ? [{ url: service.images[0] }]
        : [{ url: "/imagens/empresa/og-algugest.jpg" }],
    },
  };
}

function toView(service: (typeof SERVICES)[number]): ServiceType {
  return {
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    intro: service.intro,
    description: service.description,
    includes: service.includes,
    images: service.images,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const all = await getServices();
  const index = all.findIndex((s) => s.slug === service.slug);
  const others = all.filter((s) => s.slug !== service.slug);

  return (
    <ServiceDetailView
      service={toView(service)}
      index={index < 0 ? 0 : index}
      others={others.map(toView)}
      contacts={CONTACTS as unknown as Record<string, string>}
    />
  );
}