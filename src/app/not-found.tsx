import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-surface border border-gray-200 p-8 text-center space-y-6 shadow-lg">
        <div className="w-16 h-16 bg-[#0B132B] text-white rounded-full flex items-center justify-center mx-auto text-xl font-black tracking-widest shadow-[0_0_15px_rgba(2,132,199,0.3)]">
          404
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground uppercase tracking-tight">
            Página Não Encontrada
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            A página ou projeto que procura na Algugest Serviços não existe ou foi alterada de endereço.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-block w-full bg-primary text-white font-extrabold uppercase text-xs tracking-widest py-3.5 px-6 hover:opacity-90 transition shadow-[0_4px_12px_rgba(2,132,199,0.3)]"
          >
            Voltar à Página Principal
          </Link>
        </div>
      </div>
    </div>
  );
}