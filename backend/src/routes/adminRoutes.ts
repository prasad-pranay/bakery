import express from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

router.use(requireAdmin);
router.get('/dashboard', getDashboardStats);

export default router;
