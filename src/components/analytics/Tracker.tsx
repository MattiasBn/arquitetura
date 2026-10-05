"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Regista cada visita/página vista no endpoint público /api/track.
 * Funciona em todas as páginas (tem de estar no layout raiz).
 */
export function Tracker() {
  const pathname = usePathname();
  const sent = useRef<string>("");

  useEffect(() => {
    if (sent.current === pathname) return;
    sent.current = pathname;

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        hour: new Date().getHours(),
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {
      /* silencioso — a visita não deve bloquear a navegação */
    });
  }, [pathname]);

  return null;
}