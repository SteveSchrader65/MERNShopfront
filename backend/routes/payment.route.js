import express from 'express'
import { createCheckoutSession, checkoutSuccess } from '../controllers/payment.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/create_checkout_session', protectedRoute, createCheckoutSession)
router.post('/checkout_success', protectedRoute, checkoutSuccess)

export { router }
