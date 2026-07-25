# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies (cached layer) ----
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Runtime image ----
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER node

EXPOSE 5003

CMD ["node", "src/server.js"]