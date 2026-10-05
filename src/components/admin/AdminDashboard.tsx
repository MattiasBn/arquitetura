"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Eye,
  Users,
  LayoutGrid,
  Megaphone,
  PencilRuler,
  LogOut,
  Clock,
} from "lucide-react";

import type { AnalyticsSummary } from "@/lib/analytics-types";
import { cn } from "@/lib/utils";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { DestaquesManager } from "@/components/admin/destaques-manager";

type Tab = "acessos" | "visitantes" | "destaques" | "conteudo";

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Telemóvel",
  desktop: "Computador",
  tablet: "Tablet",
  bot: "Bot",
  other: "Outro",
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("acessos");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  const maxDay = Math.max(1, ...(data?.perDay.map((d) => d.visits) ?? [1]));
  const maxBar = (v: number) => `${Math.max(4, Math.round((v / maxDay) * 100))}%`;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/imagens/empresa/emblema-algugest.png"
            alt="Algugest"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-blue/30"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">
              Painel do Administrador
            </h1>
            <p className="text-sm text-muted-foreground">
              Acessos ao site e gestão de conteúdo.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:border-red-300 hover:text-red-600"
        >
          <LogOut className="size-4" /> Sair
        </button>
      </div>

      {/* Abas */}
      <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {(
          [
            { id: "acessos", label: "Visão geral", icon: Eye },
            { id: "visitantes", label: "Visitantes", icon: Users },
            { id: "destaques", label: "Destaques", icon: Megaphone },
            { id: "conteudo", label: "Conteúdo do site", icon: PencilRuler },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors",
              tab === item.id
                ? "bg-brand-blue text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* CONTEÚDO */}
      {tab === "conteudo" && <ContentEditor />}

      {/* DESTAQUES */}
      {tab === "destaques" && <DestaquesManager />}

      {(tab === "acessos" || tab === "visitantes") && (
        <div className="mt-8 space-y-8">
          {/* Seletor de período */}
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-navy">
              <BarChart3 className="size-5 text-brand-blue" />
              Estatísticas de acesso
            </h2>
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
              {(
                [
                  { value: 7, label: "7 dias" },
                  { value: 30, label: "30 dias" },
                  { value: 0, label: "Tudo" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDays(opt.value)}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                    days === opt.value
                      ? "bg-brand-blue text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading && !data ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-sm text-muted-foreground">
              A carregar estatísticas...
            </div>
          ) : !data ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-sm text-muted-foreground">
              Sem dados disponíveis.
            </div>
          ) : (
            <>
              {/* Cartões principais */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Visitas (pessoas)", value: data.total, icon: Eye },
                  { label: "Visitantes únicos", value: data.unique, icon: Users },
                  { label: "Páginas visitadas", value: data.topPages.length, icon: LayoutGrid },
                  { label: "Zonas alcançadas", value: data.zones.length, icon: BarChart3 },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <card.icon className="size-5 text-brand-blue" />
                    <p className="mt-3 text-3xl font-extrabold tabular-nums text-brand-navy">
                      {card.value.toLocaleString("pt-PT")}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase">
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Gráfico por dia */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-sm font-extrabold text-brand-navy uppercase">
                  Acessos por dia
                </h3>
                {data.perDay.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Ainda sem visitas registadas neste período.
                  </p>
                ) : (
                  <div className="flex h-36 items-end gap-[3px] overflow-hidden">
                    {data.perDay.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.visits} visita(s), ${day.unique} visitante(s)`}
                        className="group relative flex-1 rounded-t bg-brand-blue/70 transition-colors hover:bg-brand-blue"
                        style={{ height: maxBar(day.visits) }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {/* Zonas */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-brand-navy uppercase">Zonas alcançadas</h3>
                  <ZonesList zones={data.zones} total={data.total} />
                </div>

                {/* Dispositivos + audiência */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-brand-navy uppercase">Dispositivos</h3>
                  <BarsList items={data.devices.map((d) => ({ ...d, label: DEVICE_LABELS[d.label] ?? d.label }))} />
                  <h3 className="mt-6 text-sm font-extrabold text-brand-navy uppercase">Público</h3>
                  <BarsList items={data.audience} />
                </div>

                {/* Páginas + navegadores */}
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-extrabold text-brand-navy uppercase">Páginas mais vistas</h3>
                    <BarsList items={data.topPages.slice(0, 8)} />
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-extrabold text-brand-navy uppercase">Navegadores</h3>
                    <BarsList items={data.browsers} />
                  </div>
                </div>
              </div>

              {/* Referências */}
              {data.referrers.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-brand-navy uppercase">De onde vieram</h3>
                  <BarsList items={data.referrers} />
                </div>
              )}

              {/* Nota idade */}
              <p className="rounded-2xl bg-amber-50 px-5 py-4 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
                Nota: a faixa &ldquo;Jovens/Adultos&rdquo; é uma estimativa baseada em
                dispositivo e horário de visita. O site não consegue saber a idade
                real de cada visitante — para dados exatos recomenda-se um estudo
                com o público.
              </p>
            </>
          )}

          {/* Visitantes recentes */}
          {tab === "visitantes" && data && (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6 pb-4">
                <h3 className="text-sm font-extrabold text-brand-navy uppercase">Últimas visitas</h3>
              </div>
              {data.recent.length === 0 ? (
                <p className="p-10 text-center text-sm text-muted-foreground">Sem visitas registadas.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] text-muted-foreground uppercase">
                        <th className="px-6 py-3 font-bold">Quando</th>
                        <th className="px-6 py-3 font-bold">Página</th>
                        <th className="px-6 py-3 font-bold">Dispositivo</th>
                        <th className="px-6 py-3 font-bold">Navegador</th>
                        <th className="px-6 py-3 font-bold">Zona</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent.map((visit) => (
                        <tr key={visit.id} className="border-b border-slate-50">
                          <td className="flex items-center gap-1.5 px-6 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            <Clock className="size-3" />
                            {formatDate(visit.ts)}
                          </td>
                          <td className="px-6 py-3 font-semibold text-brand-navy">{visit.path}</td>
                          <td className="px-6 py-3 text-slate-600">{DEVICE_LABELS[visit.device] ?? visit.device}</td>
                          <td className="px-6 py-3 text-slate-600">{visit.browser}</td>
                          <td className="px-6 py-3 text-slate-600">
                            {visit.region && visit.region !== "—" ? `${visit.region} · ${visit.country}` : visit.country}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ZonesList({ zones, total }: { zones: Array<{ label: string; count: number }>; total: number }) {
  if (zones.length === 0) return <p className="py-4 text-sm text-muted-foreground">Ainda sem dados.</p>;
  const list = zones.slice(0, 8);
  const others = zones.slice(8).reduce((sum, z) => sum + z.count, 0);
  return (
    <ul className="mt-4 space-y-2.5">
      {list.map((zone) => (
        <li key={zone.label} className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate font-semibold text-slate-700">{zone.label}</span>
          <span className="whitespace-nowrap text-xs font-bold text-muted-foreground">
            {zone.count.toLocaleString("pt-PT")} · {total ? Math.round((zone.count / total) * 100) : 0}%
          </span>
        </li>
      ))}
      {others > 0 && (
        <li className="flex items-center justify-between text-sm text-slate-400">
          <span>Outras zonas</span>
          <span className="text-xs font-bold">{others}</span>
        </li>
      )}
    </ul>
  );
}

function BarsList({ items }: { items: Array<{ label: string; count: number; part?: number }> }) {
  if (items.length === 0) return <p className="py-4 text-sm text-muted-foreground">Ainda sem dados.</p>;
  const max = Math.max(1, items[0].count);
  return (
    <ul className="mt-4 space-y-2.5">
      {items.slice(0, 10).map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="truncate font-semibold text-slate-700">{item.label}</span>
            <span className="ml-2 whitespace-nowrap text-xs font-bold text-muted-foreground">
              {item.count.toLocaleString("pt-PT")}
              {typeof item.part === "number" && ` · ${item.part}%`}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-blue"
              style={{ width: `${Math.max(3, Math.round((item.count / max) * 100))}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}