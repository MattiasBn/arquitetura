# Imagem de produção do site Algugest (Next.js + MySQL).
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# --- Dependências ---
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Runtime ---
FROM base AS runner
ENV NODE_ENV=production
# O Render injeta a variavel PORT (e HOSTNAME) no container.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
# Certificado publico da Aiven (TLS da base de dados em producao).
COPY --from=build /app/certs ./certs

# Pastas de dados persistentes (montadas como volumes no compose local).
RUN mkdir -p /app/data /app/public/imagens/uploads

EXPOSE 3000
CMD ["sh", "-c", "npm run start -- -H 0.0.0.0 -p ${PORT:-3000}"]
