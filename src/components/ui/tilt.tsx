"use client";

import type { ReactNode } from "react";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Mantido por compatibilidade; já não aplica rotação 3D. */
  max?: number;
  /** Mantido por compatibilidade; já não aplica zoom no hover. */
  scale?: number;
};

/**
 * Antes aplicava tilt 3D + brilho a seguir o rato. Removido por ser um efeito
 * típico de template: agora é só um contentor simples, mantendo a API.
 */
export function Tilt({ children, className }: TiltProps) {
  return <div className={className}>{children}</div>;
}
