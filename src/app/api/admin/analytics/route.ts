import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/server/auth";
import { clearAnalytics, summarizeAnalytics } from "@/lib/server/analytics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const url = new URL(request.url);
  const days = Math.min(90, Math.max(0, Number(url.searchParams.get("days") ?? "30") || 30));
  return NextResponse.json(await summarizeAnalytics(days));
}

export async function DELETE() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  await clearAnalytics();
  return NextResponse.json({ ok: true });
}