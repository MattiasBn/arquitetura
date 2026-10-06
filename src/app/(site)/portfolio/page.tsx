"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Phone,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react";

import { CONTACTS, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Tilt } from "@/components/ui/tilt";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type Category = "Telecomunicações" | "Obras Públicas" | "Construção & Edifícios";

type Project = {
  id: number;
  image: string;
  category: Category;
};

// 18 fotos de obra, agrupadas por serviço. As imagens vivem na Cloudinary.
const PROJECTS: Project[] = [
  { id: 1, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285158/algugest/imagens/telecomunicacoes/obra-08.jpg", category: "Telecomunicações" },
  { id: 2, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285142/algugest/imagens/obras/obra-02.jpg", category: "Construção & Edifícios" },
  { id: 3, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284908/algugest/imagens/construcao-civil/obra-20.jpg", category: "Obras Públicas" },
  { id: 4, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285152/algugest/imagens/obras/obra-18.jpg", category: "Telecomunicações" },
  { id: 5, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285149/algugest/imagens/obras/obra-07.jpg", category: "Construção & Edifícios" },
  { id: 6, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285140/algugest/imagens/obras/obra-01.jpg", category: "Obras Públicas" },
  { id: 7, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285163/algugest/imagens/telecomunicacoes/obra-11.jpg", category: "Telecomunicações" },
  { id: 8, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284929/algugest/imagens/edificios/obra-12.jpg", category: "Construção & Edifícios" },
  { id: 9, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285153/algugest/imagens/obras/obra-19.jpg", category: "Obras Públicas" },
  { id: 10, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285147/algugest/imagens/obras/obra-05.jpg", category: "Telecomunicações" },
  { id: 11, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284930/algugest/imagens/edificios/obra-15.jpg", category: "Construção & Edifícios" },
  { id: 12, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285148/algugest/imagens/obras/obra-06.jpg", category: "Obras Públicas" },
  { id: 13, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285160/algugest/imagens/telecomunicacoes/obra-09.jpg", category: "Telecomunicações" },
  { id: 14, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284931/algugest/imagens/edificios/obra-16.jpg", category: "Construção & Edifícios" },
  { id: 15, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285145/algugest/imagens/obras/obra-04.jpg", category: "Obras Públicas" },
  { id: 16, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791284933/algugest/imagens/edificios/obra-17.jpg", category: "Construção & Edifícios" },
  { id: 17, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285151/algugest/imagens/obras/obra-10.jpg", category: "Construção & Edifícios" },
  { id: 18, image: "https://res.cloudinary.com/z50slpsg/image/upload/v1791285143/algugest/imagens/obras/obra-03.jpg", category: "Construção & Edifícios" },
];

const VIDEOS = [
  { src: "https://res.cloudinary.com/z50slpsg/video/upload/v1791285442/algugest/videos/obra-01.mp4", eager: true, label: "Destaque em vídeo" },
  { src: "https://res.cloudinary.com/z50slpsg/video/upload/v1791285445/algugest/videos/obra-02.mp4", eager: false, label: undefined },
  { src: "https://res.cloudinary.com/z50slpsg/video/upload/v1791285447/algugest/videos/obra-03.mp4", eager: false, label: undefined },
  { src: "https://res.cloudinary.com/z50slpsg/video/upload/v1791285450/algugest/videos/obra-04.mp4", eager: false, label: undefined },
] as const;

const CATEGORIES: Array<"Todos" | Category> = [
  "Todos",
  "Telecomunicações",
  "Obras Públicas",
  "Construção & Edifícios",
];

const subscribeMobile = (callback: () => void) => {
  const mq = window.matchMedia("(max-width: 640px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};
const getMobileSnapshot = () => window.matchMedia("(max-width: 640px)").matches;
const getMobileServerSnapshot = () => false;

function WorkVideo({
  src,
  eager,
  label,
}: {
  src: string;
  eager?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getMobileServerSnapshot);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  const toggleMute = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const handleStart = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    void video.play();
    setStarted(true);
  };

  const needsTap = !eager && isMobile && !started;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-lg bg-brand-deep ring-1 ring-white/10">
      <video
        ref={ref}
        src={src}
        autoPlay={eager}
        muted
        loop
        playsInline
        preload={eager ? "auto" : isMobile ? "none" : "metadata"}
        onPlay={() => setStarted(true)}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Grau profissional por cima do vídeo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/60 via-transparent to-black/10" />

      {label && (
        <span className="absolute bottom-4 left-4 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white uppercase tracking-[0.2em] backdrop-blur-sm">
          {label}
        </span>
      )}

      {/* Botão de som */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Ativar som" : "Silenciar"}
        className="absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
      >
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </button>

      {/* No telemóvel, os vídeos pesados só carregam quando se toca */}
      {needsTap && (
        <button
          type="button"
          onClick={handleStart}
          aria-label="Reproduzir vídeo"
          className="absolute inset-0 grid cursor-pointer place-items-center"
        >
          <span className="grid size-16 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-transform duration-300 hover:scale-110">
            <Play className="size-7 translate-x-0.5" />
          </span>
        </button>
      )}
    </div>
  );
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState<"Todos" | Category>("Todos");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "Todos" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  const shown = filtered;
  const open = activeIndex !== null;

  const next = () => setActiveIndex((i) => (i === null ? null : (i + 1) % shown.length));
  const prev = () => setActiveIndex((i) => (i === null ? null : (i - 1 + shown.length) % shown.length));

  const activeProject = activeIndex === null ? null : shown[activeIndex];

  return (
    <main className="bg-transparent">
      {/* HERO */}
      <section className="bg-brand-depth pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <span className="text-sm font-semibold text-brand-blue uppercase">
              Portfólio
            </span>
            <h1 className="text-shine-light mt-3 max-w-4xl text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Obras que falam <br className="hidden sm:inline" />
              por nós.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Cada projeto é um compromisso assumido e cumprido. Explore o nosso
              trabalho em telecomunicações, obras públicas e construção de
              edifícios — em fotografia e em movimento.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
              <div>
                <p className="text-shine-light text-4xl font-extrabold tabular-nums sm:text-5xl">18+</p>
                <p className="mt-1 text-xs font-semibold text-white/65 uppercase">Obras no portfólio</p>
              </div>
              <div>
                <p className="text-shine-light text-4xl font-extrabold tabular-nums sm:text-5xl">9</p>
                <p className="mt-1 text-xs font-semibold text-white/65 uppercase">Áreas de serviço</p>
              </div>
              <div>
                <p className="text-shine-light text-4xl font-extrabold tabular-nums sm:text-5xl">3</p>
                <p className="mt-1 text-xs font-semibold text-white/65 uppercase">Especialidades</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FILTROS */}
      <section className="mx-auto w-full max-w-7xl px-6 pt-12 sm:px-8 lg:px-12">
        <div id="grelha" className="scroll-mt-28">
          <div className="flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "Todos"
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.category === cat).length;
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-foreground/15 bg-white text-foreground/75 hover:border-brand-blue/50 hover:text-brand-navy"
                  )}
                >
                  {cat}
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      active ? "text-white/80" : "text-brand-blue"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* GRELHA DE OBRAS — masonry com tilt */}
      <section className="mx-auto w-full max-w-7xl px-6 pt-8 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="columns-2 gap-3 md:columns-3 xl:columns-4">
          {shown.map((project, index) => (
            <Reveal key={project.id} delay={(index % 4) * 0.05} className="mb-3 break-inside-avoid">
              <Tilt max={7} scale={1.02} className="relative rounded-lg">
                <motion.button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ampliar obra de ${project.category}`}
                  className="group relative block w-full cursor-pointer overflow-hidden rounded-lg bg-surface"
                >
                  <Image
                    src={project.image}
                    alt={`Obra de ${project.category}`}
                    width={800}
                    height={600}
                    quality={90}
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-[11px] font-semibold text-white uppercase">
                      {project.category}
                    </p>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </motion.button>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VÍDEOS — a obra em movimento */}
      <section className="bg-brand-depth py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <span className="text-sm font-semibold text-brand-blue uppercase">
                  Em movimento
                </span>
                <h2 className="text-shine-light mt-3 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
                  A obra não para.
                  <br />Veja-a acontecer.
                </h2>
              </div>
              <p className="max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
                Vídeos reais dos nossos estaleiros e montagens — sem encenação. O
                ritmo, o rigor e a equipa, em primeira mão.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {VIDEOS.map((video, index) => (
              <Reveal
                key={video.src}
                delay={index * 0.08}
                className={cn(video.eager && "sm:col-span-2")}
              >
                <WorkVideo src={video.src} eager={video.eager} label={video.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Reveal>
          <div className="bg-brand-depth rounded-lg px-7 py-12 sm:px-10 lg:px-14">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <h2 className="text-shine-light text-3xl leading-[1.1] font-extrabold tracking-tight sm:text-4xl">
                  Quer um resultado assim no seu projeto?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/80 sm:text-lg">
                  Fale connosco, receba um orçamento rápido e tenha a mesma
                  qualidade e responsabilidade em cada metro da sua obra.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={whatsappLink("Olá! Vi os projetos da Algugest e gostaria de um orçamento.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-sm font-bold text-white transition-colors"
                >
                  <MessageCircle className="size-4" />
                  WhatsApp: {CONTACTS.phoneWhatsApp}
                </a>
                <a
                  href={`tel:${CONTACTS.phoneCall.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white transition-colors hover:border-white/70 hover:bg-white/10"
                >
                  <Phone className="size-4" />
                  Ligar: {CONTACTS.phoneCall}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* LIGHTBOX */}
      <Dialog open={open} onOpenChange={(o) => { if (!o) setActiveIndex(null); }}>
        <DialogContent
          showCloseButton={false}
          className="inset-0 top-0 left-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-none [&_[data-slot=dialog-overlay]]:bg-black/95"
        >
          <DialogTitle className="sr-only">
            {activeProject ? `Obra de ${activeProject.category}` : "Obra"}
          </DialogTitle>

          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-20 grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:top-6 sm:right-6"
          >
            <X className="size-6" />
          </button>

          {activeProject && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={activeProject.image}
                    alt={`Obra de ${activeProject.category}`}
                    fill
                    quality={85}
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex items-center justify-center sm:bottom-7">
                <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/85 backdrop-blur-sm">
                  {activeProject.category}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={prev}
            aria-label="Obra anterior"
            className="absolute top-1/2 left-2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:left-5 sm:size-12"
          >
            <ChevronLeft className="size-7" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próxima obra"
            className="absolute top-1/2 right-2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:right-5 sm:size-12"
          >
            <ChevronRight className="size-7" />
          </button>
        </DialogContent>
      </Dialog>
    </main>
  );
}