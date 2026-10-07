import express from 'express';
import { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/validate', validateCoupon); // Public or authenticated user can validate

router.get('/', requireAdmin, getCoupons);
router.post('/', requireAdmin, createCoupon);
router.put('/:id', requireAdmin, updateCoupon);
router.delete('/:id', requireAdmin, deleteCoupon);

export default router;
