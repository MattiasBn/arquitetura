"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Images as ImagesIcon, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tilt } from "@/components/ui/tilt";
import { Ed } from "@/components/admin/editing-context";
import { HighlightCarousel } from "@/components/home/highlight-carousel";
import { HOME_IMAGES, type Destaque } from "@/lib/site";

export function AboutImpactSection({
  mission,
  edificio = HOME_IMAGES.edificio,
  equipa = HOME_IMAGES.equipa,
  projetos = HOME_IMAGES.projetos,
  destaques = [],
  onEditImage,
  onManageObras,
  onManageDestaques,
}: {
  mission?: string;
  edificio?: string;
  equipa?: string;
  projetos?: Array<{ alt: string; image: string }>;
  destaques?: Destaque[];
  onEditImage?: (kind: "edificio" | "equipa") => void;
  onManageObras?: () => void;
  onManageDestaques?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const total = projetos.length;
  const activeProject = activeIndex === null ? null : projetos[activeIndex];

  // Setas do teclado para avançar/recuar dentro da galeria aberta.
  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((i) => (i === null ? null : (i + 1) % total));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((i) => (i === null ? null : (i - 1 + total) % total));
      }
    };

    // Capture: o Dialog do Base UI trava a propagação das teclas no
    // Popup, por isso um listener em bubble nunca as receberia.
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [activeIndex, total]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden pt-8 pb-20 lg:pt-12 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Título editorial, estático. */}
        <div className="mb-12 max-w-4xl lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Erguemos mais do que estruturas.
            <br />
            Construímos impacto.
          </motion.h2>
        </div>
      </div>

      {/* Imagem em largura total com parallax e alta qualidade.
          TROCA O src pela foto que quiseres usar. */}
      <div className="group relative my-6 h-[28rem] w-full overflow-hidden sm:h-[38rem] lg:h-[50rem]">
        <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[10%] h-[120%] w-full">
          <Image
            src={edificio}
            alt="Edifício imponente de arquitectura moderna"
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        </motion.div>
        {onEditImage && (
          <button
            type="button"
            onClick={() => onEditImage("edificio")}
            className="absolute top-4 right-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-blue/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5"
          >
            <ImagesIcon className="size-4" /> Imagem principal
          </button>
        )}
        {/* Fade branco no topo: faz o branco da fotografia fundir com o fundo do site */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/70 to-transparent sm:h-56 lg:h-72" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      {/* Destaques mais recentes — logo abaixo da imagem principal */}
      <HighlightCarousel destaques={destaques} onManage={onManageDestaques} />

      {/* Grelha de obras — sem título e sem legendas.
          Só 2 e 5 colunas: 10 divide por ambos, por isso nunca fica
          uma linha final com espaços vazios. */}
      <div className="mx-auto mt-[10px] w-full max-w-[1920px] px-3 sm:px-5">
        {onManageObras && (
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={onManageObras}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/25 transition-transform hover:-translate-y-0.5"
            >
              <ImagesIcon className="size-4" /> Gerir obras
            </button>
          </div>
        )}
        <div className="columns-2 gap-2 sm:gap-3 lg:columns-5">
          {projetos.map((project, index) => (
            <Tilt key={`${project.alt}-${index}`} max={6} scale={1.03} className="relative mb-2 break-inside-avoid sm:mb-3">
              <motion.button
                type="button"
                onClick={() => setActiveIndex(index)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                aria-label={`Ampliar ${project.alt}`}
                className="group relative block w-full cursor-pointer overflow-hidden rounded-lg bg-surface"
              >
                <Image
                  src={project.image}
                  alt={project.alt}
                  width={800}
                  height={600}
                  quality={90}
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="h-auto w-full object-contain"
                />
              </motion.button>
            </Tilt>
          ))}
        </div>
      </div>

      {/* Texto de encerramento — imagem à esquerda, descrição à direita */}
      <div className="mx-auto mt-14 w-full max-w-[1920px] px-3 sm:px-5 lg:mt-20">
        <div className="grid items-center gap-10 sm:grid-cols-12 lg:gap-14">
          <Tilt max={5} scale={1.01} className="relative rounded-lg sm:col-span-7">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface ring-1 ring-foreground/10">
              <Image
                src={equipa}
                alt="A nossa equipa"
                fill
                quality={90}
                loading="eager"
                sizes="(min-width: 640px) 58vw, 100vw"
                className="object-contain"
              />
              {onEditImage && (
                <button
                  type="button"
                  onClick={() => onEditImage("equipa")}
                  className="absolute top-4 right-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-blue/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                >
                  <ImagesIcon className="size-4" /> Imagem da equipa
                </button>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/50 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-xs font-bold tracking-widest text-brand-navy uppercase backdrop-blur-sm">
                  A nossa equipa
                </span>
              </div>
            </div>
          </Tilt>

          <div className="sm:col-span-5">
            
            <Ed
              id="brand.mission"
              label="Missão"
              className="text-pretty text-base leading-relaxed text-muted sm:text-lg sm:leading-loose"
            >
              <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg sm:leading-loose">
                {mission ?? "Cientes da responsabilidade que nossa empresa carrega, estamos comprometidos em oferecer serviços da mais alta qualidade do mercado, impulsionados pela experiência e dinamismo de nossos técnicos."}
              </p>
            </Ed>
          </div>
        </div>
      </div>

      {/* Galeria em ecrã inteiro */}
      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="inset-0 top-0 left-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-none [&_[data-slot=dialog-overlay]]:bg-black/95"
        >
          <DialogTitle className="sr-only">{activeProject?.alt ?? "Obra"}</DialogTitle>

          {/* X para fechar, no canto superior direito */}
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-20 grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:top-6 sm:right-6"
          >
            <X className="size-6" />
          </button>

          {activeProject && (
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeProject.image}-${activeIndex}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={activeProject.image}
                    alt={activeProject.alt}
                    fill
                    quality={85}
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Avançar / recuar */}
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i === null ? null : (i - 1 + total) % total))}
            aria-label="Imagem anterior"
            className="absolute top-1/2 left-2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:left-5 sm:size-12"
          >
            <ChevronLeft className="size-7" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => (i === null ? null : (i + 1) % total))}
            aria-label="Próxima imagem"
            className="absolute top-1/2 right-2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:right-5 sm:size-12"
          >
            <ChevronRight className="size-7" />
          </button>

          {/* Posição actual */}
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 text-center text-sm tabular-nums text-white/70 sm:bottom-7">
            {(activeIndex ?? 0) + 1} / {total}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
