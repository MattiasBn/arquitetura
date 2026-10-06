/**
 * Consentimento de cookies (parte do cliente).
 *
 * O site usa dois cookies:
 *  - `algugest_session` — sessão do admin. Estritamente necessário, não pede
 *    consentimento (não existe login sem ele).
 *  - `algugest_vid`     — estatísticas de visitas. Opcional: só é criado depois
 *    de o visitante aceitar aqui.
 *
 * A escolha fica em localStorage (não é um cookie, por isso não precisa de
 * cookie para guardar a decisão sobre cookies) e é anunciada pelo evento
 * `algugest:consentimento` para o Tracker começar ou parar de imediato.
 */

export const CHAVE_CONSENTO = "algugest_consentimento";

export type Consentimento = "aceite" | "recusado";

export const EVENTO_CONSENTO = "algugest:consentimento";

export function lerConsentimento(): Consentimento | null {
  if (typeof window === "undefined") return null;
  const valor = window.localStorage.getItem(CHAVE_CONSENTO);
  return valor === "aceite" || valor === "recusado" ? valor : null;
}

export function guardarConsentimento(escolha: Consentimento): void {
  window.localStorage.setItem(CHAVE_CONSENTO, escolha);
  window.dispatchEvent(new CustomEvent<Consentimento>(EVENTO_CONSENTO, { detail: escolha }));
}
