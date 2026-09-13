import { SubmissionsReturn, RawRecentFilings } from '../types/submissions'
import { getCikFromTicker, UnknownTickerError } from './loadCompanyTickers'
import { fetchCompanySubmissions } from '../clients/EdgarClient'

const CIK_LENGTH = 10

const normalizeCik = (cik: string): string => {
  return cik.padStart(CIK_LENGTH, '0')
}

const cache = new Map<string, Promise<SubmissionsReturn>>()

export const fieldIndexMaps: Partial<Record<keyof RawRecentFilings, Map<string, number[]>>> = {
  form: new Map<string, number[]>()
}

export const filterByForm = (filterQuery: string, formArr: string[]) => {
  const indices = formArr.map((val, idx) => {
    if(val === filterQuery) {
      return idx
    }
    return -1
  }).filter((idx) => idx !== -1)

  return indices
}

export async function getSubmissionsWithoutTransform(ticker: string): Promise<SubmissionsReturn> {
  const rawCik = getCikFromTicker(ticker.toUpperCase())

  if (!rawCik) {
    throw new UnknownTickerError('Ticker not found')
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
    filings: raw.filings
  }
}
