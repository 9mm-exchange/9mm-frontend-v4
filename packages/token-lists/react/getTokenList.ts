/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import schema from '../schema/pancakeswap.json'
import { TokenList } from '../src/types'

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 */
export async function getTokenList(listUrl: string): Promise<TokenList> {
  const urls: string[] = uriToHttp(listUrl)
  const { default: Ajv } = await import('ajv')
  const validator = new Ajv({ allErrors: true }).compile(schema)

  for (const [i, url] of urls.entries()) {
    try {
      const json = await fetchJson(url)
      if (!validator(json)) {
        // Filter individual tokens that don't match the @uniswap/token-lists
        // schema (long names, invalid chars, etc.). The list still loads with
        // the rest of the tokens. We used to console.warn the rejected ones,
        // but that produced multi-KB JSON blobs in every browser session and
        // was purely informational — the offending tokens are already
        // dropped from the in-memory list.
        json.tokens = json.tokens.filter((token: any) => validator({ ...json, tokens: [token] }))
        if (!validator(json)) {
          const errors = validator.errors
          throw new Error(`Validation failed after filtering: ${JSON.stringify(errors)}`)
        }
      }
      return json as TokenList
    } catch (error) {
      if (i === urls.length - 1) {
        throw new Error(`Failed to download list ${listUrl}`)
      }
    }
  }
  throw new Error('Unrecognized list URL protocol.')
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
  return res.json()
}
