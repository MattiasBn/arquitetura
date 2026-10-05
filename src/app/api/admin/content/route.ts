import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/server/auth";
import {
  getServices,
  getSiteInfo,
  resetContent,
  saveContent,
} from "@/lib/server/content";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const [services, site] = await Promise.all([getServices(), getSiteInfo()]);
  return NextResponse.json({
    services: services.map((s) => ({
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      intro: s.intro,
      description: s.description,
      includes: s.includes,
      images: s.images,
    })),
    site,
  });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  let body: Parameters<typeof saveContent>[0];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  await saveContent(body);
  return NextResponse.json({ ok: true });
}

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  await resetContent();
  return NextResponse.json({ ok: true });
}