# Le contexte de build = racine du monorepo (configuré dans railway.json)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json package-lock.json* ./
COPY apps/cms/package*.json ./apps/cms/
RUN npm ci --workspace=apps/cms --ignore-scripts
COPY apps/cms/ ./apps/cms/
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
# Pousser le schéma DB avant le build (crée les tables si elles n'existent pas)
RUN if [ -n "$DATABASE_URI" ]; then cd apps/cms && npx payload db:push --no-prompt 2>/dev/null || echo "db:push skipped"; fi
# Générer importmap
RUN cd apps/cms && npx payload generate:importmap 2>/dev/null || true
# Build Next.js
RUN npm run build --workspace=apps/cms

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json /app/package-lock.json* ./
COPY --from=builder /app/apps/cms/package*.json ./apps/cms/
RUN npm ci --workspace=apps/cms --omit=dev --ignore-scripts
COPY --from=builder /app/apps/cms/.next ./apps/cms/.next
COPY --from=builder /app/apps/cms/public* ./apps/cms/public/
COPY --from=builder /app/apps/cms/next.config.js ./apps/cms/
WORKDIR /app/apps/cms
EXPOSE 3001
CMD ["npm", "run", "start"]
# Build Sun May  3 11:19:37 CEST 2026
