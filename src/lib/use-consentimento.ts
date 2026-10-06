"use client";

import { useSyncExternalStore } from "react";

import { EVENTO_CONSENTO, lerConsentimento, type Consentimento } from "@/lib/consent";

/**
 * Lê o consentimento como uma fonte externa: o valor vive no localStorage e
 * é anunciado pelo evento `algugest:consentimento` (e pela mudança em outras
 * abas, via evento `storage`). `useSyncExternalStore` evita o setState
 * dentro de efeitos, que o React Compiler recusa.
 */

function inscrever(aoMudar: () => void) {
  window.addEventListener(EVENTO_CONSENTO, aoMudar);
  window.addEventListener("storage", aoMudar);
  return () => {
    window.removeEventListener(EVENTO_CONSENTO, aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}

function obter(): Consentimento | null {
  return lerConsentimento();
}

function obterServidor(): null {
  return null;
}

export function useConsentimento(): Consentimento | null {
  return useSyncExternalStore(inscrever, obter, obterServidor);
}
