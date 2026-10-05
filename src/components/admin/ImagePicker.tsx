"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ImagePlus, Search, Upload, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IMAGE_ACCEPT, MAX_IMAGE_BYTES, MAX_IMAGE_MB } from "@/lib/media";
import { cn } from "@/lib/utils";

type ImageEntry = {
  path: string;
  folder: string;
  name: string;
};

export function ImagePicker({
  open,
  onClose,
  onPick,
  selectable = true,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (path: string) => void;
  selectable?: boolean;
}) {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string>("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/images");
      if (!res.ok) return;
      const data = (await res.json()) as { media: ImageEntry[] };
      setImages(data.media);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [open, load]);

  const folders = useMemo(() => {
    const map = new Map<string, number>();
    for (const img of images) map.set(img.folder || "imagens", (map.get(img.folder || "imagens") ?? 0) + 1);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [images]);

  const normalize = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filtered = useMemo(() => {
    const q = normalize(query);
    return images.filter((img) => {
      if (folder && img.folder !== folder) return false;
      if (!q) return true;
      return normalize(`${img.name} ${img.folder}`).includes(q);
    });
  }, [images, query, folder]);

  const upload = async (file: File) => {
    setError("");
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Imagem demasiado grande (máx. ${MAX_IMAGE_MB} MB). Comprima antes de enviar.`);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/images", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar a imagem.");
        return;
      }
      setQuery("");
      setFolder("");
      await load();
      if (data.path) onPick(data.path);
    } catch {
      setError("Erro ao enviar a imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="inset-x-4 top-6 left-1/2 max-h-[88vh] max-w-3xl translate-x-[-50%] translate-y-0 gap-0 overflow-hidden rounded-3xl p-0 sm:top-10 sm:max-w-3xl sm:translate-x-[-50%] sm:translate-y-0"
      >
        <DialogTitle className="sr-only">Escolher imagem</DialogTitle>

        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <ImagePlus className="size-5 text-brand-blue" />
            <span className="text-base font-extrabold text-brand-navy">
            {selectable ? "Trocar imagem" : "Galeria de imagens"}
          </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5">
              <Upload className="size-3.5" />
              {uploading ? "A enviar..." : "Enviar imagem"}
              <input
                ref={fileRef}
                type="file"
                accept={IMAGE_ACCEPT}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 cursor-pointer place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="Fechar"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-3 border-b border-slate-200 px-5 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Procurar imagem pelo nome..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm text-foreground outline-none focus:border-brand-blue"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setFolder("")}
              className={cn(
                "shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors",
                !folder ? "border-brand-blue bg-brand-blue text-white" : "border-slate-200 text-slate-600 hover:border-brand-blue/50"
              )}
            >
              Tudo
            </button>
            {folders.map(([name, count]) => (
              <button
                key={name}
                type="button"
                onClick={() => setFolder(name)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors",
                  folder === name ? "border-brand-blue bg-brand-blue text-white" : "border-slate-200 text-slate-600 hover:border-brand-blue/50"
                )}
              >
                {name} · {count}
              </button>
            ))}
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">{error}</p>
          )}
        </div>

        {/* Grelha */}
        <div className="grid max-h-[56vh] grid-cols-3 gap-2 overflow-y-auto p-4 sm:grid-cols-4 lg:grid-cols-5">
          {filtered.map((img) => (
            <button
              key={img.path}
              type="button"
              onClick={() => {
                if (selectable) onPick(img.path);
              }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition-all hover:border-brand-blue hover:shadow-md"
              title={img.name}
            >
              <Image
                src={img.path}
                alt={img.name}
                fill
                sizes="100px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 pt-4 pb-1 text-[10px] font-semibold text-white">
                {img.name}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              Sem imagens com esse filtro.
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={() => setFolder("")}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-brand-navy"
          >
            <ChevronLeft className="size-4" />
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          </button>
          <span className="text-[11px] text-muted-foreground">
            {selectable ? "Clique numa imagem para usar" : "Pode enviar imagens ou usá-las depois nos campos"} · Máx. {MAX_IMAGE_MB} MB
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}