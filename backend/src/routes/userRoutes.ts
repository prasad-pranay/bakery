import express from 'express';
import { updateProfile, changePassword, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } from '../controllers/userController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.use(authenticateUser);

router.patch('/me', updateProfile);
router.post('/change-password', changePassword);

// Addresses
router.get('/me/addresses', getAddresses);
router.post('/me/addresses', addAddress);
router.put('/me/addresses/:id', updateAddress);
router.delete('/me/addresses/:id', deleteAddress);
router.patch('/me/addresses/:id/default', setDefaultAddress);

// Payment Methods
router.get('/me/payments', getPaymentMethods);
router.post('/me/payments', addPaymentMethod);
router.put('/me/payments/:id', updatePaymentMethod);
router.delete('/me/payments/:id', deletePaymentMethod);
router.patch('/me/payments/:id/default', setDefaultPaymentMethod);

export default router;
