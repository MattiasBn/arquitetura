"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";

import { HERO_VIDEOS } from "@/lib/site";
import { Ed } from "@/components/admin/editing-context";

export default function HeroVideoSection({
  eyebrowLabel = "Algugest",
  subtitle = "Especialistas em construção civil, obras públicas e telecomunicações em Angola.",
  tagline = "A sua melhor escolha em engenharia e infraestruturas.",
  videos = HERO_VIDEOS,
  onEditVideos,
}: {
  eyebrowLabel?: string;
  subtitle?: string;
  tagline?: string;
  videos?: string[];
  onEditVideos?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Se o admin esvaziar o carrossel, entra a lista padrão (nunca fica vazio).
  const mergedVideos = useMemo(() => (videos.length > 0 ? videos : HERO_VIDEOS), [videos]);

  // Playlist consoante o dispositivo: menos tráfego no telemóvel.
  const [playlistVideos, setPlaylistVideos] = useState(mergedVideos);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const apply = () => {
      const next = mq.matches ? mergedVideos.slice(0, 3) : mergedVideos;
      setPlaylistVideos(next);
      setCurrentVideoIndex((i) => Math.min(i, next.length - 1));
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mergedVideos]);

  // Carrega e reproduz o vídeo quando o índice muda.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    const tryPlay = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => video.removeEventListener("canplay", tryPlay);
  }, [currentVideoIndex, playlistVideos]);

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % playlistVideos.length);
  };

  return (
    <section className="relative flex min-h-[88vh] w-full items-end overflow-hidden bg-brand-deep">
      {/* Vídeo de fundo */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        src={playlistVideos[currentVideoIndex % playlistVideos.length]}
        onEnded={handleVideoEnded}
        onError={(e) => console.error("Erro ao carregar o vídeo do carrossel:", e)}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Véu escuro para legibilidade do texto (sem brilhos nem blobs). */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/95 via-brand-deep/55 to-brand-deep/25" />

      {/* Conteúdo editorial, alinhado à esquerda e na base da imagem. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 sm:px-8 lg:px-12 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <Ed id="contacts.brandName" label="Nome de marca">
            <span className="text-xs font-semibold tracking-[0.25em] text-white/70 uppercase">
              {eyebrowLabel} · Luanda, Angola
            </span>
          </Ed>

          <h1 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Construímos infraestruturas que fazem Angola avançar.
          </h1>

          <Ed id="brand.specialty" label="Especialidade">
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {subtitle}
            </p>
          </Ed>

          <Ed id="brand.slogan" label="Slogan">
            <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
              {tagline}
            </p>
          </Ed>
        </motion.div>
      </div>

      {onEditVideos && (
        <button
          type="button"
          onClick={onEditVideos}
          className="absolute top-4 right-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <Clapperboard className="size-4" /> Vídeos do carrossel
        </button>
      )}
    </section>
  );
}
