import { Coupon } from '../models/coupon.model.js'

const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({userId: req.user._id, isActive: true })

    res.json(coupon || null)
  } catch (err) {
    res.status(500).json({success: false, message: `Error retrieving coupon in Coupon controller: ${err.message}`})
  }
}

const validateCoupon = async () => {
  try {
    const {code} = req.body
    const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive: true})

    if (!coupon) return res.status(404).json({success: false, message: 'Coupon not found'})

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false
      await coupon.save()

      return res.status(404).json({ success: false, message: 'Coupon has expired' })
    }

    res.status(200).json({success: true, message: 'Coupon applied', code: coupon.code, discountPercentage: coupon.discountPercentage})
  } catch (err) {
    res.status(500).json({success: false, message: `Error validating coupon in Coupon controller: ${err.message}`})
  }
}

export { getCoupon, validateCoupon }