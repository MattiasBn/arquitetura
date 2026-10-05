import { NextResponse } from "next/server";

import { db } from "@/lib/server/db";

/**
 * Sonda de saúde usada pelo Render (healthCheckPath) e por monitorização.
 * Responde 200 só quando a base de dados responde; caso contrário 503.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await db();
    const [rows] = await conn.query("SELECT 1 AS ok");
    const ok = Array.isArray(rows) && rows.length > 0;
    if (!ok) throw new Error("resposta inesperada da base de dados");
    return NextResponse.json({
      ok: true,
      db: "ok",
      media: process.env.CLOUDINARY_URL ? "cloudinary" : "disco-local",
      hora: new Date().toISOString(),
    });
  } catch (erro) {
    return NextResponse.json(
      { ok: false, db: "erro", mensagem: erro instanceof Error ? erro.message : "erro desconhecido" },
      { status: 503 },
    );
  }
}