import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { router as authRouter } from './routes/auth.route.js'
import { router as prodRouter } from './routes/product.route.js'
import { router as cartRouter } from './routes/cart.route.js'
import { router as couponRouter } from './routes/coupon.route.js'
import { router as paymentRouter } from './routes/payment.route.js'
import { router as analyticsRouter } from './routes/analytics.route.js'
import { connectDB } from './lib/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/products', prodRouter)
app.use('/api/cart', cartRouter)
app.use('/api/coupons', couponRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/analytics', analyticsRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  connectDB()
})