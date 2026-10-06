"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Search } from "lucide-react";

import { whatsappLink } from "@/lib/site";
import { SearchDialog } from "@/components/ui/SearchDialog";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/destaques", label: "Destaques" },
  { href: "/portfolio", label: "Projetos" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/contactos", label: "Contactos" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Na home (herói com vídeo) o nav é transparente no topo; nas restantes
  // páginas é sempre sólido.
  const isHome = pathname === "/";
  const solid = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-foreground/10 bg-white" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:h-20 lg:px-12">
        {/* Logótipo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://res.cloudinary.com/z50slpsg/image/upload/v1791284939/algugest/imagens/empresa/emblema-algugest.png"
            alt="Algugest Serviços"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <span
            className={`text-base font-bold tracking-tight uppercase transition-colors ${
              solid ? "text-foreground" : "text-white"
            }`}
          >
            Algugest
            <span className={`block text-[10px] font-semibold tracking-[0.2em] ${solid ? "text-muted" : "text-white/70"}`}>
              SERVIÇOS
            </span>
          </span>
        </Link>

        {/* Navegação */}
        <nav
          className={`hidden items-center gap-8 text-sm font-medium lg:flex ${
            solid ? "text-foreground" : "text-white"
          }`}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-brand-blue ${
                pathname === link.href ? "text-brand-blue" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Ações */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="Pesquisar no site"
            onClick={() => setSearchOpen(true)}
            className={`cursor-pointer p-2 transition-colors hover:text-brand-blue ${solid ? "text-foreground" : "text-white"}`}
          >
            <Search className="size-5" />
          </button>

          <a
            href={whatsappLink("Olá! Vi o vosso site e gostaria de pedir um orçamento.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-blue inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy"
          >
            <MessageCircle className="size-4" />
            Conversar
          </a>
        </div>

        {/* Pesquisa e menu no mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            aria-label="Pesquisar no site"
            onClick={() => setSearchOpen(true)}
            className={`p-2 ${solid ? "text-foreground" : "text-white"}`}
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            className={`p-2 focus:outline-none ${solid ? "text-foreground" : "text-white"}`}
          >
            <svg className="size-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-foreground/10 bg-white px-6 lg:hidden"
          >
            <nav className="flex flex-col py-2">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="border-b border-foreground/5 py-3.5 text-sm font-medium text-foreground transition-colors hover:text-brand-blue"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={whatsappLink("Olá! Gostaria de pedir um orçamento.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="bg-brand-blue mt-4 mb-4 flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white"
              >
                <MessageCircle className="size-4" />
                Pedir orçamento
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
