import { NextFetchEvent, NextResponse } from 'next/server'
import { ExtendedNextReq, MiddlewareFactory, NextMiddleware } from './types'

const EXPLORER_API_BASE = 'https://graph-dev.9mm.pro'

/**
 * Routes /api/cached/**\/pulsechain/** requests to graph-dev.9mm.pro
 * (explorer-api with Redis cache) instead of the local Next.js handler.
 *
 * The local /api/cached/* handlers call `multiChainId[chainName.toUpperCase()]`
 * which maps "PULSE" → ChainId.PULSECHAIN, but the frontend URL contains
 * "pulsechain" — which is not a key in that map, so requests get a 400
 * "Unsupported chain: pulsechain". graph-dev accepts "pulsechain" directly
 * and serves the same response shape via explorer-api over ponder-pulse.
 *
 * Scope: ONLY pulsechain paths. Other chains pass through to the local
 * handler without further middleware processing.
 *
 * Failure mode: graceful — on graph-dev 5xx or network error, falls through
 * to the local handler.
 */
export const withPulseExplorerApi: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, event: NextFetchEvent) => {
    const { pathname, search } = request.nextUrl

    // Not an /api/cached/* path — continue normal middleware chain.
    if (!pathname.startsWith('/api/cached/')) {
      return next(request, event)
    }

    // For Pulse paths, proxy to graph-dev.
    if (/\/pulsechain(\/|$)/i.test(pathname)) {
      const devPath = pathname.replace(/^\/api\//, '/')
      try {
        const upstream = await fetch(`${EXPLORER_API_BASE}${devPath}${search}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(15000),
        })
        if (upstream.ok || upstream.status < 500) {
          return new NextResponse(await upstream.text(), {
            status: upstream.status,
            headers: {
              'Content-Type': upstream.headers.get('content-type') || 'application/json',
              'X-Origin': 'graph-dev',
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
          })
        }
      } catch {
        // graph-dev unreachable — fall through to local handler.
      }
    }

    // Non-Pulse /api/cached/* (or graph-dev failure) — let Next.js route to the
    // local API handler, skipping the rest of the middleware stack. The other
    // middlewares (geo-block, AB-test, ...) target UI routes and shouldn't
    // affect API calls.
    return NextResponse.next()
  }
}
