import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.use(authenticateUser);
router.get('/', getCart);
router.post('/', addToCart);
router.patch('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
