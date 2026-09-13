import { buildFilingUrl, transformRecentFilings } from './submissions'
import { RawRecentFilings } from '../types/submissions'

describe('buildFilingUrl', () => {
  it('builds an EDGAR index URL, stripping CIK zero-padding and accession number dashes', () => {
    expect(buildFilingUrl('0000320193', '0000320193-24-000123')).toBe(
      'https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/0000320193-24-000123-index.htm'
    )
  })
})

describe('transformRecentFilings', () => {
  it('converts columnar filings into an array of Filing objects', () => {
    const recent: RawRecentFilings = {
      accessionNumber: ['0000320193-24-000123'],
      filingDate: ['2024-01-02'],
      reportDate: ['2023-12-30'],
      acceptanceDateTime: ['2024-01-02T18:00:00.000Z'],
      act: ['34'],
      form: ['10-K'],
      fileNumber: ['001-36743'],
      filmNumber: ['24000000'],
      items: [''],
      size: [12345],
      isXBRL: [1],
      isInlineXBRL: [0],
      primaryDocument: ['aapl-20231230.htm'],
      primaryDocDescription: ['10-K'],
    }

    expect(transformRecentFilings(recent, '0000320193')).toEqual([
      {
        accessionNumber: '0000320193-24-000123',
        filingDate: '2024-01-02',
        reportDate: '2023-12-30',
        acceptanceDateTime: '2024-01-02T18:00:00.000Z',
        act: '34',
        form: '10-K',
        fileNumber: '001-36743',
        filmNumber: '24000000',
        items: '',
        size: 12345,
        isXBRL: true,
        isInlineXBRL: false,
        primaryDocument: 'aapl-20231230.htm',
        primaryDocDescription: '10-K',
        filingUrl:
          'https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/0000320193-24-000123-index.htm',
      },
    ])
  })
})
