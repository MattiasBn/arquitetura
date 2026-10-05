/**
 * Tipos partilhados de analytics (usados pela API do servidor e pelo painel
 * do administrador no cliente). Não importam nada server-only.
 */

export type VisitRecord = {
  id: string;
  ts: number;
  vid: string;
  path: string;
  title?: string;
  device: "mobile" | "tablet" | "desktop" | "bot" | "other";
  browser: string;
  country: string;
  region: string;
  hour: number;
  referrer?: string;
};

export type AnalyticsSummary = {
  total: number;
  unique: number;
  bots: number;
  periodStart: number;
  periodEnd: number;
  perDay: Array<{ date: string; visits: number; unique: number }>;
  topPages: Array<{ label: string; count: number }>;
  devices: Array<{ label: string; count: number }>;
  browsers: Array<{ label: string; count: number }>;
  zones: Array<{ label: string; count: number }>;
  referrers: Array<{ label: string; count: number }>;
  audience: Array<{ label: string; count: number; part: number }>;
  recent: VisitRecord[];
};