"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  HeartHandshake,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Ed } from "@/components/admin/editing-context";
import { Reveal } from "@/components/ui/reveal";
import { Tilt } from "@/components/ui/tilt";

type SiteContent = {
  brand: Record<string, string>;
  contacts: Record<string, string>;
  values: Array<{ title: string; text: string }>;
};

// Galeria "no terreno" com as fotografias reais das obras.
const GALLERY = [
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285140/algugest/imagens/obras/obra-01.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791284929/algugest/imagens/edificios/obra-12.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285145/algugest/imagens/obras/obra-04.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285158/algugest/imagens/telecomunicacoes/obra-08.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791284926/algugest/imagens/edificios/edificio.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285142/algugest/imagens/obras/obra-02.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791284931/algugest/imagens/edificios/obra-16.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285147/algugest/imagens/obras/obra-05.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791284930/algugest/imagens/edificios/obra-15.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791284908/algugest/imagens/construcao-civil/obra-20.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285163/algugest/imagens/telecomunicacoes/obra-11.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285143/algugest/imagens/obras/obra-03.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791284933/algugest/imagens/edificios/obra-17.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285149/algugest/imagens/obras/obra-07.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285152/algugest/imagens/obras/obra-18.jpg",
  "https://res.cloudinary.com/z50slpsg/image/upload/v1791285153/algugest/imagens/obras/obra-19.jpg",
];

const stats = [
  { value: "9", label: "Áreas de serviço complementares" },
  { value: "18+", label: "Obras no portfólio" },
  { value: "24h", label: "Resposta média a orçamentos" },
  { value: "1", label: "Responsável por todo o projeto" },
];

const identityItems = (brand: Record<string, string>) => [
  {
    icon: Target,
    title: "Missão",
    text: brand.mission,
    id: "brand.mission",
    label: "Missão",
  },
  {
    icon: Eye,
    title: "Visão",
    text: brand.vision,
    id: "brand.vision",
    label: "Visão",
  },
  {
    icon: Building2,
    title: "Objetivo",
    text: brand.objective,
    id: "brand.objective",
    label: "Objetivo",
  },
];

const valueIcons = [Lightbulb, ShieldCheck, HeartHandshake];

export default function SobreView({
  content,
  onOpenServices,
}: {
  content: SiteContent;
  onOpenServices?: () => void;
}) {
  const { contacts, brand, values } = content;
  const wa = (message: string) =>
    `https://wa.me/244${(contacts.phoneWhatsApp ?? "").replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
  const items = identityItems(brand);

  return (
    <main className="bg-transparent">
      {/* HERO */}
      <section className="bg-brand-depth pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <span className="text-sm font-semibold text-brand-blue uppercase">
              Sobre Nós
            </span>
            <h1 className="text-shine-light mt-3 max-w-4xl text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              A tua melhor <br className="hidden sm:inline" />
              <span className="text-white">escolha.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              A Algugest é uma empresa que presta diversos serviços, tendo como
              especialidade o ramo de Telecomunicações, Construção Civil e Obras
              Públicas, com um quadro técnico de cidadãos de elevada experiência
              para atender o mercado.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={wa("Olá! Conheci a Algugest pelo site e gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white transition-colors"
              >
                <MessageCircle className="size-4" />
                Falar connosco
              </a>
              <a
                href="#quem-somos"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10"
              >
                Conhecer a equipa
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUEM SOMOS — texto oficial + equipa */}
      <section id="quem-somos" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Texto oficial da carta */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="text-sm font-semibold text-brand-blue uppercase">
                Quem somos
              </span>
              <h2 className="text-shine mt-3 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
                Uma empresa digital, com mãos de obra.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Com sede social em Luanda, Município de Talatona, Comuna de
                Benfica, a Algugest — Serviços, (SU), LDA nasce para responder ao
                mercado com rapidez, qualidade e responsabilidade em cada
                projeto. Somos uma empresa digital apoiada em IA: conseguimos dar
                resposta de forma muito rápida, sem abrir mão do trabalho
                cuidadoso e executado por técnicos experientes.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Cientes da responsabilidade que a empresa carrega, estamos
                comprometidos em oferecer serviços da mais alta qualidade do
                mercado, impulsionados pela experiência e dinamismo dos nossos
                técnicos.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <Building2 className="size-4" />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">
                      <Ed id="contacts.legalName" label="Razão social" block={false}>{contacts.legalName}</Ed>
                    </p>
                    <Ed id="contacts.nif" label="NIF" className="text-sm text-muted">
                      <p className="text-sm text-muted">NIF {contacts.nif}</p>
                    </Ed>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">Sede social</p>
                    <p className="text-sm text-muted">
                      Bairro Benfica, Rua 10 de Dezembro, casa s/nº, próximo ao
                      Centro de Hemodiálise, Talatona, Luanda.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <UsersIcon className="size-4" />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">Direção-Geral</p>
                    <p className="text-sm text-muted">
                      <Ed id="contacts.director" label="Diretor-geral" block={false}>{contacts.director}</Ed>, Director Geral.
                    </p>
                  </div>
                </li>
              </ul>
            </Reveal>
          </div>

          {/* Equipa no terreno */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <Tilt max={6} scale={1.02} className="relative">
                <div className="relative overflow-hidden rounded-lg bg-surface">
                  <Image
                    src="https://res.cloudinary.com/z50slpsg/image/upload/v1791284941/algugest/imagens/empresa/equipa.jpg"
                    alt="Equipa da Algugest no terreno"
                    width={1200}
                    height={900}
                    quality={92}
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="aspect-[4/3] w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-shine-light text-xl font-extrabold">
                      A equipa Algugest
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/80">
                      Experiência real, todos os dias, em todas as obras.
                    </p>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSÃO / VISÃO / OBJETIVO */}
      <section className="border-y border-foreground/10 bg-foreground/5 py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-sm font-semibold text-brand-blue uppercase">
                O que nos move
              </span>
              <h2 className="text-shine mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Missão, visão e propósito claros.
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.12}>
                <div className="relative h-full rounded-lg border border-foreground/10 bg-white p-8">
                  <div className="grid size-12 place-items-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-tight">
                    {item.title}
                  </h3>
                  <Ed id={item.id} label={item.label} className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                      {item.text}
                    </p>
                  </Ed>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-brand-blue uppercase">
              Os nossos valores
            </span>
            <h2 className="text-shine mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Aquilo em que acreditamos todos os dias.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {values.map((value, index) => {
            const Icon = valueIcons[index % valueIcons.length];
            return (
              <Reveal key={`${value.title}-${index}`} delay={index * 0.12}>
                <div className="bg-brand-depth relative h-full rounded-lg p-8">
                  <div className="relative">
                    <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-white">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-shine-light mt-6 text-xl font-extrabold tracking-tight">
                      <Ed id={`values.${index}.title`} label={`Valor ${index + 1}`} block={false}>{value.title}</Ed>
                    </h3>
                    <Ed id={`values.${index}.text`} label={`Descrição do valor ${index + 1}`} className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                      <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
                        {value.text}
                      </p>
                    </Ed>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="rounded-lg border border-foreground/10 bg-white p-7">
                <p className="text-shine text-4xl font-extrabold tabular-nums sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-muted">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALERIA — a equipa no terreno */}
      <section className="border-y border-foreground/10 bg-foreground/5 py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <span className="text-sm font-semibold text-brand-blue uppercase">
                  No terreno
                </span>
                <h2 className="text-shine mt-3 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
                  O trabalho entra pelo ecrã.
                </h2>
              </div>
              <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
                Do detalhe do acabamento à estrutura do edifício: fotografias
                reais dos nossos estaleiros e montagens.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 columns-2 gap-3 md:columns-4">
            {GALLERY.map((src, index) => (
              <Reveal key={src} delay={(index % 4) * 0.04} className="mb-3 break-inside-avoid">
                <div className="overflow-hidden rounded-lg bg-surface">
                  <Image
                    src={src}
                    alt={`Trabalho da Algugest — foto ${index + 1}`}
                    width={800}
                    height={600}
                    quality={85}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
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
              Vamos construir o próximo capítulo juntos?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              Conheça melhor os nossos serviços ou fale diretamente com a equipa.
              Rápidos a responder, dedicados a entregar.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {onOpenServices ? (
                <button
                  type="button"
                  onClick={onOpenServices}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-navy transition-colors"
                >
                  Ver os serviços
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <Link
                  href="/servicos"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-navy transition-colors"
                >
                  Ver os serviços
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <a
                href={wa("Olá! Gostaria de falar com a equipa da Algugest.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white transition-colors"
              >
                <MessageCircle className="size-4" />
                WhatsApp: <Ed id="contacts.phoneWhatsApp" label="WhatsApp" className="inline-flex items-center gap-1 text-sm font-bold text-white">{contacts.phoneWhatsApp}</Ed>
              </a>
              <a
                href={`tel:${(contacts.phoneCall ?? "").replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10"
              >
                <Phone className="size-4" />
                Ligar: {contacts.phoneCall}
              </a>
              <a
                href={`mailto:${contacts.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10"
              >
                <Mail className="size-4" />
                Email
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}