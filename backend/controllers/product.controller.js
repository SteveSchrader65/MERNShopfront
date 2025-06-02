import { Product } from '../models/product.model.js'
import { redis } from '../lib/redis.js'

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json({products})
  } catch (err) {
    res.status(500).json({success: false, message: `Error retrieving all Products: ${err.message}`})
  }
}

const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get('featured_products')

    if (featuredProducts) return res.json(JSON.parse(featuredProducts))

    featuredProducts = await Product.find({isFeatured: true}).lean()

    if (!featuredProducts) return res.status(404).json({success: false, message: 'No featured products found'})

    await redis.set('featured_products', JSON.stringify(featuredProducts))
    res.json(featuredProducts)
  } catch (err) {
    res.status(500).json({success: false, message: `Error retrieving Featured Products: ${err.message}`})
  }
}

const addProduct = async (req, res) => {

}

export { getAllProducts, getFeaturedProducts, addProduct }