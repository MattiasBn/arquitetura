"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  TriangleAlert,
  User,
  WifiOff,
} from "lucide-react";

type AuthError = {
  type: "network" | "timeout" | "server" | "auth" | "generic";
  message: string;
};

type ModalState =
  | {
      kind: "error";
      error: AuthError;
    }
  | { kind: "success" }
  | null;

const ERROR_META: Record<
  AuthError["type"],
  { title: string; icon: typeof CircleAlert }
> = {
  network: { title: "Sem ligação à internet", icon: WifiOff },
  timeout: { title: "O servidor não respondeu", icon: TriangleAlert },
  server: { title: "Servidor indisponível", icon: TriangleAlert },
  auth: { title: "Acesso negado", icon: CircleAlert },
  generic: { title: "Não foi possível entrar", icon: CircleAlert },
};

const REQUEST_TIMEOUT_MS = 12000;

const enter = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function AdminLogin() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal((m) => (m && m.kind === "error" ? null : m));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const clearFieldError = () => {
    if (modal?.kind === "error") setModal(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setModal(null);
    setLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      let res: Response;
      try {
        res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          signal: controller.signal,
        });
      } catch (err) {
        if (controller.signal.aborted) {
          setModal({
            kind: "error",
            error: {
              type: "timeout",
              message:
                "O servidor não respondeu a tempo. Verifique a sua ligação e volte a tentar.",
            },
          });
        } else {
          const isOffline = err instanceof TypeError;
          setModal({
            kind: "error",
            error: {
              type: "network",
              message: isOffline
                ? "Verifique a sua ligação à internet e tente novamente."
                : "Ocorreu um problema na ligação. Tente novamente.",
            },
          });
        }
        return;
      }

      if (!res.ok) {
        let apiMessage = "";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") apiMessage = data.error;
        } catch {
          /* sem corpo JSON */
        }

        if (res.status === 401) {
          setModal({
            kind: "error",
            error: {
              type: "auth",
              message: apiMessage || "O utilizador ou a palavra-passe estão incorretos.",
            },
          });
        } else if (res.status === 429) {
          setModal({
            kind: "error",
            error: { type: "server", message: apiMessage },
          });
        } else if (res.status >= 500) {
          setModal({
            kind: "error",
            error: {
              type: "server",
              message:
                apiMessage ||
                "O servidor está temporariamente fora de serviço. Tente novamente dentro de instantes.",
            },
          });
        } else {
          setModal({
            kind: "error",
            error: {
              type: "generic",
              message: apiMessage || "Não foi possível entrar. Verifique os dados e tente novamente.",
            },
          });
        }
        return;
      }

      setModal({ kind: "success" });
      setTimeout(() => router.refresh(), 1200);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b1220] px-4 py-10">
      {/* Fundo animado */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-24 -left-24 size-96 rounded-full bg-brand-blue/25 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-28 top-1/3 size-[26rem] rounded-full bg-[#1e5fae]/25 blur-3xl"
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-brand-navy/60 blur-3xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgb(35_138_255/8%),transparent_60%)]" />
      </div>

      <motion.div
        variants={enter}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-sm"
        transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
      >
        {/* Cabeçalho */}
        <motion.div variants={enter} className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <motion.div
              aria-hidden
              className="absolute -inset-2 rounded-full bg-brand-blue/20 blur-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative grid size-20 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
              <Image
                src="https://res.cloudinary.com/z50slpsg/image/upload/v1791284939/algugest/imagens/empresa/emblema-algugest.png"
                alt="Algugest"
                width={64}
                height={64}
                className="size-14 rounded-xl object-cover"
              />
            </div>
          </div>
          <div>
            <motion.h1
              variants={enter}
              className="text-2xl font-extrabold tracking-tight text-white"
            >
              Área do Administrador
            </motion.h1>
            <motion.p variants={enter} className="mt-1.5 text-sm text-slate-400">
              Inicie sessão para gerir o site da Algugest.
            </motion.p>
          </div>
        </motion.div>

        {/* Cartão */}
        <motion.form
          variants={enter}
          onSubmit={submit}
          className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl ring-1 ring-black/5"
        >
          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-300 uppercase">
              <User className="size-3.5" /> Utilizador
            </span>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearFieldError();
              }}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="nome do administrador"
              required
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-brand-blue focus:bg-white/[0.07]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-300 uppercase">
              <LockKeyhole className="size-3.5" /> Palavra-passe
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError();
                }}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-brand-blue focus:bg-white/[0.07]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-slate-400 transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : undefined}
            whileTap={!loading ? { scale: 0.98 } : undefined}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-[#3fa3ff] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition-opacity disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> A entrar...
              </>
            ) : (
              <>
                Entrar <ArrowRight className="size-4" />
              </>
            )}
          </motion.button>

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-slate-500">
            <ShieldCheck className="size-3.5 shrink-0" />
            Acesso protegido — apenas a equipa Algugest.
          </p>
        </motion.form>
      </motion.div>

      {/* Modal de erro / sucesso */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key={modal.kind}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={modal.kind === "success" ? "Sessão iniciada" : "Erro no início de sessão"}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => {
              if (modal.kind === "error") setModal(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#101b2d] p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {modal.kind === "success" ? (
                <>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", damping: 14, stiffness: 260 }}
                    className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40"
                  >
                    <CheckCircle2 className="size-8 text-emerald-400" />
                  </motion.div>
                  <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white">
                    Sessão iniciada
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    A entrar no painel do administrador...
                  </p>
                  <Loader2 className="mx-auto mt-5 size-5 animate-spin text-brand-blue" />
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", damping: 14, stiffness: 260 }}
                    className="mx-auto grid size-16 place-items-center rounded-full bg-red-500/15 ring-1 ring-red-400/40"
                  >
                    {(() => {
                      const Icon = ERROR_META[modal.error.type].icon;
                      return <Icon className="size-8 text-red-400" />;
                    })()}
                  </motion.div>
                  <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white">
                    {ERROR_META[modal.error.type].title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {modal.error.message}
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-brand-blue to-[#3fa3ff] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-blue/30 transition-transform hover:-translate-y-0.5"
                    >
                      Tentar novamente
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="w-full cursor-pointer rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-slate-300 transition-colors hover:bg-white/5"
                    >
                      Fechar
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}