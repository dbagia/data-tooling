import { RawSubmissionsResponse, RawSubmissionsResponseSchema, RawRecentFilingsSchema} from '../types/submissions'
import { RawCompanyTickers, RawCompanyTickersSchema } from '../types/tickers'

const COMPANY_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'
const SUBMISSIONS_BASE_URL = 'https://data.sec.gov/submissions'

export class EdgarRequestError extends Error {
  constructor(
    resource: string,
    public readonly status: number,
  ) {
    super(`SEC EDGAR request for ${resource} failed with status ${status}`)
    this.name = 'EdgarRequestError'
  }
}

export async function fetchCompanyTickers(): Promise<RawCompanyTickers> {
  const response = await fetch(COMPANY_TICKERS_URL)

  if (!response.ok) {
    throw new EdgarRequestError('company_tickers.json', response.status)
  }

  return RawCompanyTickersSchema.parse(await response.json())
}

/**
 * Merges two "columnar" records — each key mapped to a same-shaped array, as SEC EDGAR
 * returns filings — by concatenating the arrays at every key. Generic over `T` so each
 * key's value type stays correlated between `base` and `extra` as it's looked up; indexing
 * with `keyof` on a concrete (non-generic) type instead widens every lookup to the union of
 * all columns' types, which is what broke the original for..in loop.
 */
function mergeColumnarRecords<T extends Record<string, unknown[]>>(base: T, extra: T): T {
  const merged = { ...base }

  for (const key of Object.keys(base) as (keyof T)[]) {
    merged[key] = [...base[key], ...extra[key]] as T[keyof T]
  }

  return merged
}

export async function fetchCompanySubmissions(cik: string): Promise<RawSubmissionsResponse> {
  const url = `${SUBMISSIONS_BASE_URL}/CIK${cik}.json`
  console.log({ url })

  const response = await fetch(url)

  if (!response.ok) {
    throw new EdgarRequestError(`CIK ${cik}`, response.status)
  }

  const rawResult = RawSubmissionsResponseSchema.parse(await response.json())

  const hasMoreResults = rawResult.filings.files && Array.isArray(rawResult.filings.files) && rawResult.filings.files.length > 0

  if(hasMoreResults) {
    const promises = rawResult.filings.files.map((file) => {
      const fileName = file.name
      return fetch(`${SUBMISSIONS_BASE_URL}/${fileName}`)
    })

    const responses = await Promise.all(promises)

    for(const response of responses) {
      if (!response.ok) {
        throw new EdgarRequestError(`CIK ${cik}`, response.status)
      }

      const extraResult = RawRecentFilingsSchema.parse(await response.json())

      rawResult.filings.recent = mergeColumnarRecords(rawResult.filings.recent, extraResult)
    }
  }

  return rawResult
}

