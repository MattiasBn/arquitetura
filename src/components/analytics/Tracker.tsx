"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useConsentimento } from "@/lib/use-consentimento";

/**
 * Regista cada visita/página vista no endpoint público /api/track.
 * Funciona em todas as páginas (tem de estar no layout raiz).
 *
 * Só envia depois de o visitante aceitar os cookies de estatística — sem
 * consentimento não é criado o cookie `algugest_vid` nem é contada a visita.
 */
export function Tracker() {
  const pathname = usePathname();
  const consentimento = useConsentimento();
  const sent = useRef<string>("");

  useEffect(() => {
    if (consentimento !== "aceite") return;
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
  }, [pathname, consentimento]);

  return null;
}
