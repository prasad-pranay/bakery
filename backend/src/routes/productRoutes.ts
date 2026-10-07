import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, deleteReviewAdmin } from '../controllers/productController';
import { authenticateUser } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';
import { uploadProductImage } from '../middleware/upload';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
// router.post('/', requireAdmin, createProduct);
// router.put('/:id', requireAdmin, updateProduct);
router.post(
    '/',
    requireAdmin,
    uploadProductImage.single("image"),
    createProduct
);
router.put(
    "/:id",
    requireAdmin,
    uploadProductImage.single("image"),
    updateProduct,
);

router.delete('/:id', requireAdmin, deleteProduct);

export default router;

router.post('/:id/reviews', authenticateUser, addReview);
router.delete('/:id/reviews/:reviewId', requireAdmin, deleteReviewAdmin);
