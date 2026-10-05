/**
 * Limites e formatos de média, partilhados entre o servidor (validação do
 * upload) e o painel (mensagens e validação imediata no browser).
 *
 * Manter os limites num único sítio garante que o servidor e a UI nunca
 * divergem. Estes valores foram escolhidos para manter o site leve:
 *  - imagens até 5 MB (fotografias de obra);
 *  - vídeos até 50 MB (clips curtos para o carrossel da home).
 */

export const ALLOWED_IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
export const ALLOWED_VIDEO_EXT = ["mp4", "webm", "ogv"];

export const MAX_IMAGE_MB = 5;
export const MAX_VIDEO_MB = 50;

export const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
export const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";
export const VIDEO_ACCEPT = "video/mp4,video/webm,video/ogg";

/** Formata bytes para uma mensagem legível (ex.: "4.2 MB"). */
export function formatMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
