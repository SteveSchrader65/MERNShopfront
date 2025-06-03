import { Product } from '../models/product.model.js'

const getAllInCart = async (req, res ) => {
  try {
    const products = await Product.find({_id:{$in:req.user.cartItems}})
    const cartItems = products.map(prod => {
      const item = req.user.cartItems.find(item => item.id === prod.id)

      return {...products.toJSON(), quantity: item.quantity}
    })

    res.json(cartItems)
  } catch (err) {
    res.status(500).json({ success: false, message: `Error retrieving Items in Cart controller: ${err.message}` })
  }
}

const addToCart = async (req, res ) => {
  try {
		const { productId } = req.body
		const user = req.user
    const thisItem = user.cartItems.find(item => item.id === productId )

    if (thisItem) {
      thisItem.quantity += 1
    } else {
      user.cartItems.push(productId)
    }

    await user.save()
    res.json(user.cartItems)
  } catch (err) {
    res.status(500).json({ success: false, message: `Error adding items in Cart controller: ${err.message}` })
  }
}

const updateQuantity = async (req, res ) => {
  try {
    const {id:productId} = req.params
    const quantity = req.body
    const user = req.user
    const thisItem = user.cartItems.find((item) => item.id === productId)

    if (thisItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        await user.save()
        return res.json(user.cartItems)
      }

      thisItem.quantity = quantity
      await user.save()
      res.json(user.cartItems)
    } else {
			res.status(404).json({ success: false, message: `Product #${req.params.id} not found` })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: `Error updating Quantity in Cart controller: ${err.message}` })
  }
}

const removeFromCart = async (req, res ) => {
  try {
    const {productId} = req.body
    const user = req.user

    if (!productId) {
      user.cartItems = []
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId)
    }

    await user.save()
    res.json(user.cartItems)
  } catch (err) {
    res.status(500).json({ success: false, message: `Error removing Items in Cart controller: ${err.message}` })
  }
}

export { getAllInCart, addToCart, updateQuantity, removeFromCart }