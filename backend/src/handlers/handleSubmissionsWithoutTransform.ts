import { Request, Response } from 'express'
import { parsePositiveInt, parseStringParam } from 'shared/utils'
import { paginate } from '../utils/pagination'
import { getSubmissionsWithoutTransform, filterByForm } from '../usecases/getSubmissionsWithoutTransform'
import { UnknownTickerError } from '../usecases/loadCompanyTickers'
import { EdgarRequestError } from '../clients/EdgarClient'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export async function handleSubmissionsWithoutTransform(req: Request, res: Response): Promise<void> {
  // Express 5 types route params as `string | string[]` to account for
  // repeated wildcard segments; our `:ticker` segment is always a single value.
  const tickerParam = req.params.ticker
  const ticker = Array.isArray(tickerParam) ? tickerParam[0] : tickerParam

  const page = parsePositiveInt(req.query.page, DEFAULT_PAGE)
  const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT)
  if (page === undefined || limit === undefined) {
    res.status(400).send({ message: 'page and limit must be positive integers' })
    return
  }

  const formFilterQuery = parseStringParam(req.query.form)

  try {
    const columnarSubmissions = await getSubmissionsWithoutTransform(ticker)
      const { accessionNumber, filingDate, reportDate, act, form, fileNumber } = columnarSubmissions.filings
    const filings: Record<string, unknown[]> = {
      accessionNumber: [],
      filingDate: [],
      reportDate: [],
      act: [],
      form: [],
      fileNumber: [],
    }

    if(formFilterQuery) {
      const indices = filterByForm(formFilterQuery, columnarSubmissions.filings.form)
      for(const idx of indices) {
        filings.accessionNumber.push(accessionNumber[idx])
        filings.filingDate.push(filingDate[idx])
        filings.reportDate.push(reportDate[idx])
        filings.act.push(act[idx])
        filings.form.push(form[idx])
        filings.fileNumber.push(fileNumber[idx])
      }
    } else {
      filings.accessionNumber = accessionNumber
      filings.filingDate = filingDate
      filings.reportDate = reportDate
      filings.act = act
      filings.form = form
      filings.fileNumber = fileNumber
    }

    //TODO: Implement pagination for columnar results
    const paginatedFilings = paginate(filings.accessionNumber, page, limit)

    res.status(200).send({
      cik: columnarSubmissions.cik,
      name: columnarSubmissions.name,
      ...paginatedFilings,
    })
  } catch (error) {
    if (error instanceof UnknownTickerError) {
      res.status(404).send({ message: error.message })
      return
    }
    if (error instanceof EdgarRequestError) {
      res.status(404).send({ message: error.message })
      return
    }
    console.error('Failed to fetch submissions', { ticker, error })
    res.status(502).send({ message: 'Failed to fetch submissions from SEC EDGAR' })
  }
}
