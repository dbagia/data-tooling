import express from 'express'
import { loadCompanyTickers } from './usecases/loadCompanyTickers'

const PORT = 4000

async function main(): Promise<void> {
  const app = express()

  app.get('/api/hello', (_req, res) => {
    res.json({ message: 'test' })
  })

  // Load company tickers on startup. These will be locally cached.
  // For the scope of this assignment, we assume that this data is static
  await loadCompanyTickers()

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
  })
}

main().catch((error) => {
  console.error('Failed to start backend', error)
  process.exit(1)
})
