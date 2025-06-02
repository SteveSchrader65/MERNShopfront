import { redis } from '../lib/redis.js'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const generateTokens = (userID) => {
  const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})

  return {accessToken, refreshToken}
}

const storeRefreshToken = async(userID, refreshToken) => {
  await redis.set(`refresh_token: ${userID}`, refreshToken, 'EX', 604800)
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production' || true,
		sameSite: 'strict',
		maxAge: 900000
  })

  res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production' || true,
		sameSite: 'strict',
		maxAge: 604800000,
  })
}

export const signup = async (req, res) => {
  const {name, email, password} = req.body

  try {
    const userExists = await User.findOne({email})

    if (userExists) {
      return res.status(400).json({success: false, message: 'User already exists'})
    }

    const user = await User.create({name, email, password})

    // Authenticate user
    const {accessToken, refreshToken} = generateTokens(user._id)

    await storeRefreshToken(user._id, refreshToken)
    setCookies(res, accessToken, refreshToken)

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      success: true,
      message: `User ${user.name} successfully created`
    })
  } catch(err) {
    res.status(500).json({success: false, message: `Error in Sign-up controller: ${err.message}`})
  }
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id)

      await storeRefreshToken(user._id, refreshToken)
			setCookies(res, accessToken, refreshToken)

      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        success: true,
        message: `User ${user.name} has logged-in`
      })
		} else {
			res.status(400).json({success: false, message: 'Invalid credentials'})
		}
	} catch (err) {
    res.status(500).json({success: false, message: `Error in Log-in controller: ${err.message}`})
	}
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

      await redis.del(`refresh_token: ${decoded.userID}`)
    }

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.json({success: true, message: `User ${decoded.name} has logged out`})

  } catch (err) {
    res.status(500).json({ success: false, message: `Error in Log-out controller: ${err.message}` })
  }
}

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken

		if (!refreshToken) {
			return res.status(401).json({success: false,  message: 'No refresh token provided' })
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
		const storedToken = await redis.get(`refresh_token: ${decoded.userId}`)

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: 'Invalid refresh token' })
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '15m',
		})

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 900000,
		})

		res.json({ message: 'Token refreshed successfully' })
	} catch (err) {
    res.status(500).json({ success: false, message: `Error in Refresh controller: ${err.message}` })
	}
}

export const getProfile = async (req, res) => {
	try {
		res.json(req.user)
	} catch (err) {
    res.status(500).json({ success: false, message: `Error in Profile controller: ${err.message}` })
	}
}