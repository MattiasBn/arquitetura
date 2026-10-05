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

  // Propriedade de primeiro nível (fora do experimental)
  // Aceita dinamicamente qualquer IP ativo na sua máquina + localhost
  allowedDevOrigins: ["localhost", "127.0.0.1", ...obterIpRede()],

  images: {
    // Next.js 16 so aceita valores de quality aqui listados.
    // Sem isto, quality={100} e ignorado/rejeitado.
    qualities: [75, 90, 100],
    formats: ["image/avif", "image/webp"],
    // Imagens e videos guardados na Cloudinary (producao).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", port: "", pathname: "/**" },
    ],
  },
};

export default nextConfig;
