"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock,
  ImagePlus,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Ed } from "@/components/admin/editing-context";
import { Reveal } from "@/components/ui/reveal";
import type { ServiceType } from "./servicos-view";

const promises = [
  {
    icon: MessageCircle,
    title: "Resposta rápida",
    text: "Fale connosco e receba um orçamento sem demoras. A Algugest usa tecnologia e IA para responder em menos de 24h.",
  },
  {
    icon: ShieldCheck,
    title: "Qualidade garantida",
    text: "Materiais de qualidade e técnicos experientes em todas as etapas, do planeamento à entrega final.",
  },
  {
    icon: Sparkles,
    title: "Experiência real",
    text: "Obras públicas, telecomunicações e acabamentos executados em Angola com responsabilidade e rigor.",
  },
  {
    icon: Clock,
    title: "Acompanhamento total",
    text: "Um único interlocutor responsável, do projeto à manutenção. Você nunca fica sem resposta.",
  },
];

export default function ServiceDetailView({
  service,
  index,
  others,
  contacts,
  onBack,
  onOpenSlug,
  onPickImage,
}: {
  service: ServiceType;
  index: number;
  others: ServiceType[];
  contacts: Record<string, string>;
  onBack?: () => void;
  onOpenSlug?: (slug: string) => void;
  onPickImage?: (imageIndex: number) => void;
}) {
  const wa = (message: string) =>
    `https://wa.me/244${(contacts.phoneWhatsApp ?? "").replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
  const tel = (contacts.phoneCall ?? "").replace(/\s/g, "");

  const backContent = onBack ? (
    <button
      type="button"
      onClick={onBack}
      className="group inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      Todos os serviços
    </button>
  ) : (
    <Link
      href="/#servicos"
      className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      Todos os serviços
    </Link>
  );

  return (
    <main className="bg-transparent">
      {/* Cabecalho + introdução de marketing */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-32 pb-12 sm:px-8 lg:pt-40">
        <Reveal>
          {backContent}

          <span className="mt-8 block text-sm font-semibold text-brand-blue uppercase">
            Serviço Algugest
          </span>
          <h1 className="text-shine mt-3 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <Ed id={`services.${index}.title`} label="Título" block={false}>{service.title}</Ed>
          </h1>
          <Ed id={`services.${index}.intro`} label="Apresentação" className="mt-6 max-w-3xl text-xl leading-relaxed font-medium text-foreground sm:text-2xl">
            <p className="mt-6 max-w-3xl text-xl leading-relaxed font-medium text-foreground sm:text-2xl">
              {service.intro}
            </p>
          </Ed>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={wa(`Olá! Gostaria de um orçamento para: ${service.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white transition-colors"
            >
              <MessageCircle className="size-4" />
              Pedir orçamento no WhatsApp
            </a>
            <a
              href={`tel:${tel}`}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-bold text-white transition-colors hover:opacity-90"
            >
              <Phone className="size-4" />
              Ligar agora
            </a>
          </div>
        </Reveal>
      </section>

      {/* Fotos */}
      {service.images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {service.images.map((src, i) => (
                <div
                  key={src}
                  className={`relative overflow-hidden rounded-lg bg-foreground/5 ${
                    i === 0
                      ? "aspect-[16/10] sm:col-span-2"
                      : "aspect-[16/10]"
                  }`}
                >
                  {onPickImage && (
                    <button
                      type="button"
                      onClick={() => onPickImage(i)}
                      className="absolute top-3 left-3 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-brand-navy shadow-md transition-colors hover:bg-brand-blue hover:text-white"
                    >
                      <ImagePlus className="size-3.5" /> {i === 0 ? "Capa" : "Foto"}
                    </button>
                  )}
                  <Image
                    src={src}
                    alt={`${service.title}${service.images.length > 1 ? ` — imagem ${i + 1}` : ""}`}
                    fill
                    quality={90}
                    priority={i === 0}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
            {service.images.length > 1 && (
              <p className="mt-3 text-sm font-semibold text-muted uppercase">
                Galeria do serviço
              </p>
            )}
          </Reveal>
        </section>
      )}

      {/* CTA intermédio — levar o cliente à ação */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-12 sm:px-8">
        <Reveal>
          <div className="bg-brand-depth rounded-lg px-7 py-10 sm:px-10 lg:px-12">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-shine-light text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Precisa deste serviço?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                  Peça o seu orçamento agora — respondemos rápido, sem compromisso
                  e com uma proposta clara para o seu projeto.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={wa(`Olá! Gostaria de um orçamento para: ${service.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white transition-colors"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp
                </a>
                <a
                  href={`tel:${tel}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10"
                >
                  <Phone className="size-4" />
                  {contacts.phoneCall}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Descricao + contacto */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-24">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-bold sm:text-3xl">Sobre este serviço</h2>
              <Ed id={`services.${index}.description`} label="Descrição" className="mt-5 space-y-5">
                <div className="mt-5 space-y-5">
                  {service.description.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "text-pretty text-lg leading-loose font-medium text-foreground sm:text-xl"
                          : "text-pretty text-base leading-loose text-muted sm:text-lg"
                      }
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </Ed>

              {service.includes.length > 0 && (
                <>
                  <h3 className="mt-12 text-lg font-bold">O que está incluído</h3>
                  <Ed id={`services.${index}.includes`} label="Itens incluídos" className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {service.includes.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3.5 transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5"
                        >
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-blue/10 text-brand-blue">
                            <Check className="size-4" />
                          </span>
                          <span className="text-sm font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Ed>
                </>
              )}

              <h3 className="mt-12 text-lg font-bold">
                Porque escolher a Algugest?
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {promises.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-foreground/10 bg-foreground/5 p-5"
                  >
                    <div className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                      <item.icon className="size-5" />
                    </div>
                    <h4 className="mt-4 font-bold">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-lg bg-foreground p-7 text-white sm:p-9">
                <h2 className="text-xl font-bold sm:text-2xl">Fale connosco</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Peça um orçamento para este serviço. Respondemos de forma rápida.
                </p>

                <div className="mt-7 space-y-3">
                  <a
                    href={wa(`Olá! Gostaria de um orçamento para: ${service.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp: <Ed id="contacts.phoneWhatsApp" label="WhatsApp" className="text-sm font-bold text-white">{contacts.phoneWhatsApp}</Ed>
                  </a>
                  <a
                    href={`tel:${tel}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10"
                  >
                    <Phone className="size-4" />
                    Chamada: {contacts.phoneCall}
                  </a>
                  <a
                    href={`mailto:${contacts.email}?subject=${encodeURIComponent(
                      `Pedido de orçamento — ${service.title}`
                    )}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
                  >
                    <Mail className="size-4" />
                    Pedir por email
                  </a>
                </div>

                <Ed id="contacts.address" label="Morada" className="mt-7 space-y-3 text-sm">
                  <ul className="mt-7 space-y-3 text-sm">
                    <li className="flex items-start gap-3 text-white/90">
                      <MapPin className="mt-0.5 size-4 shrink-0" />
                      <span>{contacts.address}</span>
                    </li>
                  </ul>
                </Ed>
              </div>
            </aside>
          </div>
        </Reveal>
      </section>

      {/* Outros servicos */}
      <section className="border-t border-foreground/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">Outros serviços</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {others.map((s, index) => (
              <Reveal key={s.slug} delay={index * 0.04}>
                <li>
                  {onOpenSlug ? (
                    <button
                      type="button"
                      onClick={() => onOpenSlug(s.slug)}
                      className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-foreground/10 px-5 py-4 text-left transition-colors hover:border-foreground/30 hover:bg-foreground/5"
                    >
                      <div>
                        <span className="block text-base font-bold sm:text-lg">{s.title}</span>
                        <span className="mt-1 block text-sm text-muted">{s.intro}</span>
                      </div>
                      <ArrowUpRight className="size-5 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  ) : (
                    <Link
                      href={`/servicos/${s.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-foreground/10 px-5 py-4 transition-colors hover:border-foreground/30 hover:bg-foreground/5"
                    >
                      <div>
                        <span className="block text-base font-bold sm:text-lg">{s.title}</span>
                        <span className="mt-1 block text-sm text-muted">{s.intro}</span>
                      </div>
                      <ArrowUpRight className="size-5 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}