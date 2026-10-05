"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos — usar em cascata (index * 0.05). */
  delay?: number;
  /** Deslocamento inicial vertical. */
  y?: number;
};

/**
 * Scroll-triggered reveal: o elemento entra com fade-up quando aparece no
 * ecrã, uma única vez. Sem WebGL — só transformações (rápido no telemóvel).
 */
export function Reveal({ children, className, delay = 0, y = 30 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}