import { Filing, RawRecentFilings } from './types/submissions'

const EDGAR_ARCHIVES_BASE_URL = 'https://www.sec.gov/Archives/edgar/data'

/** Builds a link to a filing's index page on SEC EDGAR. `cik` may be zero-padded. */
export function buildFilingUrl(cik: string, accessionNumber: string): string {
  const cikWithoutPadding = String(Number(cik))
  const accessionNumberWithoutDashes = accessionNumber.replace(/-/g, '')
  return `${EDGAR_ARCHIVES_BASE_URL}/${cikWithoutPadding}/${accessionNumberWithoutDashes}/${accessionNumber}-index.htm`
}

export function transformRecentFilings(recent: RawRecentFilings, cik: string): Filing[] {
  const count = recent.accessionNumber.length

  const filings: Filing[] = []
  for (let i = 0; i < count; i++) {
    filings.push({
      accessionNumber: recent.accessionNumber[i],
      filingDate: recent.filingDate[i],
      reportDate: recent.reportDate[i],
      acceptanceDateTime: recent.acceptanceDateTime[i],
      act: recent.act[i],
      form: recent.form[i],
      fileNumber: recent.fileNumber[i],
      filmNumber: recent.filmNumber[i],
      items: recent.items[i],
      size: recent.size[i],
      isXBRL: recent.isXBRL[i] === 1,
      isInlineXBRL: recent.isInlineXBRL[i] === 1,
      primaryDocument: recent.primaryDocument[i],
      primaryDocDescription: recent.primaryDocDescription[i],
      filingUrl: buildFilingUrl(cik, recent.accessionNumber[i]),
    })
  }
  return filings
}
