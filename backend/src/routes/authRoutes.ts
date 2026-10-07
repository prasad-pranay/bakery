import express from 'express';
import { register, login, logout, getMe, adminLogin, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);
router.post('/admin/login', adminLogin);

export default router;

router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
