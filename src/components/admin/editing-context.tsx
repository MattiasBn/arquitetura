"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Check, Pencil, Undo2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Destaque } from "@/lib/site";

/**
 * Edição "no próprio sítio": cada campo editável do site real é envolvido
 * por <Ed id=...>. No site público (sem provider) o <Ed> não altera nada e
 * renderiza o conteúdo tal como está. No admin, mostra um botão "Editar"
 * bem visível junto a cada campo; ao clicar, o campo vira caixa de edição
 * com as ações Cancelar / Reverter / Atualizar.
 *
 * `block={false}` usa um <span> em vez de <div> para poder viver dentro de
 * <p> (regra de HTML) sem quebrar a hidratação.
 */

export type FieldInfo = {
  value: string;
  original: string;
  set: (value: string) => void;
};

type EditingContextValue = {
  fields: Record<string, FieldInfo>;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  dirty: number;
};

const EditingContext = createContext<EditingContextValue | null>(null);

export function EditingProvider({
  fields,
  children,
}: {
  fields: Record<string, FieldInfo>;
  children: React.ReactNode;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const dirty = useMemo(
    () => Object.values(fields).filter((f) => f.value !== f.original).length,
    [fields]
  );

  const value = useMemo(
    () => ({ fields, activeId, setActiveId, dirty }),
    [fields, activeId, dirty]
  );

  return <EditingContext.Provider value={value}>{children}</EditingContext.Provider>;
}

export function useEditing(): EditingContextValue | null {
  return useContext(EditingContext);
}

export function Ed({
  id,
  label,
  block = true,
  className,
  children,
}: {
  id: string;
  label: string;
  block?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = useEditing();
  const [base, setBase] = useState("");
  const [draft, setDraft] = useState("");

  if (!ctx) return <>{children}</>;
  const field = ctx.fields[id];
  if (!field) return <>{children}</>;

  const active = ctx.activeId === id;
  const changed = field.value !== field.original;

  const open = () => {
    setBase(field.value);
    setDraft(field.value);
    ctx.setActiveId(id);
  };

  // No admin os campos podem estar dentro de <a>; os controlos de edição
  // não podem deixar o clique "entrar" no link por baixo.
  const stop = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // "Cancelar": descarta o que foi escrito nesta sessão (volta ao valor de abertura).
  const cancel = () => {
    field.set(base);
    ctx.setActiveId(null);
  };

  // "Reverter": repõe o valor publicado (snapshot).
  const revert = () => {
    field.set(field.original);
    ctx.setActiveId(null);
  };

  // "Atualizar": o valor já está aplicado em direto; apenas fecha.
  const save = () => ctx.setActiveId(null);

  if (active) {
    const Tag = block ? "div" : "span";
    return (
      <Tag
        data-editable={id}
        className={cn(
          "relative z-30 rounded-lg bg-white p-2 shadow-lg ring-1 ring-brand-blue",
          block ? "block" : "inline-block",
          className
        )}
      >
        <span className="mb-1 flex items-center justify-between gap-2 text-[10px] font-extrabold tracking-widest text-brand-navy uppercase">
          {label}
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              cancel();
            }}
            title="Cancelar"
            className="grid size-5 cursor-pointer place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-3.5" />
          </button>
        </span>
<textarea
          autoFocus
          value={draft}
          rows={block ? Math.min(6, 2 + draft.split("\n").length) : 2}
          onClick={stop}
          onChange={(e) => {
            const next = e.target.value;
            setDraft(next);
            field.set(next);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            }
          }}
          className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-brand-blue"
        />
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              cancel();
            }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
          >
            <X className="size-3" /> Cancelar
          </button>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              revert();
            }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 transition-colors hover:bg-amber-100"
          >
            <Undo2 className="size-3" /> Reverter
          </button>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              save();
            }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-brand-blue px-3 py-1.5 text-[11px] font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Check className="size-3" /> Atualizar
          </button>
        </span>
      </Tag>
    );
  }

  const Tag = block ? "div" : "span";
  return (
    <Tag
      data-editable={id}
      className={cn(
        "group relative",
        block ? "block" : "inline-block",
        changed && "rounded-md ring-2 ring-amber-400 ring-offset-1",
        className
      )}
    >
      {children}
      <span
        role="button"
        tabIndex={0}
        title={`Editar ${label}`}
        onClick={(e) => {
          stop(e);
          open();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            open();
          }
        }}
        className="ml-1 inline-flex cursor-pointer items-center gap-1 rounded-full bg-brand-blue px-2 py-0.5 align-middle text-[10px] font-extrabold text-white shadow-md transition-transform hover:-translate-y-0.5"
      >
        <Pencil className="size-2.5" /> Editar
      </span>
      {changed && (
        <span className="ml-1 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 align-middle text-[10px] font-extrabold text-amber-900 shadow-md">
          Alterado
        </span>
      )}
    </Tag>
  );
}

export function buildFields({
  site,
  services,
  snapshotServices,
  snapshotSite,
  updateBrand,
  updateContacts,
  updateValue,
  updateService,
  updateDestaque,
}: {
  site: {
    brand: Record<string, string>;
    contacts: Record<string, string>;
    values: Array<{ title: string; text: string }>;
    destaques: Destaque[];
  };
  services: Array<{
    slug: string;
    title: string;
    summary: string;
    intro: string;
    description: string;
    includes: string[];
  }>;
  snapshotServices?: Array<{ slug: string; title: string; summary: string; intro: string; description: string; includes: string[] }>;
  snapshotSite?: {
    brand: Record<string, string>;
    contacts: Record<string, string>;
    values: Array<{ title: string; text: string }>;
    destaques: Destaque[];
  };
  updateBrand: (key: string, value: string) => void;
  updateContacts: (key: string, value: string) => void;
  updateValue: (index: number, patch: Partial<{ title: string; text: string }>) => void;
  updateService: (index: number, patch: Record<string, unknown>) => void;
  updateDestaque: (index: number, patch: Partial<Destaque>) => void;
}): Record<string, FieldInfo> {
  const fields: Record<string, FieldInfo> = {};

  const origBrand = snapshotSite?.brand ?? {};
  for (const key of Object.keys(site.brand)) {
    fields[`brand.${key}`] = {
      value: site.brand[key],
      original: origBrand[key] ?? "",
      set: (v) => updateBrand(key, v),
    };
  }

  const origContacts = snapshotSite?.contacts ?? {};
  for (const key of Object.keys(site.contacts)) {
    fields[`contacts.${key}`] = {
      value: site.contacts[key],
      original: origContacts[key] ?? "",
      set: (v) => updateContacts(key, v),
    };
  }

  const origValues = snapshotSite?.values ?? [];
  site.values.forEach((value, index) => {
    fields[`values.${index}.title`] = {
      value: value.title,
      original: origValues[index]?.title ?? "",
      set: (v) => updateValue(index, { title: v }),
    };
    fields[`values.${index}.text`] = {
      value: value.text,
      original: origValues[index]?.text ?? "",
      set: (v) => updateValue(index, { text: v }),
    };
  });

  const origDestaques = snapshotSite?.destaques ?? [];
  site.destaques.forEach((destaque, index) => {
    const original = origDestaques[index];
    for (const key of ["title", "text", "image", "date"] as const) {
      fields[`destaques.${index}.${key}`] = {
        value: destaque[key],
        original: original?.[key] ?? "",
        set: (v) => updateDestaque(index, { [key]: v }),
      };
    }
  });

  services.forEach((service, index) => {
    const original = snapshotServices?.[index];
    for (const key of ["title", "summary", "intro", "description"] as const) {
      fields[`services.${index}.${key}`] = {
        value: service[key],
        original: original?.[key] ?? "",
        set: (v) => updateService(index, { [key]: v }),
      };
    }
    fields[`services.${index}.includes`] = {
      value: service.includes.join(", "),
      original: original?.includes.join(", ") ?? "",
      set: (v) =>
        updateService(index, {
          includes: v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
    };
  });

  return fields;
}