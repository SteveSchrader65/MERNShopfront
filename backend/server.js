import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { router as authRouter } from './routes/auth.route.js'
import { router as prodRouter } from './routes/product.route.js'
import { connectDB } from './lib/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/products', prodRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  connectDB()
})