import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ authed: false }, { status: 401 });
  return NextResponse.json({ authed: true });
}