import { NextFetchEvent, NextResponse } from 'next/server'
import { ExtendedNextReq, MiddlewareFactory, NextMiddleware } from './types'

const EXPLORER_API_BASE = 'https://graph-dev.9mm.pro'

/**
 * Routes /api/cached/**\/(pulse|pulsechain)/** requests to graph-dev.9mm.pro
 * (explorer-api with Redis cache) instead of the local Next.js handler.
 *
 * Both slugs are caught because the frontend uses different spellings in
 * different code paths: `multiChainPaths[PULSECHAIN] = '/pulse'` (used by
 * Info/V3Info pages) and `multiChainPriceAPIPaths[PULSECHAIN] = '/pulsechain'`
 * (used by price-api). The local /api/cached/* handlers map "PULSE" via
 * multiChainId but produce subgraph queries against graph.9mm.pro, whose
 * aggregation layer drifts vs the Ponder-backed explorer-api at graph-dev
 * (see project_explorer_api_subgraph_gap memory).
 *
 * Scope: ONLY pulse/pulsechain paths. Other chains pass through to the local
 * handler without further middleware processing.
 *
 * Failure mode: graceful — on any non-2xx response from graph-dev or network
 * error/timeout, falls through to the local handler. Errors are logged to the
 * server console for observability.
 */
export const withPulseExplorerApi: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: ExtendedNextReq, event: NextFetchEvent) => {
    const { pathname, search } = request.nextUrl

    // Not an /api/cached/* path — continue normal middleware chain.
    if (!pathname.startsWith('/api/cached/')) {
      return next(request, event)
    }

    // For Pulse paths (either /pulse/ or /pulsechain/), proxy to graph-dev.
    if (/\/pulse(chain)?(\/|$)/i.test(pathname)) {
      const devPath = pathname.replace(/^\/api\//, '/')
      try {
        const upstream = await fetch(`${EXPLORER_API_BASE}${devPath}${search}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(5000),
        })
        if (upstream.ok) {
          return new NextResponse(await upstream.text(), {
            status: upstream.status,
            headers: {
              'Content-Type': upstream.headers.get('content-type') || 'application/json',
              'X-Origin': 'graph-dev',
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
          })
        }
        // Non-2xx from graph-dev — log and fall through to local handler.
        console.warn(
          `[pulse-explorer-api] graph-dev returned ${upstream.status} for ${devPath} — falling back to local handler`,
        )
      } catch (err) {
        // Network error / timeout — log and fall through to local handler.
        const msg = err instanceof Error ? err.message : String(err)
        console.warn(
          `[pulse-explorer-api] graph-dev fetch failed for ${devPath}: ${msg} — falling back to local handler`,
        )
      }
    }

    // Non-Pulse /api/cached/* (or graph-dev failure) — let Next.js route to the
    // local API handler, skipping the rest of the middleware stack. The other
    // middlewares (geo-block, AB-test, ...) target UI routes and shouldn't
    // affect API calls.
    return NextResponse.next()
  }
}
