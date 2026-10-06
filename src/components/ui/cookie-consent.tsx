"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { guardarConsentimento } from "@/lib/consent";
import { useConsentimento } from "@/lib/use-consentimento";

/**
 * Aviso de cookies + controlo da escolha.
 *
 * `CookieConsent` é a barra que aparece na primeira visita.
 * `ConsentControls` é o painel usado na página /privacidade para rever
 * ou mudar a escolha a qualquer momento.
 */

const classeBotaoPrimario =
  "inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0B132B] transition hover:bg-white/90";
const classeBotaoSecundario =
  "inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5";

export function CookieConsent() {
  const consentimento = useConsentimento();
  const [aberto, setAberto] = useState(false);

  // Espera um instante para não saltar à frente do conteúdo da página.
  useEffect(() => {
    if (consentimento !== null) return;
    const tempo = window.setTimeout(() => setAberto(true), 500);
    return () => window.clearTimeout(tempo);
  }, [consentimento]);

  if (!aberto || consentimento !== null) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0B132B]/95 p-5 shadow-2xl backdrop-blur sm:p-6">
        <p className="text-sm leading-relaxed text-white/80">
          Usamos cookies para o site funcionar e, se autorizar, para medir as
          visitas de forma anónima. Pode recusar sem perder nada.{" "}
          <Link href="/privacidade" className="font-semibold text-white underline underline-offset-4">
            Política de Privacidade e Cookies
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => guardarConsentimento("aceite")}
            className={classeBotaoPrimario}
          >
            Aceitar cookies
          </button>
          <button
            type="button"
            onClick={() => guardarConsentimento("recusado")}
            className={classeBotaoSecundario}
          >
            Só os essenciais
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConsentControls() {
  const consentimento = useConsentimento();

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-sm text-black/60">
        Estado atual:{" "}
        <strong className="text-black">
          {consentimento === "aceite"
            ? "cookies de estatística aceites"
            : consentimento === "recusado"
              ? "apenas cookies essenciais"
              : "escolha por fazer"}
        </strong>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => guardarConsentimento("aceite")}
          className="inline-flex items-center justify-center rounded-full bg-[#0B132B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B132B]/90"
        >
          Aceitar estatísticas
        </button>
        <button
          type="button"
          onClick={() => guardarConsentimento("recusado")}
          className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black/70 transition hover:border-black/40 hover:text-black"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}
