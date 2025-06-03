import express from 'express'
import { getAllInCart, addToCart, updateQuantity, removeFromCart } from '../controllers/cart.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protectedRoute, getAllInCart)
router.post('/', protectedRoute, addToCart)
router.put('/:id', protectedRoute, updateQuantity)
router.delete('/', protectedRoute, removeFromCart)

export { router }