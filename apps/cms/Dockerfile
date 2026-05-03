# Le contexte de build = racine du monorepo (configuré dans railway.json)
FROM node:20-alpine AS builder
WORKDIR /app
# Copier racine monorepo en premier (requis pour npm workspaces)
COPY package*.json ./
COPY apps/cms/package*.json ./apps/cms/
RUN npm ci --workspace=apps/cms --ignore-scripts
COPY apps/cms/ ./apps/cms/
# Variables nécessaires au build Next.js
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
RUN npm run build --workspace=apps/cms

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/cms/.next ./.next
COPY --from=builder /app/apps/cms/public ./public 2>/dev/null || true
COPY --from=builder /app/apps/cms/package*.json ./
COPY --from=builder /app/apps/cms/next.config.js ./
RUN npm ci --production --ignore-scripts
EXPOSE 3001
CMD ["npm", "run", "start"]
