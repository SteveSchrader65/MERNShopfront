import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be minimum 6 characters']
  },
  cartItems: [{
    quantity: {
      type: Number,
      default: 1
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  }],
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next (err)
  }
})

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export { User }