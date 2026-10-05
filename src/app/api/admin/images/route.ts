import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/server/auth";
import { listMedia, saveUpload } from "@/lib/server/images";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const url = new URL(request.url);
  const kind = url.searchParams.get("tipo");
  const media = await listMedia(kind === "videos" ? "videos" : kind === "all" ? "all" : "images");
  return NextResponse.json({ media });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Envie um ficheiro de imagem." }, { status: 400 });
  }
  const result = await saveUpload(file);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, path: result.path });
}