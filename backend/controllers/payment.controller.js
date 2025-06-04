import { Coupon } from '../models/coupon.model.js'
import { Order } from '../models/order.model.js'
import { stripe } from '../lib/stripe.js'
import dotenv  from 'dotenv'

dotenv.config()

const createCheckoutSession = async (req, res) => {
  try {
    const {products, couponCode} = req.body

    if (!Array.isArray(products) || products.length === 0) return res.status(400).json({success: false, error: 'Invalid or empty products array'})

    let totalAmount = 0

    const lineItems = products.map(prod => {
      const amount = Math.round(prod.price * 100) // Stripe requires payment amount in cents

      totalAmount += amount * products.quantity

      return {
        price_data: {
          currency: 'aud',
          product_data: {
            name: prod.name,
            images: [prod.image]
          },
          unit_amount: amount
        }
      }
    })

    let coupon = null

    if (couponCode) {
      coupon = await Coupon.findOne({code: couponCode, userId: req.user_id, isActive: true})

      if (coupon) totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100)
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon ? [{coupon: await _createStripeCoupon(coupon.discountPercentage)}] : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || '',
        products: JSON.stringify(
          products.map((prod) => ({
            id: prod._id,
            quantity: prod.quantity,
            price: prod.price
          }))
        )
      }
    })

    if (totalAmount > 20000) await _createNewCoupon(req.user._id)

    res.status(200).json({id: stripeSession.id, totalAmount: totalAmount / 100})
  } catch (err) {
    res.status(500).json({success: false, message: `Error creating Stripe session: ${err.message}`})
  }

  const _createStripeCoupon = async discountPercentage => {
		const coupon = await stripe.coupons.create({
			percent_off: discountPercentage,
			duration: 'once',
		})

		return coupon.id
  }

  const _createNewCoupon = async userId => {
		const newCoupon = new Coupon({
			code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
			discountPercentage: 10,
			expirationDate: new Date(Date.now() + 2592000000), // 30 days from now
			userId: userId,
		})

		await newCoupon.save()

		return newCoupon
  }
}

const checkoutSuccess = async (req, res) => {
  try {
    const {sessionId} = req.body
    const stripeSession = await stripe.checkout.session.retrieve(sessionId)

    if (stripeSession.payment_status === 'paid') {
      if (stripeSession.metadata.couponCode) {
        await Coupon.findOneAndUpdate({
          code: stripeSession.metadata.couponCode,
          userId: stripeSession.metadata.userId
        }, {
          isActive: false
        })
      }

      const products = JSON.parse(stripeSession.metadata.products)

      const newOrder = new Order({
        user: stripeSession.metadata.userId,
        products: products.map(prod => ({
          product: prod.id,
          quantity: prod.quantity,
          price: prod.price
        })),
        totalAmount: stripeSession.amount_total / 100,
        stripeSessionId: sessionId
      })

      await newOrder.save()
      res.status(200).json({success: true, message: 'Payment successful', orderId: newOrder._id})

    }
  } catch (err) {
    res.status(500).json({success: false, message: `Error processing Stripe payment: ${err.message}`})
  }
}

export { createCheckoutSession, checkoutSuccess }