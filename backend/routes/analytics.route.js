import express from 'express'
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js'
import { adminRoute, protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', protectedRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData()
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 604800000)
    const dailySalesData = await getDailySalesData(startDate, endDate)

    res.json({analyticsData, dailySalesData})
  } catch (err) {
    res.status(500).json({success: false, message: `Error in Analytics route: ${err.message}`})
  }
})

export { router }