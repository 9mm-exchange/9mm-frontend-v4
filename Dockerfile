FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY patches/ ./patches/
# Apps
COPY apps/web/package.json ./apps/web/
COPY apps/aptos/package.json ./apps/aptos/
COPY apps/blog/package.json ./apps/blog/
COPY apps/bridge/package.json ./apps/bridge/
COPY apps/games/package.json ./apps/games/
COPY apps/gamification/package.json ./apps/gamification/
COPY apps/solana/package.json ./apps/solana/
COPY apps/ton/package.json ./apps/ton/
# Packages - top level
COPY packages/achievements/package.json ./packages/achievements/
COPY packages/aptos-swap-sdk/package.json ./packages/aptos-swap-sdk/
COPY packages/blog/package.json ./packages/blog/
COPY packages/canonical-bridge/package.json ./packages/canonical-bridge/
COPY packages/chains/package.json ./packages/chains/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/farms/package.json ./packages/farms/
COPY packages/games/package.json ./packages/games/
COPY packages/gauges/package.json ./packages/gauges/
COPY packages/hooks/package.json ./packages/hooks/
COPY packages/ifos/package.json ./packages/ifos/
COPY packages/jupiter-terminal/package.json ./packages/jupiter-terminal/
COPY packages/localization/package.json ./packages/localization/
COPY packages/multicall/package.json ./packages/multicall/
COPY packages/next-config/package.json ./packages/next-config/
COPY packages/pcsx-sdk/package.json ./packages/pcsx-sdk/
COPY packages/permit2-sdk/package.json ./packages/permit2-sdk/
COPY packages/pools/package.json ./packages/pools/
COPY packages/position-managers/package.json ./packages/position-managers/
COPY packages/prediction/package.json ./packages/prediction/
COPY packages/price-api-sdk/package.json ./packages/price-api-sdk/
COPY packages/stable-swap-sdk/package.json ./packages/stable-swap-sdk/
COPY packages/swap-sdk/package.json ./packages/swap-sdk/
COPY packages/swap-sdk-core/package.json ./packages/swap-sdk-core/
COPY packages/swap-sdk-evm/package.json ./packages/swap-sdk-evm/
COPY packages/tokens/package.json ./packages/tokens/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/uikit/package.json ./packages/uikit/
COPY packages/ui-wallets/package.json ./packages/ui-wallets/
COPY packages/universal-router-sdk/package.json ./packages/universal-router-sdk/
COPY packages/utils/package.json ./packages/utils/
COPY packages/v2-sdk/package.json ./packages/v2-sdk/
COPY packages/v3-sdk/package.json ./packages/v3-sdk/
COPY packages/v4-sdk/package.json ./packages/v4-sdk/
COPY packages/widgets-internal/package.json ./packages/widgets-internal/
COPY packages/worker-utils/package.json ./packages/worker-utils/
# awgmi nested
COPY packages/awgmi/package.json ./packages/awgmi/
COPY packages/awgmi/core/package.json ./packages/awgmi/core/
COPY packages/awgmi/connectors/rise/package.json ./packages/awgmi/connectors/rise/
COPY packages/awgmi/connectors/blocto/package.json ./packages/awgmi/connectors/blocto/
COPY packages/awgmi/connectors/safePal/package.json ./packages/awgmi/connectors/safePal/
COPY packages/awgmi/connectors/martian/package.json ./packages/awgmi/connectors/martian/
COPY packages/awgmi/connectors/petra/package.json ./packages/awgmi/connectors/petra/
COPY packages/awgmi/connectors/msafe/package.json ./packages/awgmi/connectors/msafe/
COPY packages/awgmi/connectors/pontem/package.json ./packages/awgmi/connectors/pontem/
COPY packages/awgmi/connectors/fewcha/package.json ./packages/awgmi/connectors/fewcha/
# wagmi nested
COPY packages/wagmi/package.json ./packages/wagmi/
COPY packages/wagmi/connectors/trustWallet/package.json ./packages/wagmi/connectors/trustWallet/
COPY packages/wagmi/connectors/blocto/package.json ./packages/wagmi/connectors/blocto/
# routing-sdk nested
COPY packages/routing-sdk/package.json ./packages/routing-sdk/
COPY packages/routing-sdk/addons/stable-swap/package.json ./packages/routing-sdk/addons/stable-swap/
COPY packages/routing-sdk/addons/v2/package.json ./packages/routing-sdk/addons/v2/
COPY packages/routing-sdk/addons/quoter/package.json ./packages/routing-sdk/addons/quoter/
COPY packages/routing-sdk/addons/v3/package.json ./packages/routing-sdk/addons/v3/
# smart-router nested
COPY packages/smart-router/package.json ./packages/smart-router/
COPY packages/smart-router/evm/package.json ./packages/smart-router/evm/
COPY packages/smart-router/legacy-router/package.json ./packages/smart-router/legacy-router/
# token-lists nested
COPY packages/token-lists/package.json ./packages/token-lists/
COPY packages/token-lists/react/package.json ./packages/token-lists/react/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY . .

# Build-time environment variables (NEXT_PUBLIC_ vars are embedded at build time)
ARG NEXT_PUBLIC_SNAPSHOT_BASE_URL="https://hub.snapshot.org"
ARG NEXT_PUBLIC_EXPLORE_API_ENDPOINT="https://dex.9mm.pro/api"
ARG NEXT_PUBLIC_SENTRY_DSN=""

ENV NEXT_PUBLIC_SNAPSHOT_BASE_URL=$NEXT_PUBLIC_SNAPSHOT_BASE_URL \
    NEXT_PUBLIC_EXPLORE_API_ENDPOINT=$NEXT_PUBLIC_EXPLORE_API_ENDPOINT \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    SKIP_ENV_VALIDATION=1 \
    NODE_OPTIONS="--max-old-space-size=8192"

RUN pnpm turbo run build --filter=web...

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

