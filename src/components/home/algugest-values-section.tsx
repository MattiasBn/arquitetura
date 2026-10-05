"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SERVICES } from "@/data/services";
import { CONTACTS, VALUES } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { Tilt } from "@/components/ui/tilt";
import { Ed } from "@/components/admin/editing-context";

export function AlgugestValuesSection({
  services = SERVICES,
  values = VALUES as unknown as Array<{ title: string; text: string }>,
  phoneWhatsApp,
}: {
  services?: Array<{ slug: string; title: string; images: string[] }>;
  values?: Array<{ title: string; text: string }>;
  phoneWhatsApp?: string;
}) {
  const wa = (message: string) =>
    `https://wa.me/244${(phoneWhatsApp ?? CONTACTS.phoneWhatsApp).replace(/\s/g, "")}?text=${encodeURIComponent(message)}`;
  return (
    <section
      id="servicos"
      className="relative w-full pt-10 pb-20 lg:pt-14 lg:pb-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Cabecalho — sobre fundo branco */}
        <Reveal>
          <div className="mb-12 max-w-3xl lg:mb-16">
            <h2 className="text-shine text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Do conceito à realidade
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Esquerda: valores Algugest — estica até ter a mesma altura das imagens */}
          <Reveal className="lg:col-span-5">
            <div className="h-full">
              <Tilt max={4} scale={1.01} className="h-full rounded-lg">
                <div className="bg-brand-depth flex h-full flex-col rounded-lg border border-white/10 p-6 sm:p-8">
                  <span className="block text-xs font-semibold tracking-widest text-white/60 uppercase">
                    Os Nossos Valores
                  </span>
                  <ul className="mt-6 flex flex-1 flex-col justify-between gap-6">
                    {values.map((value, index) => (
                      <li key={value.title} className="flex gap-3">
                        <span className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-blue" />
                        <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                          <strong className="font-bold text-white">
                            <Ed id={`values.${index}.title`} label={`Valor ${index + 1}`} block={false} className="font-bold text-white">
                              {value.title}
                            </Ed>
                          </strong>
                          <span className="text-white/40"> — </span>
                          <Ed id={`values.${index}.text`} label={`Descrição do valor ${index + 1}`} block={false} className="text-white/75">
                            {value.text}
                          </Ed>
                        </p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={wa("Olá! Gostaria de falar com a equipa Algugest.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-10 inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-transform hover:-translate-y-0.5"
                  >
                    Falar com a nossa equipa
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Tilt>
            </div>
          </Reveal>

          {/* Direita: cartões de servicos — cada cartão abre a página do serviço */}
          {/* Mobile: carrossel com swipe */}
          <div className="-mx-6 sm:-mx-8 lg:col-span-7 lg:mx-0 lg:hidden">
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8">
              {services.map((service, index) => {
                const cover = service.images[0];

                return (
                  <Reveal key={service.slug} delay={index * 0.04}>
                    <Link
                      href={`/servicos/${service.slug}`}
                      aria-label={`Ver ${service.title}`}
                      className="group relative block aspect-[4/3] w-[72vw] max-w-[280px] shrink-0 snap-center overflow-hidden rounded-lg bg-surface active:scale-[0.98]"
                    >
                      {cover ? (
                        <Image
                          src={cover}
                          alt={service.title}
                          fill
                          quality={90}
                          loading={index === 0 ? "eager" : undefined}
                          sizes="(min-width: 640px) 40vw, 70vw"
                          className="object-contain"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-brand-blue text-white/90">
                          <span className="text-6xl font-extrabold">
                            {service.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4">
                        <span className="mb-1 text-[10px] font-semibold tracking-widest text-white/65 uppercase">
                          {String(index + 1).padStart(2, "0")} — Algugest
                        </span>
                        <span className="text-lg leading-tight font-extrabold text-white">
                          <Ed id={`services.${index}.title`} label="Título" block={false} className="text-lg font-extrabold text-white">{service.title}</Ed>
                        </span>
                      </div>
                      <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm">
                        <ArrowRight className="size-4" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Desktop: grelha 3x3 — cresce sem estragar com mais imagens */}
          <div className="hidden lg:col-span-7 lg:grid lg:grid-cols-3 lg:items-start lg:gap-3 lg:content-start">
            {services.map((service, index) => {
              const cover = service.images[0];

              return (
                <Reveal key={service.slug} delay={index * 0.05}>
                  <Tilt max={7} scale={1.03} className="relative rounded-lg">
                    <Link
                      href={`/servicos/${service.slug}`}
                      aria-label={`Ver ${service.title}`}
                      className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-surface"
                    >
                      {cover ? (
                        <Image
                          src={cover}
                          alt={service.title}
                          fill
                          quality={90}
                          loading={index === 0 ? "eager" : undefined}
                          sizes="(min-width: 1024px) 20vw, 100vw"
                          className="object-contain"
                        />
                      ) : (
                        // Sem foto atribuida: mostra a inicial para nao ficar um bloco vazio
                        <div className="absolute inset-0 grid place-items-center bg-brand-blue text-white/90">
                          <span className="text-5xl font-extrabold">
                            {service.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/25 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4">
                        <span className="mb-1 text-[10px] font-semibold tracking-widest text-white/65 uppercase">
                          {String(index + 1).padStart(2, "0")} — Algugest
                        </span>
                        <span className="text-base leading-tight font-extrabold text-white sm:text-lg">
                          <Ed id={`services.${index}.title`} label="Título" block={false} className="text-base font-extrabold text-white sm:text-lg">{service.title}</Ed>
                        </span>
                      </div>
                      <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-brand-navy">
                        <ArrowRight className="size-4" />
                      </span>
                    </Link>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Lista de servicos em texto — sobre fundo branco */}
        <ul className="mt-16 grid gap-x-10 border-t border-foreground/10 pt-8 sm:grid-cols-2 lg:mt-20">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.03}>
              <li>
                <Link
                  href={`/servicos/${service.slug}`}
                  className="group flex items-baseline gap-4 border-b border-foreground/10 py-4 transition-colors hover:border-foreground/40"
                >
                  <span className="text-xs font-semibold text-brand-blue tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-foreground/85 transition-colors group-hover:text-foreground sm:text-base">
                    <Ed id={`services.${index}.title`} label="Título" block={false} className="text-sm font-semibold text-foreground/85 sm:text-base">{service.title}</Ed>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}