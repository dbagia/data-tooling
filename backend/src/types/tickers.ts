import { z } from 'zod'

export const RawCompanyTickerEntrySchema = z.object({
  cik_str: z.number(),
  ticker: z.string(),
  title: z.string(),
})
export type RawCompanyTickerEntry = z.infer<typeof RawCompanyTickerEntrySchema>

/*
 * The company_tickers.json returns the response in the following format:
 * {
 *    "0": {
 *      "cik_str": "<number>",
 *      "ticker": "<string>",
 *      "title": "<string>"
 *    },
 *    ...
 * }
* */
export const RawCompanyTickersSchema = z.record(z.string(), RawCompanyTickerEntrySchema)
export type RawCompanyTickers = z.infer<typeof RawCompanyTickersSchema>

