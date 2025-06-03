import express from 'express'
import {} from './backend/controllers/payment.controller.js'
import { protectedRoute } from './backend/middleware/auth.middleware.js'

const router = express.Router()


export { router }
