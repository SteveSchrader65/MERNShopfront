import express from 'express'
import { protectedRoute, adminRoute } from '../middleware/auth.middleware.js'
import {
	getAllProducts,
	getFeaturedProducts,
  getRecommendedProducts,
  getProductsByCategory,
	createProduct,
  toggleFeaturedProduct,
  deleteProduct
} from '../controllers/product.controller.js'

const router = express.Router()

router.get('/', protectedRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/recommended', getRecommendedProducts)
router.get('/category/:category', getProductsByCategory)
router.post('/', protectedRoute, adminRoute, createProduct)
router.patch('/:id', protectedRoute, adminRoute, toggleFeaturedProduct)
router.delete('/:id', protectedRoute, adminRoute, deleteProduct)

export { router }