"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, CloudUpload, Images as ImagesIcon, Megaphone, Plus, Trash2 } from "lucide-react";

import { ImagePicker } from "@/components/admin/ImagePicker";
import { makeDestaque, type EditableService, type SiteState } from "@/components/admin/editor-types";
import type { Destaque } from "@/lib/site";

/**
 * Secção dedicada do painel para publicar destaques.
 * Independente do editor de conteúdo: cria, edita, remove e publica.
 */
export function DestaquesManager() {
  const [services, setServices] = useState<EditableService[]>([]);
  const [site, setSite] = useState<SiteState | null>(null);
  const [published, setPublished] = useState<Destaque[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pick, setPick] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/content");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { services: EditableService[]; site: SiteState };
        setServices(data.services);
        setSite(data.site);
        setPublished(data.site.destaques);
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const destaques = site?.destaques ?? [];
  const dirty = site ? JSON.stringify(destaques) !== JSON.stringify(published) : false;

  const add = () =>
    setSite((s) => (s ? { ...s, destaques: [...s.destaques, makeDestaque()] } : s));

  const remove = (index: number) =>
    setSite((s) => (s ? { ...s, destaques: s.destaques.filter((_, i) => i !== index) } : s));

  const update = (index: number, patch: Partial<Destaque>) =>
    setSite((s) =>
      s ? { ...s, destaques: s.destaques.map((d, i) => (i === index ? { ...d, ...patch } : d)) } : s
    );

  const publish = async () => {
    if (!site) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services, site }),
      });
      if (res.ok) {
        setPublished(site.destaques);
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !site) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-16 text-center text-sm text-muted-foreground">
        A carregar destaques...
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Barra de controlo */}
      <div className="sticky top-2 z-40 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Megaphone className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-brand-navy">Destaques</h2>
              <p className="text-xs text-muted-foreground">
                O mais recente aparece na página inicial. Publique para ficar online.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {dirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-2 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-300">
                Alterações por publicar
              </span>
            )}
            <button
              type="button"
              onClick={add}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              <Plus className="size-4" /> Adicionar
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-[#3fa3ff] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-brand-blue/30 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CloudUpload className="size-4" /> {saving ? "A publicar..." : "Publicar"}
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700 ring-1 ring-green-200">
          <Check className="size-4" /> Destaques publicados! O site já está atualizado.
        </div>
      )}

      {destaques.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Megaphone className="mx-auto size-8 text-brand-blue" />
          <p className="mt-4 text-base font-bold text-brand-navy">Ainda não há destaques.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em <b>Adicionar</b> para criar o primeiro.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {destaques.map((destaque, index) => (
            <div
              key={destaque.id}
              className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[16rem_1fr]"
            >
              {/* Imagem */}
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100">
                  {destaque.image ? (
                    <Image
                      src={destaque.image}
                      alt={destaque.title}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setPick(index)}
                  className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  <ImagesIcon className="size-3.5" /> Trocar imagem
                </button>
              </div>

              {/* Campos */}
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
                  <Field label="Título">
                    <input
                      value={destaque.title}
                      onChange={(e) => update(index, { title: e.target.value })}
                      placeholder="Título do destaque"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Data">
                    <input
                      type="date"
                      value={destaque.date}
                      onChange={(e) => update(index, { date: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Texto">
                  <textarea
                    value={destaque.text}
                    onChange={(e) => update(index, { text: e.target.value })}
                    rows={3}
                    placeholder="Descrição do destaque"
                    className={inputCls}
                  />
                </Field>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" /> Remover destaque
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImagePicker
        open={pick !== null}
        onClose={() => setPick(null)}
        onPick={(path) => {
          if (pick !== null) update(pick, { image: path });
          setPick(null);
        }}
      />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand-blue";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  );
}
