import express from 'express';
import { addToCart, getCart, removeFromCart, updateQuantity } from '../controllers/cartController.js'
import { identifyCart } from '../middleware/cartIdentity.js'

const router = express.Router()

router.get('/', identifyCart, getCart)
router.post('/add', identifyCart, addToCart)
router.put('/update', identifyCart, updateQuantity)
router.delete('/remove', identifyCart, removeFromCart)

export default router