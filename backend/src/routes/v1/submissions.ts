import express from 'express'
import { handleSubmissions } from '../../handlers/handleSubmissions'
import { handleSubmissionsWithoutTransform } from '../../handlers/handleSubmissionsWithoutTransform'

const router = express.Router()
router.get('/:ticker/filings', handleSubmissions)
router.get('/:ticker/filings/c', handleSubmissionsWithoutTransform)

export default router
