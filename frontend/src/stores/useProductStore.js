import axios from 'axios'
import { create } from 'zustand'
import { toast } from 'react-hot-toast'

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
		set({ loading: true })
		try {
			const res = await axios.post('/api/products', productData)
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}))
		} catch (error) {
			toast.error(error.response.data.error)
			set({ loading: false })
		}
	},

  fetchAllProducts: async () => {
		set({ loading: true })
		try {
			const response = await axios.get('/api/products')
			set({ products: response.data.products, loading: false })
		} catch (error) {
			set({ error: 'Failed to fetch products', loading: false })
			toast.error(error.response.data.error || 'Failed to fetch products')
		}
	},

  fetchProductsByCategory: async (category) => {
		set({ loading: true })
		try {
			const response = await axios.get(`/api/products/category/${category}`)
			set({ products: response.data.products, loading: false })
		} catch (error) {
			set({ error: 'Failed to fetch products', loading: false })
			toast.error(error.response.data.error || 'Failed to fetch products')
		}
	},

  deleteProduct: async (productId) => {
		set({ loading: true })
		try {
			await axios.delete(`api/products/${productId}`)
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}))
		} catch (error) {
			set({ loading: false })
			toast.error(error.response.data.error || 'Failed to delete product')
		}
	},

  toggleFeaturedProduct: async (productId) => {
		set({ loading: true })
		try {
			const response = await axios.patch(`/api/products/${productId}`)
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}))
		} catch (error) {
			set({ loading: false })
			toast.error(error.response.data.error || 'Failed to update product')
		}
	},

  fetchFeaturedProducts: async () => {
		set({ loading: true })
		try {
			const response = await axios.get('/api/products/featured')
      const products = response.data.products || response.data || []

      set({ products: Array.isArray(products) ? products: [], loading: false })
		} catch (error) {
      set({ products: [], loading: false })
			console.log('Error fetching featured products:', error)
		}
	},
}))