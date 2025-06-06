import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import axios from 'axios'

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true })

		if (password !== confirmPassword) {
			set({ loading: false })

      return toast.error('Passwords do not match')
		}

		try {
			const res = await axios.post('api/auth/signup', { name, email, password })

      set({ user: res.data, loading: false })
		} catch (error) {
			set({ loading: false })
			toast.error(error.response.data.message || 'Could not connect to /signup')
		}
	},

	login: async (email, password) => {
		set({ loading: true })

		try {
			const res = await axios.post('api/auth/login', { email, password })

			set({ user: res.data, loading: false })
		} catch (error) {
			set({ loading: false })
			toast.error(error.response.data.message || 'Could not connect to /login')
		}
	},

	logout: async () => {
		try {
			await axios.get('api/auth/logout')
			set({ user: null })
		} catch (error) {
			toast.error(error.response?.data?.message || 'Error in Logout route')
		}
	},

  checkAuth: async () => {
      set({ checkingAuth: true })
      try {
          const response = await axios.get('api/auth/profile')

          if (typeof response.data === 'string' || !response.data || response.data.includes('<!doctype')) {
              console.log('checkAuth: received HTML instead of user data')
              set({ checkingAuth: false, user: null })
              return
          }

          console.log('checkAuth success:', response.data)
          set({ user: response.data, checkingAuth: false })
      } catch (error) {
          console.log('checkAuth failed:', error.response?.status, error.message)
          set({ checkingAuth: false, user: null })
      }
  },

	refreshToken: async () => {
		if (get().checkingAuth) return

		set({ checkingAuth: true })
		try {
			const response = await axios.post('api/auth/refresh-token')

      set({ checkingAuth: false })

      return response.data
		} catch (error) {
			set({ user: null, checkingAuth: false })
			throw error
		}
	},
}))

let refreshPromise = null

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			try {
				if (refreshPromise) {
					await refreshPromise

          return axios(originalRequest)
				}

				refreshPromise = useUserStore.getState().refreshToken()
				await refreshPromise
				refreshPromise = null

				return axios(originalRequest)
			} catch (refreshError) {
				useUserStore.getState().logout()

        return Promise.reject(refreshError)
			}
		}

    return Promise.reject(error)
	}
)