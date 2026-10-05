"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileQuestion,
  Home,
  Info,
  Phone,
  Search,
  Wrench,
} from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SEARCH_INDEX, type SearchItem } from "@/lib/search";
import { cn } from "@/lib/utils";

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const GROUP_ICONS: Record<SearchItem["group"], typeof Home> = {
  Início: Home,
  Serviço: Wrench,
  Projeto: Briefcase,
  Sobre: Info,
  Empresa: Building2,
  Contacto: Phone,
};

const SUGGESTIONS = [
  "Telecomunicações",
  "Cozinhas",
  "Construção",
  "Jardinagem",
  "NIF",
  "Morada",
];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(-1);

  const rawQuery = normalize(query.trim());

  const results = useMemo(() => {
    if (!rawQuery) return [];
    const tokens = rawQuery.split(/\s+/).filter(Boolean);
    const matches = SEARCH_INDEX.filter((item) => {
      const haystack = normalize(
        [item.title, item.description, ...item.keywords].join(" ")
      );
      return tokens.every((token) => haystack.includes(token));
    });
    return matches.slice(0, 24);
  }, [rawQuery]);

  const go = (url: string) => {
    onOpenChange(false);
    setQuery("");
    setHighlight(-1);
    router.push(url);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (results.length ? (h + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (results.length ? (h - 1 + results.length) % results.length : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[Math.max(highlight, 0)];
      if (item) go(item.url);
    }
  };

  const close = (url: string) => go(url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="inset-x-4 top-[12vh] left-1/2 max-w-2xl max-h-[78vh] translate-x-[-50%] translate-y-0 p-0 gap-0 overflow-hidden rounded-3xl sm:inset-x-auto sm:left-1/2 sm:top-[12vh] sm:max-w-2xl sm:translate-x-[-50%] sm:translate-y-0"
      >
        <DialogTitle className="sr-only">Pesquisar no site</DialogTitle>

        {/* Caixa de pesquisa */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(-1);
            }}
            onKeyDown={onKeyDown}
            placeholder="Pesquisar serviços, projetos, contactos..."
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/80"
            aria-label="Pesquisar no site"
          />
          <kbd className="hidden rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-semibold text-muted-foreground sm:block">
            Esc
          </kbd>
        </div>

        {/* Sugestões quando o campo está vazio */}
        {!rawQuery && (
          <div className="flex flex-wrap gap-2 px-5 py-4">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="cursor-pointer rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-brand-blue/50 hover:text-brand-navy"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Resultados */}
        <div className="max-h-[56vh] overflow-y-auto px-2 pb-3">
          {rawQuery && results.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <FileQuestion className="size-9 text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground">
                Não encontrámos nada para &ldquo;{query}&rdquo;.
              </p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                Tente outras palavras — por exemplo &ldquo;antena&rdquo;,
                &ldquo;cozinha&rdquo;, &ldquo;postes&rdquo; ou &ldquo;orçamento&rdquo;.
              </p>
            </div>
          )}

          {rawQuery && results.length > 0 && (
            <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {results.length} resultado{results.length === 1 ? "" : "s"}
            </p>
          )}

          {results.map((item, index) => {
            const Icon = GROUP_ICONS[item.group];
            const selected = index === highlight;
            return (
              <Link
                key={`${item.url}-${item.title}`}
                href={item.url}
                onMouseEnter={() => setHighlight(index)}
                onMouseLeave={() => setHighlight((h) => (h === index ? -1 : h))}
                onClick={() => close(item.url)}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors",
                  selected ? "bg-brand-blue/10" : "hover:bg-muted/50"
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                    selected
                      ? "bg-brand-blue text-white"
                      : "bg-brand-blue/10 text-brand-blue"
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      selected
                        ? "bg-white text-brand-blue"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.group}
                  </span>
                  <ArrowRight
                    className={cn(
                      "size-4 transition-all",
                      selected
                        ? "translate-x-0 text-brand-blue"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )}
                  />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Rodapé com atalhos */}
        <div className="hidden items-center gap-4 border-t border-border px-5 py-3 text-[11px] text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-semibold">↑↓</kbd>
            navegar
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-semibold">Enter</kbd>
            abrir
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-semibold">Esc</kbd>
            fechar
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}