import { RawCompanyTickers, RawCompanyTickersSchema } from '../types/tickers'

const COMPANY_TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json'

export class SecEdgarRequestError extends Error {
  constructor(
    resource: string,
    public readonly status: number,
  ) {
    super(`SEC EDGAR request for ${resource} failed with status ${status}`)
    this.name = 'SecEdgarRequestError'
  }
}

export async function fetchCompanyTickers(): Promise<RawCompanyTickers> {
  const response = await fetch(COMPANY_TICKERS_URL)

  if (!response.ok) {
    throw new SecEdgarRequestError('company_tickers.json', response.status)
  }

  return RawCompanyTickersSchema.parse(await response.json())
}

