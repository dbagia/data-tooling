# Data Tooling

A full-stack app for browsing a public company's SEC EDGAR filings by ticker symbol. The backend
proxies and aggregates data from [SEC EDGAR](https://www.sec.gov/edgar/sec-api-documentation)
(company tickers + submissions history), exposing a paginated, filterable REST API. The frontend
is a React UI for looking up a ticker and browsing its filings.

## Project structure

This is an npm workspaces monorepo:

```
backend/    Express + TypeScript API
frontend/   React + Vite + TypeScript UI
shared/     Code shared between backend and frontend (types, parsing utils)
```

`shared` is built to `shared/dist` and consumed by the other workspaces via the `shared/*` path
alias, so it must be built before `backend` or `frontend` (this is handled automatically by the
`prebuild`/`predev` scripts).

## Prerequisites

- Node.js (v20+ recommended)
- npm

## Getting started

Install dependencies for all workspaces from the repo root:

```bash
npm install
```

Run both the backend and frontend in dev mode concurrently:

```bash
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173

Or run a single workspace:

```bash
npm run dev --workspace=backend
npm run dev --workspace=frontend
```

## Building

```bash
npm run build
```

Builds every workspace (`shared` first, since `backend`/`frontend` depend on its output).

## Testing, linting & formatting

Backend:

```bash
npm run test --workspace=backend      # Jest
npm run lint --workspace=backend      # ESLint
npm run format --workspace=backend    # Prettier
```

Frontend:

```bash
npm run lint --workspace=frontend
npm run format --workspace=frontend
```

## API

### `GET /v1/companies/:ticker/filings`

Returns a company's recent SEC filings for the given ticker symbol, with pagination and
optional filtering by form type.

**Path params**

| Param    | Description                              |
| -------- | ----------------------------------------- |
| `ticker` | Company ticker symbol (case-insensitive)  |

**Query params**

| Param   | Default | Description                                      |
| ------- | ------- | ------------------------------------------------- |
| `page`  | `1`     | Page number (positive integer)                    |
| `limit` | `20`    | Results per page (positive integer, max `100`)    |
| `form`  | -       | Filter results to a specific form type (e.g. `10-K`), case-insensitive |

**Example**

```bash
curl "http://localhost:4000/v1/companies/AAPL/filings?page=1&limit=10&form=10-K"
```

```json
{
  "cik": "0000320193",
  "name": "Apple Inc.",
  "data": [
    {
      "accessionNumber": "...",
      "filingDate": "...",
      "form": "10-K",
      "filingUrl": "...",
      "...": "..."
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5
}
```

**Errors**

| Status | When                                    |
| ------ | ---------------------------------------- |
| `400`  | `page` or `limit` is not a positive integer |
| `404`  | Ticker is not a known SEC-registered ticker |
| `5xx`  | Upstream SEC EDGAR request failed, or an unexpected server error |

On startup, the backend loads and caches the full list of SEC company tickers
(`company_tickers.json`) in memory; per-company filings are fetched from SEC EDGAR on demand and
cached in memory thereafter.

## Notes

- The frontend dev server expects the backend at `http://localhost:4000` and is the only allowed
  CORS origin (`http://localhost:5173`) in local development.
- `shared/utils.ts` and `shared/types.ts` hold logic and Zod schemas used by both the backend
  (request parsing, EDGAR response validation) and, where applicable, the frontend.
