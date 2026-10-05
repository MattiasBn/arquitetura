"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Film, Images, Plus, Trash2, Upload, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MAX_VIDEO_BYTES, MAX_VIDEO_MB, VIDEO_ACCEPT } from "@/lib/media";
import { cn } from "@/lib/utils";

type MediaEntry = {
  path: string;
  folder: string;
  name: string;
  type: "image" | "video";
};

export type MediaFocus = "videos" | "home";

export function MediaManagerModal({
  open,
  focus,
  onClose,
  videos,
  onAddVideo,
  onRemoveVideo,
  home,
  onEditImage,
  onAddProjeto,
  onRemoveProjeto,
  onProjetoName,
}: {
  open: boolean;
  focus: MediaFocus;
  onClose: () => void;
  videos: string[];
  onAddVideo: (path: string) => void;
  onRemoveVideo: (index: number) => void;
  home: { edificio: string; equipa: string; projetos: { alt: string; image: string }[] };
  onEditImage: (target: "edificio" | "equipa" | number) => void;
  onAddProjeto: () => void;
  onRemoveProjeto: (index: number) => void;
  onProjetoName: (index: number, alt: string) => void;
}) {
  const [tabOverride, setTabOverride] = useState<MediaFocus | null>(null);
  const [existingVideos, setExistingVideos] = useState<MediaEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Aba visível: a pedida pelo pai (focus) até o utilizador escolher outra.
  const tab = tabOverride ?? focus;

  const loadVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/images?tipo=videos");
      if (!res.ok) return;
      const data = (await res.json()) as { media: MediaEntry[] };
      setExistingVideos(data.media);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (!open || tab !== "videos") return;
    const timer = setTimeout(() => void loadVideos(), 0);
    return () => clearTimeout(timer);
  }, [open, tab, loadVideos]);

  const uploadVideo = async (file: File) => {
    setError("");
    if (file.size > MAX_VIDEO_BYTES) {
      setError(`Vídeo demasiado grande (máx. ${MAX_VIDEO_MB} MB). Comprima antes de enviar.`);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/images", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar o vídeo.");
        return;
      }
      if (data.path) onAddVideo(data.path);
      await loadVideos();
    } catch {
      setError("Erro ao enviar o vídeo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setTabOverride(null); } }}>
      <DialogContent
        showCloseButton={false}
        className="inset-x-4 top-6 left-1/2 max-h-[88vh] max-w-3xl translate-x-[-50%] translate-y-0 gap-0 overflow-hidden rounded-3xl p-0 sm:top-10 sm:max-w-3xl sm:translate-x-[-50%] sm:translate-y-0"
      >
        <DialogTitle className="sr-only">Média da página inicial</DialogTitle>

        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <span className="text-base font-extrabold text-brand-navy">Média da página inicial</span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-1.5 border-b border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={() => setTabOverride("videos")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors",
              tab === "videos" ? "bg-brand-blue text-white" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Film className="size-3.5" /> Vídeos do carrossel
          </button>
          <button
            type="button"
            onClick={() => setTabOverride("home")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors",
              tab === "home" ? "bg-brand-blue text-white" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Images className="size-3.5" /> Fotos da Home
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-5">
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>
          )}

          {tab === "videos" && (
            <div className="space-y-4">
              {videos.length === 0 && (
                <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-muted-foreground">
                  Ainda não há vídeos. Envie um ficheiro ou use um já carregado.
                </p>
              )}
              <div className="space-y-3">
                {videos.map((src, index) => (
                  <div key={`${src}-${index}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                    <video src={src} controls preload="metadata" className="h-20 w-36 shrink-0 rounded-lg bg-black" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground" title={src}>{src}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">Reproduz no computador e no telemóvel.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveVideo(index)}
                      className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remover vídeo"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-dashed border-brand-blue/40 bg-brand-blue/5 p-4">
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5">
                    <Upload className="size-3.5" />
                    {uploading ? "A enviar..." : "Enviar vídeo"}
                    <input
                      ref={fileRef}
                      type="file"
                      accept={VIDEO_ACCEPT}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadVideo(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <span className="text-[11px] text-muted-foreground">MP4 ou WebM, até {MAX_VIDEO_MB} MB</span>
                </div>

                {existingVideos.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-[11px] font-bold text-slate-500 uppercase">Ou usar um já enviado</p>
                    <div className="flex flex-wrap gap-2">
                      {existingVideos.map((video) => (
                        <button
                          key={video.path}
                          type="button"
                          onClick={() => onAddVideo(video.path)}
                          className="group relative h-16 w-28 cursor-pointer overflow-hidden rounded-lg bg-black"
                          title={video.name}
                        >
                          <video src={video.path} preload="metadata" className="h-full w-full object-cover" />
                          <span className="absolute inset-0 grid place-items-center bg-black/40 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Adicionar
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "home" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-3">
                  <p className="mb-2 text-[11px] font-bold text-slate-500 uppercase">Imagem principal (largura total)</p>
                  <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image src={home.edificio} alt="Imagem principal" fill className="object-cover" sizes="200px" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditImage("edificio")}
                    className="mt-2 w-full cursor-pointer rounded-full bg-brand-blue px-3 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Trocar imagem
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 p-3">
                  <p className="mb-2 text-[11px] font-bold text-slate-500 uppercase">Imagem da equipa</p>
                  <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image src={home.equipa} alt="Imagem da equipa" fill className="object-cover" sizes="200px" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditImage("equipa")}
                    className="mt-2 w-full cursor-pointer rounded-full bg-brand-blue px-3 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Trocar imagem
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Galeria de obras</p>
                  <button
                    type="button"
                    onClick={onAddProjeto}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand-navy px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    <Plus className="size-3.5" /> Adicionar obra
                  </button>
                </div>
                <div className="space-y-3">
                  {home.projetos.map((projeto, index) => (
                    <div key={`${projeto.image}-${index}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image src={projeto.image} alt={projeto.alt} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <input
                          value={projeto.alt}
                          onChange={(e) => onProjetoName(index, e.target.value)}
                          placeholder="Nome/legenda da obra"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-foreground outline-none focus:border-brand-blue"
                        />
                        <button
                          type="button"
                          onClick={() => onEditImage(index)}
                          className="mt-2 cursor-pointer text-xs font-bold text-brand-blue transition-colors hover:text-brand-navy"
                        >
                          Trocar fotografia
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveProjeto(index)}
                        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Remover obra"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <span className="text-[11px] text-muted-foreground">
            As alterações ficam por publicar até clicar em <b>Publicar</b>.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand-blue px-4 py-2 text-xs font-bold text-white"
          >
            Concluído
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}