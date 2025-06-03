import express from 'express'
import {} from '../controllers/analytics.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()


export { router }