import express from 'express'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'
import { getAllProducts, getFeaturedProducts, addProduct } from '../controllers/product.controller.js'

const router = express.Router()

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.post('/', protectRoute, adminRoute, addProduct)

export { router }