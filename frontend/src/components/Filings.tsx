import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { type PaginatedResult, type Filing } from 'shared/types'
import { parsePositiveInt, parseStringParam } from 'shared/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from './ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'
import { getVisiblePageRange } from '../lib/utils'
import { FilingsForm } from './FilingsForm'
import { FormFilter } from './FormFilter'

const PAGINATION_WINDOW_SIZE = 6

type FilingsState =
  | { kind: 'empty' }
  | { kind: 'loading'; searchTerm: string }
  | { kind: 'error'; reason: string }
  | { kind: 'success'; data: { totalPages: number; filings: Filing[] } }

export function Filings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filingsState, setFilingsState] = useState<FilingsState>({ kind: 'empty' })

  const ticker = searchParams.get('ticker')
  const page = parsePositiveInt(searchParams.get('page'), 1)
  const form = parseStringParam(searchParams.get('form'))

  useEffect(() => {
    const fetchFilings = async () => {

      setFilingsState({
        kind: 'loading',
        searchTerm: ticker as string
      })

      const response = await fetch(
        `http://localhost:4000/v1/companies/${ticker}/filings?page=${page}&form=${form}`
      )
      if (!response.ok) {
        setFilingsState({
          kind: 'error',
          reason: 'Failed to fetch',
        })
        console.error(`The response for ticker ${ticker} was not ok`, response.statusText)
        return
      }

      const result = (await response.json()) as PaginatedResult<Filing>
      const { data, totalPages } = result

      setFilingsState({
        kind: 'success',
        data: {
          totalPages,
          filings: data,
        },
      })
    }

    ticker && fetchFilings()
  }, [page, ticker, form])

  const handleTickerChange = (newTicker: string) => {
    setSearchParams({ ticker: newTicker, page: '1', form: form || "" })
  }

  const handlePageChange = (page: string) => {
    if (typeof ticker === 'string') {
      setSearchParams({ ticker: ticker, page, form: form || "" })
    }
  }

  const handleFilterChange = (form: string) => {
    if (typeof ticker === 'string') {
      setSearchParams({ ticker: ticker, page: '1', form })
    }
  }

  const renderFilings = () => {
    switch (filingsState.kind) {
      case 'success': {
        const { filings } = filingsState.data
        return (
          <Table>
            <TableCaption>Most recent filings for {ticker}</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-300">
                <TableHead>Accession Number</TableHead>
                <TableHead>Filing Date</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead>Act</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>File Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filings.map((filing) => (
                <TableRow key={filing.accessionNumber}>
                  <TableCell className="underline decoration-sky-500 decoration-2"><a href={filing.filingUrl} target="_blank">{filing.accessionNumber}</a></TableCell>
                  <TableCell>{filing.filingDate}</TableCell>
                  <TableCell>{filing.reportDate}</TableCell>
                  <TableCell>{filing.act}</TableCell>
                  <TableCell>{filing.form}</TableCell>
                  <TableCell>{filing.fileNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }
      case 'empty': {
        return <div>empty</div>
      }
      case 'loading': {
        return <div>loading...</div>
      }
      case 'error': {
        return <div>error</div>
      }
    }
  }

  const renderPagination = () => {
    switch (filingsState.kind) {
      case 'empty':
      case 'loading':
      case 'error':
        return <div></div>
      case 'success': {
        const { totalPages } = filingsState.data
        const { start, end } = getVisiblePageRange(page ?? 1, totalPages, PAGINATION_WINDOW_SIZE)
        return (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    const pageNum = page ? Math.max(1, page - 1) : 1
                    handlePageChange(`${pageNum}`)
                  }}
                />
              </PaginationItem>
              {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((pageNum) => {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === page}
                      onClick={() => handlePageChange(`${pageNum}`)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    const pageNum = page ? Math.min(totalPages, page + 1) : 1
                    handlePageChange(`${pageNum}`)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )
      }
    }
  }

  return (
    <>
      <FilingsForm ticker={ticker ?? ''} onTickerChange={handleTickerChange} />
      <FormFilter formFilter={form} onFilterChange={handleFilterChange}/>
      <div className="border-1 rounded-md py-3 mb-3 w-3xl">{renderFilings()}</div>
      {renderPagination()}
    </>
  )
}
