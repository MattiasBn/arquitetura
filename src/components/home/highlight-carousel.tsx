"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDestaqueDate, type Destaque } from "@/lib/site";

/**
 * Carrossel dos destaques mais recentes, mostrado na página inicial
 * entre a imagem principal e a galeria de obras.
 */
export function HighlightCarousel({
  destaques,
  onManage,
}: {
  destaques: Destaque[];
  onManage?: () => void;
}) {
  const latest = [...destaques]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  const count = latest.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 7000);
    return () => clearInterval(id);
  }, [count]);

  if (count === 0) return null;

  const active = Math.min(index, count - 1);
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue uppercase">
            <Megaphone className="size-4" /> Em destaque
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-brand-navy sm:text-4xl">
            As nossas últimas novidades
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onManage && (
            <button
              type="button"
              onClick={onManage}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-navy/90"
            >
              <Megaphone className="size-4" /> Gerir destaques
            </button>
          )}
          <Link
            href="/destaques"
            className="inline-flex items-center gap-2 rounded-full border border-brand-blue/30 px-5 py-2.5 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
          >
            Ver todos <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-foreground/10 bg-white">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            width: `${count * 100}%`,
            transform: `translateX(-${active * (100 / count)}%)`,
          }}
        >
          {latest.map((destaque) => (
            <div key={destaque.id} style={{ width: `${100 / count}%` }} className="shrink-0">
              <div className="grid lg:grid-cols-2">
                <div className="group relative aspect-[16/10] w-full overflow-hidden bg-foreground/5 lg:aspect-auto lg:min-h-[22rem]">
                  <Image
                    src={destaque.image}
                    alt={destaque.title}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain"
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-brand-navy backdrop-blur-sm">
                    <CalendarDays className="size-3.5 text-brand-blue" />
                    {formatDestaqueDate(destaque.date)}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <h3 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
                    {destaque.title}
                  </h3>
                  <p className="mt-4 line-clamp-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {destaque.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Destaque anterior"
              className="absolute top-1/2 left-3 z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-brand-navy shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-1/2 hover:scale-105"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próximo destaque"
              className="absolute top-1/2 right-3 z-10 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-brand-navy shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-1/2 hover:scale-105"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
              {latest.map((destaque, i) => (
                <button
                  key={destaque.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ir para o destaque ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-brand-blue" : "w-2 bg-brand-blue/30 hover:bg-brand-blue/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
