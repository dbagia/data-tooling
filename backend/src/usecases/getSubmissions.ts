import { CompanySubmissions, RawSubmissionsResponse } from '../types/submissions'
import { getCikFromTicker } from './loadCompanyTickers'
import { fetchCompanySubmissions } from '../clients/EdgarClient'
import { transformRecentFilings } from '../utils'

const CIK_LENGTH = 10

const normalizeCik = (cik: string): string => {
  return cik.padStart(CIK_LENGTH, cik)
}

const cache = new Map<string, Promise<RawSubmissionsResponse>>()

export async function getSubmissions(ticker: string): Promise<CompanySubmissions> {
  const rawCik = getCikFromTicker(ticker.toUpperCase())

  if (!rawCik) {
    throw new Error('Ticker not found')
  }

  const cik = normalizeCik(rawCik)

  let submissionsPromise = cache.get(cik)

  if (!submissionsPromise) {
    submissionsPromise = fetchCompanySubmissions(cik)
    cache.set(cik, submissionsPromise)

    // if we fail to fetch, we remove the rejected promise
    // from the cache
    submissionsPromise.catch(() => cache.delete(cik))
  }

  const raw = await submissionsPromise

  return {
    cik,
    name: raw.name,
    filings: transformRecentFilings(raw.filings.recent, cik),
  }
}
