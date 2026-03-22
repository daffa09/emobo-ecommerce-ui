# ================================
# 1️⃣ Dapur Pembuatan (Build Stage)
# ================================
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

ARG NEXT_PUBLIC_PPN_RATE
ARG NEXT_PUBLIC_APP_FEE

ENV NEXT_PUBLIC_PPN_RATE=$NEXT_PUBLIC_PPN_RATE
ENV NEXT_PUBLIC_APP_FEE=$NEXT_PUBLIC_APP_FEE

RUN npm run build

# ================================
# 2️⃣ Meja Penyajian (Runtime Stage)
# ================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]