import { fetchCompanyTickers } from '../clients/EdgarClient'

export class UnknownTickerError extends Error {
  constructor(ticker: string) {
    super(`Unknown ticker "${ticker}"`)
    this.name = 'UnknownTickerError'
  }
}

export class TickersNotLoadedError extends Error {
  constructor() {
    super(`Tickers haven't been loaded. Cannot continue`)
    this.name = 'TickersNotLoaded'
  }
}

// Company tickers will be cached here
let tickerToCik: Map<string, string> = new Map()

export async function loadCompanyTickers(): Promise<void> {
  const raw = await fetchCompanyTickers()

  const map = new Map<string, string>()
  for (const { ticker, cik_str } of Object.values(raw)) {
    map.set(ticker.toUpperCase(), String(cik_str))
  }

  tickerToCik = map

  console.log('Finished loading Company Tickers')
}

export function getCikFromTicker(ticker: string): string | undefined {
  if (!tickerToCik) {
    throw new TickersNotLoadedError()
  }
  return tickerToCik.get(ticker)
}
