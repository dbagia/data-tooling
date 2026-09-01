import { z } from 'zod'

export const RawRecentFilingsSchema = z.object({
  accessionNumber: z.array(z.string()),
  filingDate: z.array(z.string()),
  reportDate: z.array(z.string()),
  acceptanceDateTime: z.array(z.string()),
  act: z.array(z.string()),
  form: z.array(z.string()),
  fileNumber: z.array(z.string()),
  filmNumber: z.array(z.string()),
  items: z.array(z.string()),
  size: z.array(z.number()),
  isXBRL: z.array(z.number()),
  isInlineXBRL: z.array(z.number()),
  primaryDocument: z.array(z.string()),
  primaryDocDescription: z.array(z.string()),
})
export type RawRecentFilings = z.infer<typeof RawRecentFilingsSchema>

export const RawSubmissionsResponseSchema = z
  .object({
    cik: z.string(),
    name: z.string(),
    filings: z.object({
      recent: RawRecentFilingsSchema,
      files: z.array(
        z.object({
          name: z.string(),
          filingCount: z.number(),
          filingFrom: z.string(),
          filingTo: z.string(),
        }),
      ),
    }),
  })

export type RawSubmissionsResponse = z.infer<typeof RawSubmissionsResponseSchema>

/** One filing, transformed from the columnar `RawRecentFilings` into a plain object. */
export const FilingSchema = z.object({
  accessionNumber: z.string(),
  filingDate: z.string(),
  reportDate: z.string(),
  acceptanceDateTime: z.string(),
  act: z.string(),
  form: z.string(),
  fileNumber: z.string(),
  filmNumber: z.string(),
  items: z.string(),
  size: z.number(),
  isXBRL: z.boolean(),
  isInlineXBRL: z.boolean(),
  primaryDocument: z.string(),
  primaryDocDescription: z.string(),
  /** Link to the filing's index page on SEC EDGAR. */
  filingUrl: z.string(),
})
export type Filing = z.infer<typeof FilingSchema>

export const CompanySubmissionsSchema = z.object({
  cik: z.string(),
  name: z.string(),
  filings: z.array(FilingSchema),
})
export type CompanySubmissions = z.infer<typeof CompanySubmissionsSchema>

export interface PaginatedResult<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
