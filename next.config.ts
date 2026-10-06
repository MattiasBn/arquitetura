import type { NextConfig } from "next";
import os from "os";

// Função para detetar dinamicamente o IP real da máquina na rede local
const obterIpRede = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ipsDetetados: string[] = [];

  for (const nomeInterface in interfaces) {
    const rede = interfaces[nomeInterface];
    if (rede) {
      for (const info of rede) {
        // Filtra apenas IPs IPv4 e que não sejam o próprio computador (localhost/loopback)
        if (info.family === "IPv4" && !info.internal) {
          ipsDetetados.push(info.address);
        }
      }
    }
  }
  return ipsDetetados;
};

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Não anuncia a versão do Next aos atacantes.
  poweredByHeader: false,

  // Propriedade de primeiro nível (fora do experimental)
  // Aceita dinamicamente qualquer IP ativo na sua máquina + localhost
  allowedDevOrigins: ["localhost", "127.0.0.1", ...obterIpRede()],

  images: {
    // Next.js 16 so aceita valores de quality aqui listados.
    // Sem isto, quality={100} e ignorado/rejeitado.
    qualities: [75, 90, 100],
    formats: ["image/avif", "image/webp"],
    // Por omissao o Next guarda as imagens otimizadas apenas 60 segundos e
    // volta a ir busca-las a origem (Cloudinary, ~0,9 s cada) — era por isso
    // que as imagens demoravam a aparecer a cada minuto. Aguarduardamos 1 ano.
    minimumCacheTTL: 31_536_000,
    // Corta o 3840 da lista de larguras: numa ecrã retina o browser pedia a
    // maior variante (150 KB por foto). 2048 chega e sobra para qualquer ecrã.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Imagens e videos guardados na Cloudinary (producao).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", port: "", pathname: "/**" },
    ],
  },

  /**
   * Cabeçalhos de segurança aplicados a todas as rotas.
   * A sessão do admin já é cookie httpOnly/secure; aqui protegemos o resto
   * (clickjacking, MIME-sniffing, fuga de referer, políticas de permissão).
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            // Limita de onde o site pode carregar coisas. O Next injecta os
            // payloads RSC em <script> inline e a maioria dos estilos é
            // inline, por isso 'unsafe-inline' é inevitável — mas scripts de
            // domínios externos, objetos e eval continuam bloqueados.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://res.cloudinary.com",
              "media-src 'self' blob: https://res.cloudinary.com",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src https://www.google.com https://maps.google.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
