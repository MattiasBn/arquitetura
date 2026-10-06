"use client";

import { useEffect } from "react";

/**
 * Indicador de carregamento de media.
 *
 * Enquanto o browser ainda não tem a imagem/vídeo, a caixa mostra o brilho
 * definido em globals.css; aqui acrescentamos a classe `media-ok` quando o
 * ficheiro termina de carregar.
 *
 * Se a imagem falhar (timeout, entrada estragada no otimizador, 404 na
 * origem), tenta **uma vez** de novo com um pedido novo, sem cache — em vez
 * de deixar o ícone partido na página. Só na segunda falha é que desiste.
 *
 * Observa também nós novos: galerias e destaques são renderizados depois do
 * hidratar, por isso não basta olhar uma vez para o DOM.
 */

function marcar(elemento: Element) {
  elemento.classList.add("media-ok");
}

function tentarOutraVez(img: HTMLImageElement) {
  const origem = img.currentSrc || img.src || img.getAttribute("src") || "";
  if (!origem) {
    marcar(img);
    return;
  }

  img.dataset.retry = "1";
  // Sem srcset o browser é obrigado a usar o src — é assim que forçamos o
  // novo pedido mesmo em imagens responsivas.
  img.removeAttribute("srcset");

  img.src = novoPedido(origem);
}

/**
 * Próximo pedido com chave de cache diferente.
 *
 * O otimizador do Next só usa `url`, `w` e `q` como chave — parâmetros
 * inventados (como `cb=`) são ignorados e servem a mesma entrada estragada.
 * Por isso trocamos mesmo o `q` (75 <-> 90), que obriga a uma conversão nova.
 */
function novoPedido(origem: string): string {
  if (!origem.includes("/_next/image")) return origem;

  try {
    const url = new URL(origem);
    const atual = url.searchParams.get("q");
    url.searchParams.set("q", atual === "75" ? "90" : "75");
    return url.toString();
  } catch {
    return origem;
  }
}

function aoFalhar(img: HTMLImageElement) {
  if (img.dataset.retry !== "1") {
    tentarOutraVez(img);
    return;
  }
  // Segunda falha: desiste, para a animação e deixa o browser mostrar o que
  // tiver (o ícone de imagem indisponível).
  marcar(img);
}

function acompanhar(elemento: Element) {
  if (elemento.classList.contains("media-ok")) return;
  if (elemento.getAttribute("data-escutado") === "1") return;

  if (elemento instanceof HTMLImageElement) {
    elemento.dataset.escutado = "1";

    elemento.addEventListener("load", () => marcar(elemento));
    elemento.addEventListener("error", () => aoFalhar(elemento));

    if (elemento.complete) {
      // Já acabou antes de termos listeners: ou tem pixels, ou falhou.
      if (elemento.naturalWidth > 0) marcar(elemento);
      else aoFalhar(elemento);
    }
    return;
  }

  if (elemento instanceof HTMLVideoElement) {
    elemento.dataset.escutado = "1";
    const concluir = () => marcar(elemento);

    if (elemento.readyState >= 2) {
      marcar(elemento);
      return;
    }
    elemento.addEventListener("loadeddata", concluir);
    elemento.addEventListener("canplay", concluir);
    // Vídeo não repete a tentativa (ficheiros grandes); falhou, pára.
    elemento.addEventListener("error", concluir);
  }
}

function procurar(raiz: ParentNode) {
  for (const filho of raiz.children) {
    if (filho.matches("img, video")) acompanhar(filho);
    procurar(filho);
  }
}

export default function MediaLoader() {
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.add("js-media");

    procurar(document.body);

    const observador = new MutationObserver((mutacoes) => {
      for (const mutacao of mutacoes) {
        for (const nó of mutacao.addedNodes) {
          if (!(nó instanceof Element)) continue;
          if (nó.matches("img, video")) acompanhar(nó);
          procurar(nó);
        }
      }
    });
    observador.observe(document.body, { childList: true, subtree: true });

    return () => {
      observador.disconnect();
      raiz.classList.remove("js-media");
    };
  }, []);

  return null;
}
