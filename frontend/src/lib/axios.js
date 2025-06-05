import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT

const axiosInstance = axios.create({
  baseURL: import.meta.env.mode === 'development' ? `http://localhost:${PORT}/api` : '/api',
  withCredentials: true,
})

export { axiosInstance }