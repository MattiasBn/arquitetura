"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Clock,
  ImagePlus,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Ed } from "@/components/admin/editing-context";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Tilt } from "@/components/ui/tilt";

export type ServiceType = {
  slug: string;
  title: string;
  summary: string;
  intro: string;
  description: string;
  includes: string[];
  images: string[];
};

export type ServicesContent = {
  brand: Record<string, string>;
  contacts: Record<string, string>;
  services: ServiceType[];
};

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Fale connosco",
    text: "Diga-nos o que precisa — por telefone, email ou no formulário. A sua pedido chega direto à equipa responsável.",
  },
  {
    number: "02",
    icon: Clock,
    title: "Orçamento rápido",
    text: "A Algugest é uma empresa digital apoiada em IA: responde com um orçamento claro e sem demoras, normalmente em menos de 24h.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Execução garantida",
    text: "Técnicos experientes, materiais de qualidade e acompanhamento do início ao fim. O seu projeto entregue como prometido.",
  },
];

const trustPoints = [
  { icon: Sparkles, text: "Resposta rápida com apoio de IA" },
  { icon: ShieldCheck, text: "Qualidade assegurada do início ao fim" },
  { icon: Clock, text: "Experiência real em Angola" },
];

export default function ServicosView({
  content,
  onEditCover,
  onOpenService,
}: {
  content: ServicesContent;
  onEditCover?: (index: number) => void;
  onOpenService?: (slug: string) => void;
}) {
  const { services, brand, contacts } = content;
  const wa = (message: string) =>
    `https://wa.me/244${(contacts.phoneWhatsApp ?? "").replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
  const tel = (contacts.phoneCall ?? "").replace(/\s/g, "");

  return (
    <main className="bg-transparent">
      {/* HERO — vídeo do header como pano de fundo */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-brand-deep">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/headervideos/v002.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        >
          O teu navegador não suporta vídeos HTML5.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/85 to-brand-deep/35" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-16 sm:px-8 lg:px-12">
          <Reveal>
            <span className="text-sm font-semibold text-brand-blue uppercase">
              Os Nossos Serviços
            </span>
            <h1 className="text-shine-light mt-4 max-w-3xl text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Do conceito à realidade,
              <br />
              <span className="text-white">em qualquer área.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Nove áreas de serviço complementares, um só interlocutor
              responsável. Da obra grande ao detalhe pequeno — a Algugest faz,
              entrega e acompanha.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={wa("Olá! Gostaria de pedir um orçamento.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white transition-colors"
              >
                <MessageCircle className="size-4" />
                Pedir orçamento no WhatsApp
              </a>
              <a
                href={`tel:${tel}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10"
              >
                <Phone className="size-4" />
                Ligar: {contacts.phoneCall}
              </a>
              <a
                href="#lista"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10"
              >
                Ver os serviços
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {trustPoints.map((point) => (
                <li key={point.text} className="flex items-center gap-2.5 text-sm font-medium text-white/85">
                  <point.icon className="size-4 text-brand-blue" />
                  {point.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* LISTA DE SERVIÇOS — linhas alternadas com as páginas dinâmicas */}
      <section id="lista" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <Reveal>
          <div className="max-w-3xl">
            <span className="text-sm font-semibold text-brand-blue uppercase">
              O que fazemos
            </span>
            <h2 className="text-shine mt-3 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
              Soluções completas, sempre com um responsável.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Com a Algugest tem um único responsável, um orçamento rápido e a
              garantia de qualidade em cada obra. Escolha a área de que precisa e
              fale connosco com um clique.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-24">
          {services.map((service, index) => {
            const reversed = index % 2 === 1;
            const cover = service.images[0];

            return (
              <Reveal key={service.slug} delay={0.05}>
                <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  {/* Imagem */}
                  <div className={cn("lg:col-span-7", reversed && "lg:order-2")}>
                    <Tilt max={5} scale={1.01} className="relative rounded-lg">
                      <div className="group relative block aspect-[16/10] overflow-hidden rounded-lg bg-surface">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={service.title}
                            fill
                            quality={90}
                            sizes="(min-width: 1024px) 55vw, 100vw"
                            className="object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center bg-brand-blue text-white/90">
                            <span className="text-7xl font-extrabold">
                              {service.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-transparent" />
                        <span className="absolute top-5 right-5 grid size-12 place-items-center rounded-full bg-white text-brand-navy opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
                          <ArrowUpRight className="size-5" />
                        </span>
                        {onEditCover && (
                          <span className="absolute top-4 left-4 inline-flex">
                            <button
                              type="button"
                              onClick={() => onEditCover(index)}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-brand-navy shadow-md transition-colors hover:bg-brand-blue hover:text-white"
                            >
                              <ImagePlus className="size-3.5" /> Foto de capa
                            </button>
                          </span>
                        )}
                      </div>
                    </Tilt>
                  </div>

                  {/* Conteúdo */}
                  <div className={cn("lg:col-span-5", reversed && "lg:order-1")}>
                    <span className="text-sm font-semibold text-brand-blue uppercase">
                      Serviço Algugest
                    </span>
                    <Ed id={`services.${index}.title`} label="Título" className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {service.title}
                      </h3>
                    </Ed>
                    <Ed
                      id={`services.${index}.intro`}
                      label="Apresentação"
                      className="mt-4 text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl"
                    >
                      <p className="mt-4 text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                        {service.intro}
                      </p>
                    </Ed>
                    {service.includes.length > 0 && (
                      <Ed id={`services.${index}.includes`} label="Itens incluídos" className="mt-5 flex flex-wrap gap-2">
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {service.includes.map((item) => (
                            <li
                              key={item}
                              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/80"
                            >
                              <Check className="size-3.5 text-brand-blue" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Ed>
                    )}
                    {onOpenService ? (
                      <button
                        type="button"
                        onClick={() => onOpenService(service.slug)}
                        className="group mt-7 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-blue uppercase tracking-wider transition-colors hover:text-brand-navy"
                      >
                        Saber mais
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                    ) : (
                      <Link
                        href={`/servicos/${service.slug}`}
                        className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-blue uppercase tracking-wider transition-colors hover:text-brand-navy"
                      >
                        Saber mais
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* COMO TRABALHAMOS */}
      <section className="border-y border-foreground/10 bg-foreground/5 py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-sm font-semibold text-brand-blue uppercase">
                Como trabalhamos
              </span>
              <h2 className="text-shine mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Simples de pedir, rápido a responder.
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.12}>
                <div className="relative h-full rounded-lg border border-foreground/10 bg-white p-8">
                  <div className="grid size-12 place-items-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <step.icon className="size-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand-depth py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <Reveal>
            <h2 className="text-shine-light mx-auto max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl">
              Pronto para começar o seu projeto?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              Peça o seu orçamento hoje — respondemos rápido, sem compromisso e
              com uma proposta clara para o que precisa.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={wa("Olá! Gostaria de um orçamento para um projeto.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white transition-colors"
              >
                <MessageCircle className="size-4" />
                WhatsApp: <Ed id="contacts.phoneWhatsApp" label="WhatsApp" className="inline-flex items-center gap-1 text-sm font-bold text-white">{contacts.phoneWhatsApp}</Ed>
              </a>
              <a
                href={`tel:${tel}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-navy transition-colors"
              >
                <Phone className="size-4" />
                Ligar: {contacts.phoneCall}
              </a>
              <a
                href={`mailto:${contacts.email}?subject=${encodeURIComponent("Pedido de orçamento")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10"
              >
                <Mail className="size-4" />
                Pedir por email
              </a>
            </div>
            <p className="mt-8 text-sm text-white/60">{contacts.address}</p>
            <p className="mt-1 text-sm text-white/60">
              <Ed id="brand.slogan" label="Slogan" block={false}>{brand.slogan}</Ed> — <Ed id="contacts.legalName" label="Razão social" block={false}>{contacts.legalName}</Ed>
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}