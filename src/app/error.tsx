"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registo de erro no console para depuração técnica
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[75vh] bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-surface border border-gray-200 p-8 text-center space-y-6 shadow-lg">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
          !
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground uppercase tracking-tight">
            Erro no Sistema
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Ocorreu um imprevisto ao carregar este conteúdo da Algugest Serviços. A nossa equipa técnica foi notificada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full bg-primary text-white font-extrabold uppercase text-xs tracking-widest py-3 px-4 hover:opacity-90 transition shadow-sm"
          >
            Tentar Novamente
          </button>
          
          <Link
            href="/"
            className="w-full bg-foreground text-white font-extrabold uppercase text-xs tracking-widest py-3 px-4 hover:opacity-90 transition shadow-sm flex items-center justify-center"
          >
            Ir para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}