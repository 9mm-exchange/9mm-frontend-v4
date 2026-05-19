// middleware.ts
import { withABTesting } from 'middlewares/ab-test-middleware'
import { withClientId } from 'middlewares/client-id-middleware'
import { withGeoBlock } from 'middlewares/geo-block-middleware'
import { withUserIp } from 'middlewares/ip-address-middleware'
import { withPulseExplorerApi } from 'middlewares/pulse-explorer-api-middleware'
import { stackMiddlewares } from 'middlewares/stack-middleware'
import { visitorRedirectMiddleware } from 'middlewares/visitor-rule-middleware'

export const middleware = stackMiddlewares([
  // First in the stack: short-circuit /api/cached/* requests so the UI-
  // targeted middlewares below don't run on API paths.
  withPulseExplorerApi,
  withClientId,
  withGeoBlock,
  withUserIp,
  withABTesting,
  visitorRedirectMiddleware,
])

export const config = {
  matcher: [
    '/',
    '/swap',
    '/liquidity',
    '/pools',
    '/cake-staking',
    '/gauges-voting',
    '/farms',
    '/add',
    '/ifo',
    '/remove',
    '/prediction',
    '/find',
    '/limit-orders',
    '/lottery',
    '/nfts',
    '/info/:path*',
    '/api/cached/:path*',
  ],
}
