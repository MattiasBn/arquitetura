"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  FileText,
  Building2,
} from "lucide-react";

import { Ed } from "@/components/admin/editing-context";
import { Reveal } from "@/components/ui/reveal";
import { Tilt } from "@/components/ui/tilt";

type SiteContent = {
  brand: Record<string, string>;
  contacts: Record<string, string>;
};

// Morada exata conforme a Carta de Apresentação 2025.
const ADDRESS = {
  lines: [
    "Rua 10 de Dezembro, casa s/nº,",
    "Bairro Benfica, Talatona,",
    "Luanda — Angola.",
  ],
  landmark: "Próximo ao Centro de Hemodiálise, na Via Expressa.",
};

// Consulta usada no mapa embutido (Google Maps, sem sair do site).
const MAP_QUERY =
  "Rua 10 de Dezembro, Bairro Benfica, Talatona, Luanda, Angola";
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  MAP_QUERY
)}&z=16&ie=UTF8&iwloc=&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAP_QUERY
)}`;

export default function ContactosView({ content }: { content: SiteContent }) {
  const { contacts, brand } = content;
  const wa = (message: string) =>
    `https://wa.me/244${contacts.phoneWhatsApp ?? ""}?text=${encodeURIComponent(message)}`;

  const contactCards = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      highlight: contacts.phoneWhatsApp,
      text: "Resposta rápida, normalmente em minutos durante o horário de trabalho.",
      href: wa("Olá! Gostaria de falar com a equipa da Algugest."),
      cta: "Abrir conversa",
      id: "contacts.phoneWhatsApp",
      label: "WhatsApp",
    },
    {
      icon: Phone,
      title: "Chamada normal",
      highlight: contacts.phoneCall,
      text: "Prefere falar? Ligue-nos diretamente para tratar do seu projeto.",
      href: `tel:${(contacts.phoneCall ?? "").replace(/\s/g, "")}`,
      cta: "Ligar agora",
      id: "contacts.phoneCall",
      label: "Chamada normal",
    },
    {
      icon: Mail,
      title: "E-mail",
      highlight: contacts.email,
      text: "Envie um email e receba resposta com todo o acompanhamento.",
      href: `mailto:${contacts.email}`,
      cta: "Escrever email",
      id: "contacts.email",
      label: "E-mail",
    },
    {
      icon: Building2,
      title: "NIF da empresa",
      highlight: contacts.nif,
      text: "Dados fiscais para faturas e contratos institucionais.",
      href: "#mapa",
      cta: "Ver morada",
      id: "contacts.nif",
      label: "NIF",
    },
  ];

  return (
    <main className="bg-transparent">
      {/* HERO */}
      <section className="bg-brand-depth pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <span className="text-sm font-semibold text-brand-blue uppercase">
              Contactos
            </span>
            <h1 className="text-shine-light mt-3 max-w-4xl text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Estamos aqui, <br className="hidden sm:inline" />
              <span className="text-white">prontos a responder.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Um contacto e um responsável para o seu projeto. Pelo WhatsApp,
              telefone, email ou presencialmente — escolha o que for mais fácil
              para si.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={wa("Olá! Gostaria de um orçamento.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white transition-colors"
              >
                <MessageCircle className="size-4" />
                WhatsApp: <Ed id="contacts.phoneWhatsApp" label="WhatsApp" className="text-sm font-bold text-white">{contacts.phoneWhatsApp}</Ed>
              </a>
              <a
                href={`tel:${(contacts.phoneCall ?? "").replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10"
              >
                <Phone className="size-4" />
                Ligar: {contacts.phoneCall}
              </a>
              <a
                href="#mapa"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10"
              >
                <MapPin className="size-4" />
                Como chegar
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CARTÕES DE CONTACTO */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {contactCards.map((card, index) => {
            const Wrapper = card.href.startsWith("http") || card.href.startsWith("mailto") || card.href.startsWith("tel") ? "a" : Link;
            const wrapperProps =
              Wrapper === "a"
                ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
                : { href: card.href };
            return (
              <Reveal key={card.title} delay={index * 0.08}>
                <Tilt max={4} scale={1.01} className="h-full">
                  <Wrapper
                    {...wrapperProps}
                    className="group flex h-full flex-col justify-between gap-6 rounded-lg border border-foreground/10 bg-white p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid size-12 place-items-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                        <card.icon className="size-6" />
                      </div>
                      <span className="grid size-9 place-items-center rounded-full border border-foreground/10 text-foreground/50 transition-all duration-300 group-hover:border-brand-blue group-hover:text-brand-blue">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground/60 uppercase">
                        {card.title}
                      </h2>
                      <Ed id={card.id} label={card.label} className="mt-1 break-all text-xl font-extrabold tracking-tight text-shine">
                        <p className="mt-1 break-all text-xl font-extrabold tracking-tight text-shine">
                          {card.highlight}
                        </p>
                      </Ed>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {card.text}
                      </p>
                    </div>
                  </Wrapper>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* MAPA EMBUTIDO — sem sair do site */}
      <section id="mapa" className="mx-auto w-full max-w-7xl scroll-mt-28 px-6 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          {/* Informação do local */}
          <div className="lg:col-span-4">
            <Reveal>
              <div className="bg-brand-depth flex h-full flex-col rounded-lg p-8">
                <div className="relative">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-white">
                    <MapPin className="size-6" />
                  </span>
                  <h2 className="text-shine-light mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
                    Onde estamos
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/85">
                    Via Expressa — Benfica, municipio de Talatona, comuna de
                    Benfica.
                  </p>
                  <address className="mt-4 space-y-2 text-sm leading-relaxed not-italic text-white/75">
                    {ADDRESS.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    <Ed id="contacts.address" label="Morada" className="text-white/85">
                      <p className="flex items-start gap-2 text-white/85">
                        <FileText className="mt-0.5 size-4 shrink-0 text-brand-blue" />
                        {ADDRESS.landmark}
                      </p>
                    </Ed>
                  </address>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={MAP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-navy transition-colors"
                    >
                      <MapPin className="size-4" />
                      Abrir no Google Maps
                    </a>
                    <a
                      href={wa(`Olá! Gostaria de saber como chegar até à vossa sede (${MAP_QUERY}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors"
                    >
                      <MessageCircle className="size-4" />
                      Peça indicações
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Mapa embutido */}
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <div className="relative h-full min-h-[420px] overflow-hidden rounded-lg bg-foreground ring-1 ring-foreground/10">
                <iframe
                  title="Mapa: localização da Algugest — Bairro Benfica, Rua 10 de Dezembro, Luanda"
                  src={MAP_EMBED}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HORÁRIO + NOTA */}
      <section className="border-y border-foreground/10 bg-foreground/5 py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <Reveal>
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                  <Clock className="size-6" />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">
                    Resposta rápida, todos os dias úteis
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    A Algugest é uma empresa digital apoiada em IA: envie a sua
                    mensagem e receba uma resposta de orçamento de forma muito
                    rápida, dentro do horário de atendimento.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Ed id="brand.slogan" label="Slogan" className="rounded-full border border-brand-blue/30 bg-brand-blue/5 px-6 py-3 text-sm font-bold text-brand-navy">
                <p className="rounded-full border border-brand-blue/30 bg-brand-blue/5 px-6 py-3 text-sm font-bold text-brand-navy">
                  {brand.slogan}
                </p>
              </Ed>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand-depth py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 text-center sm:px-8 lg:px-12">
          <Reveal>
            <h2 className="text-shine-light mx-auto max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl">
              Um projeto, uma mensagem,
              <br className="hidden sm:inline" /> uma resposta rápida.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              <Ed id="contacts.legalName" label="Razão social" block={false}>{contacts.legalName}</Ed> — NIF <Ed id="contacts.nif" label="NIF" block={false}>{contacts.nif}</Ed>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={wa("Olá! Gostaria de um orçamento para o meu projeto.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white transition-colors"
              >
                <MessageCircle className="size-4" />
                WhatsApp: <Ed id="contacts.phoneWhatsApp" label="WhatsApp" className="text-sm font-bold text-white">{contacts.phoneWhatsApp}</Ed>
              </a>
              <a
                href={`tel:${(contacts.phoneCall ?? "").replace(/\s/g, "")}`}
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
                {contacts.email}
              </a>
            </div>
            <p className="mt-8 text-sm text-white/60">{contacts.address}</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}