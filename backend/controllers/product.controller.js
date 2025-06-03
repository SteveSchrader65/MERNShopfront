import { Product } from '../models/product.model.js'
import { redis } from '../lib/redis.js'
import { cloudinary } from '../lib/cloudinary.js'

const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({})
		res.json({ products })
	} catch (err) {
		res.status(500).json({
			success: false,
			message: `Error retrieving all Products: ${err.message}`,
		})
	}
}

const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get('featured_products')

		if (featuredProducts) return res.json(JSON.parse(featuredProducts))

		featuredProducts = await Product.find({ isFeatured: true }).lean()

		if (!featuredProducts)
			return res.status(404).json({ success: false, message: 'No Featured products found' })

		await redis.set('featured_products', JSON.stringify(featuredProducts))
		res.json(featuredProducts)
	} catch (err) {
		res.status(500).json({
			success: false,
			message: `Error retrieving Featured products: ${err.message}`,
		})
	}
}

const getRecommendedProducts = async (req, res) => {
	try {
		const recommended = await Product.aggregate([
			{
				$sample: { size: 3 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		])

		res.json(recommended)
	} catch (err) {
		res.status(500).json({
			success: false,
			message: `Error retrieving Recommended Products: ${err.message}`,
		})
	}
}

const getProductsByCategory = async (req, res) => {
	const { category } = req.params

	try {
		const products = await Product.find({ category })

		res.json(products)
	} catch (err) {
		res.status(500).json({
			success: false,
			message: `Error retrieving products in Category ${req.params}: ${err.message}`,
		})
	}
}

const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body

		let cloudinaryResponse = null

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' })
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
			category,
			in_stock,
		})

		res.status(201).json(product)
	} catch (err) {
		res.status(500).json({
			success: false,
			message: `Error creating new Product: ${err.message}`,
		})
	}
}

const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)

		if (product) {
			product.isFeatured = !product.isFeatured

			const updatedProduct = await product.save()

			await _updateFeaturedCache()
			res.json(updatedProduct)
		} else {
			res.status(404).json({ success: false, message: `Product #${req.params.id} not found` })
		}
	} catch (err) {
    res.status(500).json({success: false, message: `Error in Toggle Featured controller: ${err.message}`})
	}

  const _updateFeaturedCache = async () => {
    try {
      const featuredProducts = await Product.find({isFeatured: true}).lean()

      await redis.set('featured_products', JSON.stringify(featuredProducts))
    } catch (err) {
      res.status(500).json({success: false, message: `Error updating Featured products cache: ${err.message}`})
    }
  }
}

const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)

		if (!product)
			return res
				.status(404)
				.json({ success: false, message: `Product #${req.params.id} not found` })

		if (product.image) {
			const cloudinaryId = product.image.split('/').pop().split('.')[0]

			try {
				await cloudinary.uploader.destroy(`products/${cloudinaryId}`)
			} catch (err) {
				res.status(500).json({
					success: false,
					message: `Error deleting Product image: ${err.message}`,
				})
			}
		}

		await Product.findByIdAndDelete(req.params.id)
		res.status(200).json({ success: true, message: `Product #${req.params.id} deleted` })
	} catch (err) {
		res.status(500).json({
			success: false,
			message: `Error deleting Product from database: ${err.message}`,
		})
	}
}

export {
	getAllProducts,
	getFeaturedProducts,
	getRecommendedProducts,
	getProductsByCategory,
	createProduct,
	toggleFeaturedProduct,
	deleteProduct,
}