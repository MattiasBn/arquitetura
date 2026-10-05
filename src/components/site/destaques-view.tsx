"use client";

import Image from "next/image";
import {
  CalendarDays,
  Images as ImagesIcon,
  Megaphone,
  Plus,
  Trash2,
} from "lucide-react";

import { Ed } from "@/components/admin/editing-context";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { formatDestaqueDate, type Destaque } from "@/lib/site";

export function DestaquesView({
  destaques,
  onAdd,
  onPickImage,
  onRemove,
  onUpdate,
}: {
  destaques: Destaque[];
  onAdd?: () => void;
  onPickImage?: (index: number) => void;
  onRemove?: (index: number) => void;
  onUpdate?: (index: number, patch: Partial<Destaque>) => void;
}) {
  const admin = Boolean(onAdd);

  // Mais recentes primeiro, mantendo o índice original para a edição.
  const ordered = destaques
    .map((destaque, index) => ({ destaque, index }))
    .sort((a, b) => b.destaque.date.localeCompare(a.destaque.date));

  return (
    <main className="bg-transparent">
      {/* HERO */}
      <section className="bg-brand-depth pt-36 pb-16 lg:pt-44 lg:pb-20">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <span className="text-sm font-semibold text-brand-blue uppercase">
              Destaques
            </span>
            <h1 className="text-shine-light mt-3 max-w-4xl text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              O que está <br className="hidden sm:inline" />
              a acontecer.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Novidades, obras concluídas e marcos da Algugest. O destaque mais
              recente aparece em primeiro lugar — e também na página inicial.
            </p>
          </Reveal>
        </div>
      </section>

      {/* LISTA */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
        {admin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-brand-blue/40 bg-brand-blue/5 px-5 py-4">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy">
              <Megaphone className="size-4 text-brand-blue" />
              {destaques.length} destaque{destaques.length === 1 ? "" : "s"} publicado{destaques.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/25 transition-transform hover:-translate-y-0.5"
            >
              <Plus className="size-4" /> Adicionar destaque
            </button>
          </div>
        )}

        {ordered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
            <Megaphone className="mx-auto size-8 text-brand-blue" />
            <p className="mt-4 text-base font-bold text-brand-navy">
              Ainda não há destaques publicados.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {admin
                ? "Clique em “Adicionar destaque” para publicar a primeira novidade."
                : "Volte em breve para conhecer as nossas novidades."}
            </p>
          </div>
        ) : (
          <div className="space-y-8 lg:space-y-10">
            {ordered.map(({ destaque, index }, order) => {
              const reverse = order % 2 === 1;
              return (
                <Reveal key={destaque.id} delay={0.05}>
                  <article className="grid overflow-hidden rounded-lg border border-foreground/10 bg-white lg:grid-cols-2">
                    {/* Imagem */}
                    <div
                      className={cn(
                        "group relative aspect-[16/10] w-full overflow-hidden bg-foreground/5 lg:aspect-auto lg:min-h-[24rem]",
                        reverse && "lg:order-2"
                      )}
                    >
                      <Image
                        src={destaque.image}
                        alt={destaque.title}
                        fill
                        quality={90}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-contain"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-brand-navy backdrop-blur-sm">
                        <CalendarDays className="size-3.5 text-brand-blue" />
                        {formatDestaqueDate(destaque.date)}
                      </span>

                      {admin && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onPickImage?.(index)}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand-blue/90 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                          >
                            <ImagesIcon className="size-3.5" /> Trocar imagem
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove?.(index)}
                            aria-label="Remover destaque"
                            className="grid size-9 cursor-pointer place-items-center rounded-full bg-white/90 text-slate-500 shadow-lg backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className={cn("flex flex-col justify-center p-6 sm:p-10", reverse && "lg:order-1")}>
                      <Ed
                        id={`destaques.${index}.title`}
                        label="Título"
                        className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl"
                      >
                        <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
                          {destaque.title}
                        </h2>
                      </Ed>

                      <Ed
                        id={`destaques.${index}.text`}
                        label="Texto"
                        className="mt-4"
                      >
                        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                          {destaque.text}
                        </p>
                      </Ed>

                      {admin && (
                        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                            Data
                            <input
                              type="date"
                              value={destaque.date}
                              onChange={(e) => onUpdate?.(index, { date: e.target.value })}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-brand-blue"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
