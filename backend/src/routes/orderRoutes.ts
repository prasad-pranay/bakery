import express from 'express';
import { createOrder, getUserOrders, getOrderById, cancelOrder, updateOrderStatusAdmin, adminCancelOrder } from '../controllers/orderController';
import { requireAdmin } from '../middleware/auth';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.use(authenticateUser);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);


export default router;

router.post('/:id/cancel', cancelOrder);
router.post('/admin/:id/cancel', requireAdmin, adminCancelOrder);
// Admin route inside order routes for simplicity, or could go to adminRoutes
router.patch('/:id/status', requireAdmin, updateOrderStatusAdmin);
