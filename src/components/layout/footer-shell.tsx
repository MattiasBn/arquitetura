"use client";

import Link from "next/link";
import Image from "next/image";

import { Ed } from "@/components/admin/editing-context";

type Contacts = Record<string, string>;

export default function FooterShell({ contacts }: { contacts: Contacts }) {
  const phoneWhatsApp = contacts.phoneWhatsApp ?? "";
  const phoneCall = contacts.phoneCall ?? "";
  const waNumber = `244${phoneWhatsApp.replace(/\s/g, "")}`;
  const waLink = `https://wa.me/${waNumber}`;
  const callNumber = `+${waNumber.slice(0, 3)}${phoneCall.replace(/\s/g, "")}`;

  const nav = [
    { href: "/", label: "Início" },
    { href: "/servicos", label: "Serviços" },
    { href: "/destaques", label: "Destaques" },
    { href: "/portfolio", label: "Projetos" },
    { href: "/sobre", label: "Sobre nós" },
    { href: "/contactos", label: "Contactos" },
  ];

  return (
    <footer className="bg-[#0B132B] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Identidade */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/z50slpsg/image/upload/v1791284949/algugest/imagens/empresa/logotipo-algugest.png"
                alt="Algugest Serviços"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <span className="block text-base font-bold tracking-tight uppercase">Algugest</span>
                <span className="block text-[10px] font-semibold tracking-[0.2em] text-white/50">
                  SERVIÇOS, (SU), LDA
                </span>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Especialistas em soluções integradas de engenharia civil,
              telecomunicações e acabamentos de alto padrão em Angola.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-sm font-semibold text-white">Navegação</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/60 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h4 className="text-sm font-semibold text-white">Contactos</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>
                <Ed id="contacts.phoneWhatsApp" label="WhatsApp" block={false}>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                    WhatsApp +{phoneWhatsApp ? `244 ${phoneWhatsApp}` : "244 950 521 741"}
                  </a>
                </Ed>
              </li>
              <li>
                <Ed id="contacts.phoneCall" label="Chamada normal" block={false}>
                  <a href={`tel:${callNumber}`} className="transition-colors hover:text-white">
                    Chamada +{phoneCall ? `244 ${phoneCall}` : "244 925 212 282"}
                  </a>
                </Ed>
              </li>
              <li>
                <Ed id="contacts.email" label="E-mail" block={false}>
                  <a href={`mailto:${contacts.email}`} className="transition-colors hover:text-white">
                    {contacts.email}
                  </a>
                </Ed>
              </li>
              <li>
                <Ed id="contacts.nif" label="NIF" block={false}>
                  <span>NIF {contacts.nif}</span>
                </Ed>
              </li>
            </ul>
          </div>

          {/* Localização */}
          <div>
            <h4 className="text-sm font-semibold text-white">Sede</h4>
            <Ed id="contacts.address" label="Morada" className="mt-5 text-sm leading-relaxed text-white/60">
              <p className="mt-5 text-sm leading-relaxed text-white/60">{contacts.address}</p>
            </Ed>
            <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">
              Luanda — Angola
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/50 sm:flex-row sm:px-8 lg:px-12">
          <Ed id="contacts.legalName" label="Razão social">
            <p>
              © {new Date().getFullYear()} {contacts.legalName}. Todos os direitos reservados.
            </p>
          </Ed>
          <Link href="/admin" className="transition-colors hover:text-white">
            .....
          </Link>
        </div>
      </div>
    </footer>
  );
}
