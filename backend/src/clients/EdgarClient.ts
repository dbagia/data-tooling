import { RawSubmissionsResponse, RawSubmissionsResponseSchema } from '../types/submissions'
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

export async function fetchCompanySubmissions(cik: string): Promise<RawSubmissionsResponse> {
  const response = await fetch(`${SUBMISSIONS_BASE_URL}/CIK${cik}.json`)

  if (!response.ok) {
    throw new EdgarRequestError(`CIK ${cik}`, response.status)
  }

  return RawSubmissionsResponseSchema.parse(await response.json())
}

