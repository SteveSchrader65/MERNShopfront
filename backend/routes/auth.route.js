import express from 'express'
import { login, logout, signup, refreshToken, getProfile } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.post('/refresh', refreshToken)
router.get('profile', protectRoute, getProfile)

export { router }