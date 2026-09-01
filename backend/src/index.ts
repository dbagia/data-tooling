import express from 'express'
import cors from 'cors'
import { loadCompanyTickers } from './usecases/loadCompanyTickers'
import submissionsRouter from './routes/v1/submissions'

const PORT = 4000

async function main(): Promise<void> {
  const app = express()

  app.use(cors({
    origin: 'http://localhost:5173'
  }))

  app.get('/api/hello', (_req, res) => {
    res.json({ message: 'test' })
  })

  app.use('/v1/companies', submissionsRouter)

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
