# Le contexte de build = racine du monorepo (configuré dans railway.json)
FROM node:20-alpine AS builder
WORKDIR /app
# Copier racine du monorepo (requis pour npm workspaces + package-lock.json)
COPY package*.json package-lock.json* ./
COPY apps/cms/package*.json ./apps/cms/
RUN npm ci --workspace=apps/cms --ignore-scripts
COPY apps/cms/ ./apps/cms/
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
RUN npm run build --workspace=apps/cms

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copier le monorepo complet pour npm ci (le lock est à la racine)
COPY --from=builder /app/package*.json /app/package-lock.json* ./
COPY --from=builder /app/apps/cms/package*.json ./apps/cms/
# Installer uniquement les dépendances de prod
RUN npm ci --workspace=apps/cms --omit=dev --ignore-scripts
# Copier les artefacts de build
COPY --from=builder /app/apps/cms/.next ./apps/cms/.next
COPY --from=builder /app/apps/cms/public* ./apps/cms/public/
COPY --from=builder /app/apps/cms/next.config.js ./apps/cms/
WORKDIR /app/apps/cms
EXPOSE 3001
CMD ["npm", "run", "start"]
