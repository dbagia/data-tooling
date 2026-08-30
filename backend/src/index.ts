import express from 'express'

const app = express()
const PORT = 4000

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'test' })
})

app.use(express.json())

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
