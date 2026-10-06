import type { Metadata } from "next";

import { CONTACTS, SITE_URL } from "@/lib/site";
import { ConsentControls } from "@/components/ui/cookie-consent";

export const metadata: Metadata = {
  title: "Política de Privacidade e Cookies",
  description:
    "Como a Algugest trata dados pessoais e usa cookies: cookies essenciais, estatísticas anónimas, serviços de terceiros e como mudar a sua escolha a qualquer momento.",
  alternates: { canonical: `${SITE_URL}/privacidade` },
  robots: { index: true, follow: true },
};

const COOKIES = [
  {
    nome: "algugest_session",
    tipo: "Essencial",
    finalidade: "Manter a sessão iniciada no painel de administração. Sem ele, o login não funciona.",
    duracao: "12 horas",
  },
  {
    nome: "algugest_vid",
    tipo: "Estatística",
    finalidade:
      "Contar visitas e páginas vistas de forma anónima (dispositivo, navegador e hora). Não identifica ninguém e não é usado para publicidade.",
    duracao: "400 dias",
  },
  {
    nome: "algugest_consentimento",
    tipo: "Preferência",
    finalidade: "Guardar a sua escolha sobre os cookies de estatística para não perguntar de novo.",
    duracao: "Até limpar os dados do browser",
  },
];

const TERCEIROS = [
  {
    nome: "Cloudinary",
    papel: "Guarda e entrega as imagens e vídeos do site.",
    dado: "Apenas os ficheiros de media — nenhum dado pessoal.",
  },
  {
    nome: "Aiven",
    papel: "Aloja a base de dados do site.",
    dado: "Conteúdo do site e contactos enviados pelos formulários.",
  },
  {
    nome: "Render",
    papel: "Aloja o site (servidor) e regista erros técnicos.",
    dado: "Endereço IP e dados de acesso, por motivos de segurança.",
  },
  {
    nome: "Google Maps",
    papel: "Mapa embutido na página de contactos.",
    dado: "Pode criar cookies próprios do Google ao carregar o mapa.",
  },
];

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:px-8 lg:pt-24">
      <p className="text-sm font-semibold tracking-[0.2em] text-[#238AFF] uppercase">
        Legal
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Política de Privacidade e Cookies
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[#162A5E]/70">
        Esta página explica, de forma directa, que dados recolhemos neste site,
        para que servem e como pode controlá-los. Em vigor desde Outubro de 2026.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-bold">1. Quem é responsável</h2>
        <p className="mt-3 leading-relaxed text-[#162A5E]/75">
          {CONTACTS.legalName}, NIF {CONTACTS.nif}, com sede em Luanda, Angola
          ({CONTACTS.address}). Para qualquer questão sobre dados pessoais,
          escreva para <strong>{CONTACTS.email}</strong>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">2. O que recolhemos</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-[#162A5E]/75">
          <li>
            <strong>Conteúdo que nos envia</strong> — mensagens de WhatsApp,
            e-mail ou formulário, apenas para responder ao seu pedido.
          </li>
          <li>
            <strong>Estatísticas anónimas de navegação</strong> — página vista,
            hora, tipo de dispositivo, navegador e país. Servem para perceber o
            que interessa aos visitantes; não servem para publicidade nem para
            identificar ninguém.
          </li>
          <li>
            <strong>Registos técnicos do servidor</strong> — endereço IP e erros,
            guardados durante algum tempo para segurança e diagnóstico.
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-[#162A5E]/75">
          Não usamos cookies de publicidade, não vendemos dados e não os
          partilhamos com terceiros para fins próprios.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">3. Cookies que usamos</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#162A5E]/15">
                <th className="py-3 pr-4 font-semibold">Cookie</th>
                <th className="py-3 pr-4 font-semibold">Tipo</th>
                <th className="py-3 pr-4 font-semibold">Para que serve</th>
                <th className="py-3 font-semibold">Duração</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((cookie) => (
                <tr key={cookie.nome} className="border-b border-[#162A5E]/10 align-top">
                  <td className="py-3 pr-4 font-mono text-xs">{cookie.nome}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        cookie.tipo === "Essencial"
                          ? "rounded-full bg-[#162A5E]/10 px-2 py-0.5 text-xs font-semibold"
                          : "rounded-full bg-[#238AFF]/10 px-2 py-0.5 text-xs font-semibold text-[#238AFF]"
                      }
                    >
                      {cookie.tipo}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[#162A5E]/75">{cookie.finalidade}</td>
                  <td className="py-3 text-[#162A5E]/75">{cookie.duracao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#162A5E]/70">
          Os cookies <strong>essenciais</strong> não pedem consentimento — sem
          eles o site ou o painel não funcionam. Os de <strong>estatística</strong>{" "}
          só são criados se autorizar abaixo.
        </p>

        <div className="mt-6">
          <ConsentControls />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">4. Serviços de terceiros</h2>
        <p className="mt-3 leading-relaxed text-[#162A5E]/75">
          O site não funciona sozinho: usamos serviços externos para guardar
          ficheiros, base de dados e alojamento.
        </p>
        <ul className="mt-4 divide-y divide-[#162A5E]/10 border-y border-[#162A5E]/10">
          {TERCEIROS.map((item) => (
            <li key={item.nome} className="py-4">
              <p className="font-semibold">{item.nome}</p>
              <p className="mt-1 text-sm text-[#162A5E]/75">{item.papel}</p>
              <p className="mt-1 text-sm text-[#162A5E]/55">{item.dado}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-[#162A5E]/70">
          Os links para WhatsApp abrem o aplicativo do utilizador e ficam fora do
          controlo deste site.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">5. Os seus direitos</h2>
        <p className="mt-3 leading-relaxed text-[#162A5E]/75">
          Nos termos da Lei n.º 22/11 de Protecção de Dados Pessoais de Angola,
          pode pedir acesso aos seus dados, rectificação, apagamento ou oposição
          ao tratamento. Basta escrever para{" "}
          <strong>{CONTACTS.email}</strong> com o pedido — respondemos pelo mesmo
          canal.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">6. Como mudar a sua escolha</h2>
        <p className="mt-3 leading-relaxed text-[#162A5E]/75">
          Use os botões desta página para aceitar ou recusar os cookies de
          estatística, a qualquer momento. Também pode apagar os dados do site
          nas definições do browser («Privacidade → Limpar dados de navegação»),
          o que apaga a escolha guardada e volta a mostrar o aviso.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">7. Alterações</h2>
        <p className="mt-3 leading-relaxed text-[#162A5E]/75">
          Se as regras mudarem, actualizamos esta página e indicamos a data no
          início do texto. Dúvidas sobre este documento:{" "}
          <strong>{CONTACTS.email}</strong>.
        </p>
      </section>
    </main>
  );
}
