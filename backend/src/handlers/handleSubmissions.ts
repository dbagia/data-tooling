import { Request, Response } from 'express'
import { paginate } from '../utils/pagination'
import { parsePositiveInt, parseStringParam } from '../utils/request'
import { getSubmissions } from '../usecases/getSubmissions'
import { UnknownTickerError } from '../usecases/loadCompanyTickers'
import { EdgarRequestError } from '../clients/EdgarClient'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export async function handleSubmissions(req: Request, res: Response): Promise<void> {
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

  const form = parseStringParam(req.query.form)

  try {
    const submissions = await getSubmissions(ticker)
    const filings = form
      ? submissions.filings.filter((filing) => filing.form.toLowerCase() === form.toLowerCase())
      : submissions.filings
    const paginatedFilings = paginate(filings, page, limit)

    res.status(200).send({
      cik: submissions.cik,
      name: submissions.name,
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
