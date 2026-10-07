import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin only
export const createProduct = async (req: Request, res: Response) => {
  try {
    const updates = {
      ...req.body,
    };

    // If a new image was uploaded
    if (req.file) {
      updates.image = req.file.filename;
    }

    const product = await Product.create(updates);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product data', error });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const updates = {
      ...req.body,
    };

    // If a new image was uploaded
    if (req.file) {
      updates.image = req.file.filename;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid product data",
    });
  }
};
// export const updateProduct = async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!product) {
//       return res.status(404).json({ success: false, message: 'Product not found' });
//     }
//     res.json({ success: true, data: product });
//   } catch (error) {
//     res.status(400).json({ success: false, message: 'Invalid product data' });
//   }
// };

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addReview = async (req: any, res: Response) => {
  try {
    const { rating, text } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Check if user already reviewed (optional but requested)
    // const alreadyReviewed = product.reviews.find(r => r.userId?.toString() === req.user._id.toString());
    // if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You already reviewed this product' });

    const review = {
      id: Date.now(),
      name: req.user.name,
      rating: Number(rating),
      text: text,
      date: new Date().toISOString(),
      userId: req.user._id
    };

    product.reviews.push(review);
    product.reviewCount = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    const allProducts = await Product.find({});
    res.status(201).json({ success: true, data: allProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteReviewAdmin = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.reviews = product.reviews.filter(r => r.id.toString() !== req.params.reviewId);
    product.reviewCount = product.reviews.length;
    product.rating = product.reviews.length > 0
      ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
      : 0;

    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
