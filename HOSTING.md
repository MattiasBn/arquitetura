# Pôr o site Algugest em produção

Duas opções de produção, ambas prontas no repositório:

| | **Render (recomendado)** | VPS com Docker |
|---|---|---|
| Ficheiro | `render.yaml` | `docker-compose.yml` + `Caddy` |
| Base de dados | Aiven (MySQL 8, na cloud) | MySQL no próprio VPS |
| Uploads | Cloudinary | `public/imagens/uploads` (disco) |
| Guia | secção "Produção no Render" mais abaixo | resto deste documento |

Em desenvolvimento local o MySQL continua a correr em Docker
(`npm run db:up`), portanto **a base de dados local nunca é preciso descartar**.

---

# Produção no Render (Aiven + Cloudinary)

## Como funciona

- A app corre num contentor Docker servido pelo Render (sem disco persistente).
- A base de dados é o serviço **Aiven (MySQL 8)**, ligado com TLS (`DB_SSL=true`
  e o certificado público em `certs/aiven-ca.pem`).
- Os uploads vão para a **Cloudinary**: o contentor do Render é descartado a
  cada deploy, por isso ficheiros em disco perder-se-iam. Sem `CLOUDINARY_URL`
  a app continua a usar o disco local (útil para desenvolver).
- `GET /api/health` devolve 200 apenas quando a base de dados responde — é o
  `healthCheckPath` do serviço.

## Passos

1. Coloca o repositório no GitHub (ou GitLab).
2. No Render: **New → Blueprint**, escolhes o repositório e o ficheiro
   `render.yaml` é detetado automaticamente.
3. Preenche os segredos pedidos (ver lista abaixo) em **Environment**.
4. O primeiro deploy arranca o build da imagem. Confirma em `/api/health`.
5. (Opcional) Em **Settings → Custom Domains**, junta `algugest.ao` — o Render
   emite o certificado SSL sozinho.

## Variáveis de ambiente no Render

```text
NEXT_PUBLIC_SITE_URL   https://algugest.ao
DB_HOST                 <host do serviço Aiven>
DB_PORT                 <porta do serviço Aiven>
DB_NAME                 <base de dados, ex. defaultdb>
DB_USER                 <utilizador, ex. avnadmin>
DB_PASSWORD             <palavra-passe do Aiven>
DB_SSL                  true
DB_SSL_CA_FILE          certs/aiven-ca.pem
CLOUDINARY_URL          cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
CLOUDINARY_FOLDER       algugest
ADMIN_SECRET            <valor aleatório longo>
```

`ADMIN_USERNAME` / `ADMIN_PASSWORD` só servem para semear o primeiro
utilizador admin. Como o admin **já foi criado** na base de dados da Aiven,
não é preciso os definir (e é melhor não os ter expostos).

## Notas importantes

- **Plano grátis do Render adormece** após ~15 min sem visitas; o primeiro
  pedido depois disso demora 30–60 s. Para um site de negócio, o plano
  `starter` (7 $/mês) evita isso.
- Os URLs da Cloudinary (`https://res.cloudinary.com/...`) são absolutos e
  permitidos em `next.config.ts` (`images.remotePatterns`), por isso
  `next/image` continua a otimizá-los.
- **Toda a media já existente (106 ficheiros, ~42 MB) foi migrada** para a
  Cloudinary e as referências no conteúdo (tabela `content`, `data/content.json`)
  e no código foram trocadas. O que está em `public/` passa a ser apenas cópia
  de segurança local — nada o referencia já no site.
- O conteúdo (textos, destaques, serviços) vive na base de dados. Se mudares de
  base de dados, exporta/importa a tabela `content`.
- Migração de media (só quando mudares de site/máquina):
  `node scripts/migrate-media.mjs` envia `public/` para a cloud e grava o mapa
  em `data/migracao-cloudinary.json`; `node scripts/rewrite-refs.mjs` troca as
  referências no código; `node scripts/rewrite-db.mjs` faz o mesmo na tabela
  `content`. Todos são idempotentes — podem correr mais do que uma vez.
- As fotografias e vídeos já existentes em `public/imagens` **continuam a ser
  servidos pelo próprio site** — a Cloudinary passa a ser usada para os novos
  uploads e para os que carregares no `/admin`.

---

# Pôr o site Algugest em produção num VPS

Guia passo-a-passo para publicar o site com **Docker + MySQL + Caddy** (HTTPS automático).

O que fica pronto com isto:
- Site em `https://<teu-dominio>` com certificado SSL automático.
- Base de dados **MySQL** para o login (`/admin`) e para o conteúdo editável.
- Uploads (`public/imagens/uploads/`) em disco persistente do VPS.
- Estatísticas de visitas na tabela MySQL `visits` (incluídas no backup da base de dados).

---

## Desenvolvimento local (no teu PC)

O MySQL corre em Docker e a app corre com `npm run dev`:

```bash
npm run db:up     # sobe o MySQL de desenvolvimento (docker-compose.dev.yml)
npm run dev       # arranca o Next.js em http://localhost:3000 e http://<ip-lan>:3000
```

Na primeira página carregada, a app cria as tabelas e semeia o admin.
Credenciais por omissão em dev: `admin` / `algugest2026`.
Para parar a base de dados: `npm run db:down`.

---

## Modo produção local (stack completa em Docker)

Corre **app + MySQL + Caddy** no teu PC, igual à produção, com HTTPS local em
`https://algugest.localhost`. Usa o ficheiro `.env.production`.

```bash
docker compose --env-file .env.production up -d --build
```

- Site: `https://algugest.localhost` (login do `/admin` = `ADMIN_USERNAME` / `ADMIN_PASSWORD` do `.env.production`).
- HTTPS local: o Caddy usa a CA interna (`CADDY_TLS=tls internal`) e `SITE_ADDRESS=algugest.localhost`.
- Parar: `docker compose --env-file .env.production down` (os dados ficam nos volumes).
- Apagar também os dados: `docker compose --env-file .env.production down -v`.

> Esta stack usa um volume MySQL próprio (`arquitetura_db_data`), **separado** do MySQL
> de desenvolvimento. No 1.º arranque importa `data/content.json` e `data/analytics.json`.

Se o browser não abrir o domínio, adiciona ao ficheiro `hosts` (PowerShell **como Administrador**):

```powershell
Add-Content "$env:WINDIR\System32\drivers\etc\hosts" "`n127.0.0.1 algugest.localhost"
```

Para confiar no certificado local (sem avisos), importa a CA do Caddy para o Windows; o
Chromium/Edge usam a loja do Windows (o Firefox tem a sua própria). Para voltar ao VPS,
basta limpar `CADDY_TLS` e pôr o domínio real em `SITE_ADDRESS`.

---

## 1. Criar o VPS

- Fornecedor sugerido: Hostinger VPS, Contabo, Hetzner ou DigitalOcean.
- Sistema: **Ubuntu 22.04/24.04**, mínimo **2 GB RAM / 1 vCPU** (recomendado 2 vCPU e 4 GB — o MySQL gosta de RAM).
- Guarda o **IP do servidor**.

Liga-te por SSH:
```bash
ssh root@<IP_DO_SERVIDOR>
```

## 2. Apontar o domínio (DNS)

No painel onde compraste o domínio, cria registos **A** a apontar para o IP do VPS:

| Tipo | Nome | Valor |
|------|------|-------|
| A | `@`  | `<IP_DO_SERVIDOR>` |
| A | `www`| `<IP_DO_SERVIDOR>` |

Espera a propagação (pode levar de minutos a algumas horas).

## 3. Instalar o Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo apt install -y docker-compose-plugin git
docker --version
docker compose version
```

## 4. Obter o código do projeto

Opção A — via Git (recomendado, se o projeto estiver no GitHub):
```bash
cd /opt
git clone <URL_DO_REPOSITORIO> algugest
cd algugest
```

Opção B — sem Git (enviar do teu PC por `scp`):
```bash
# corre no teu PC, dentro da pasta do projeto
scp -r . root@<IP_DO_SERVIDOR>:/opt/algugest
```

## 5. Configurar os segredos

```bash
cd /opt/algugest
cp .env.example .env.production
nano .env.production
```

Preenche (importante trocar todas as senhas):
```
DB_HOST=db
DB_PORT=3306
DB_NAME=algugest
DB_USER=algugest
DB_PASSWORD=<senha-forte-para-a-bd>
DB_ROOT_PASSWORD=<outra-senha-forte>

ADMIN_USERNAME=admin
ADMIN_PASSWORD=<senha-forte-do-admin>
ADMIN_SECRET=<aleatório>
NEXT_PUBLIC_SITE_URL=https://<teu-dominio>
SITE_ADDRESS=<teu-dominio>, www.<teu-dominio>
CADDY_TLS=
```

Gerar segredos aleatórios:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
> Se não tiveres Node no VPS: `openssl rand -base64 48`

> O `DB_PASSWORD`/`DB_ROOT_PASSWORD` só são usados na **primeira** criação do volume
> do MySQL. Se mudares depois, tens de alterar também dentro do MySQL (ou recriar o volume).

## 6. Domínio e HTTPS (Caddy)

O domínio e o TLS vêm do `.env.production` — já não é preciso editar o `Caddyfile`:

```
SITE_ADDRESS=<teu-dominio>, www.<teu-dominio>
CADDY_TLS=
```

Em produção deixa `CADDY_TLS` vazio: o Caddy emite o certificado Let's Encrypt sozinho
(o DNS de `<teu-dominio>` e `www` tem de apontar para o IP do VPS).

## 7. Preparar as pastas

```bash
mkdir -p data public/imagens/uploads
```
Se já tinhas conteúdo personalizado no teu PC (ficheiro `data/content.json`), envia-o —
ele é **importado automaticamente** para o MySQL no primeiro arranque:
```bash
# corre no teu PC
scp data/content.json root@<IP_DO_SERVIDOR>:/opt/algugest/data/content.json
```

## 8. Arrancar

> Todos os comandos `docker compose` precisam de `--env-file .env.production`
> (é de lá que saem as senhas da base de dados).

```bash
docker compose --env-file .env.production up -d --build
```

Ver o estado e os logs:
```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f app
docker compose --env-file .env.production logs -f db
```

Na primeira arrancada, o MySQL leva alguns segundos a ficar pronto; a app só arranca
depois de a base de dados estar saudável (`service_healthy`).

## 9. Verificar

- Abre `https://<teu-dominio>` — deve carregar com cadeado (HTTPS).
- Abre `https://<teu-dominio>/admin` e entra com `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
- Testa publicar um destaque em **Destaques → Adicionar → Publicar** e confirma na home e em `/destaques`.

## 10. Firewall e segurança

```bash
sudo apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```
- Usa uma palavra-passe de admin longa (16+ caracteres).
- O MySQL **não** está exposto à internet (só a rede interna do Docker).
- Considera desativar o login por palavra-passe SSH e usar chave SSH.

## Atualizar o site depois de alterações no código

```bash
cd /opt/algugest
git pull            # ou reenvia os ficheiros por scp
docker compose --env-file .env.production up -d --build
```

---

## Backups (importante)

Guarda a base de dados, as estatísticas e os uploads:

```bash
mkdir -p /opt/backups
cat > /opt/algugest/backup.sh <<'EOF'
#!/bin/bash
D=$(date +%F-%H%M)
cd /opt/algugest
# Base de dados
docker compose --env-file .env.production exec -T db \
  sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' \
  | gzip > /opt/backups/algugest-db-$D.sql.gz
# Uploads (as estatísticas já vão dentro do backup da base de dados)
tar czf /opt/backups/algugest-files-$D.tar.gz -C /opt/algugest public/imagens/uploads
# manter só os últimos 14 de cada
ls -1t /opt/backups/algugest-db-*.sql.gz | tail -n +15 | xargs -r rm
ls -1t /opt/backups/algugest-files-*.tar.gz | tail -n +15 | xargs -r rm
EOF
chmod +x /opt/algugest/backup.sh
crontab -e
```
Adiciona a linha (todos os dias às 03:00):
```
0 3 * * * /opt/algugest/backup.sh
```

### Restaurar a base de dados
```bash
gunzip -c /opt/backups/algugest-db-<data>.sql.gz | \
  docker compose --env-file .env.production exec -T db \
  sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

---

## Alternativa sem Docker (PM2 + Nginx + MySQL)

Se preferires não usar Docker:
```bash
sudo apt install -y nodejs npm nginx mysql-server
sudo mysql_secure_installation
# cria a base de dados e o utilizador no MySQL, e aponta DB_HOST=127.0.0.1 no .env.production
cd /opt/algugest
cp .env.example .env.production && nano .env.production
npm ci && npm run build
sudo npm i -g pm2
pm2 start npm --name algugest -- run start
pm2 save && pm2 startup
```
Depois configura o Nginx como reverse proxy para `http://127.0.0.1:3000` e emite o certificado com `certbot`.

---

## Como funcionam os dados

- **Login**: utilizadores na tabela `admin_users`, palavras-passe com hash **scrypt** (salt por utilizador).
  O primeiro admin é semeado a partir de `ADMIN_USERNAME`/`ADMIN_PASSWORD` na primeira execução.
- **Conteúdo**: tabela `content`. A chave `site` guarda as personalizações do site e
  `service:<slug>` as de cada serviço. As páginas do site são renderizadas a pedido (SSR)
  e revalidam logo após publicar no `/admin`.
- **Estatísticas**: tabela `visits`. Cada visita é uma linha (página, dispositivo,
  navegador, país/região, hora, referrer); o painel resume com agregações SQL. Os dados
  antigos de `data/analytics.json` são importados automaticamente no primeiro arranque.
- **Uploads**: imagens até **5 MB** e vídeos até **50 MB** (definido em `src/lib/media.ts`,
  validado no servidor e no painel).
- **Esquema**: criado automaticamente (`CREATE TABLE IF NOT EXISTS`) no primeiro acesso —
  não há passos manuais de migração.

---

## A seguir (para ficar ainda mais profissional)

1. **Storage de uploads**: mover `public/imagens/uploads` para um CDN (ex.: Cloudflare R2/S3).
2. **Privacidade**: banner de cookies + página de Política de Privacidade (o site regista visitas/IP).
3. **Monitorização**: Sentry (erros) + UptimeRobot (disponibilidade).
4. **SEO/social**: OpenGraph por página, JSON-LD `LocalBusiness`, Google Search Console.
5. **Performance**: comprimir/otimizar os vídeos do carrossel ou usar Cloudflare Stream.
6. **Mais utilizadores admin**: interface de gestão de utilizadores (a tabela já existe).
7. **Retenção de analytics**: apagar automaticamente visitas com mais de X meses.
