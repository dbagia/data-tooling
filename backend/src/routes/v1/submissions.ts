import express from 'express'
import { handleSubmissions } from '../../handlers/handleSubmissions'

const router = express.Router()
router.get('/:ticker/filings', handleSubmissions)

export default router
