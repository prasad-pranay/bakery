import { Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';

export const getCart = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.productId');
    const result = user?.cart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addToCart = async (req: any, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.count < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough inventory' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (cartItemIndex > -1) {
      const newQuantity = user.cart[cartItemIndex].quantity + quantity;
      if (product.count < newQuantity) {
        return res.status(400).json({ success: false, message: 'Not enough inventory to add more' });
      }
      user.cart[cartItemIndex].quantity = newQuantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.json({ success: true, data: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) return res.status(400).json({ success: false, message: 'Quantity must be > 0' });

    const product = await Product.findById(productId);
    if (!product || product.count < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough inventory' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      await user.save();
      return res.json({ success: true, data: user.cart });
    }

    res.status(404).json({ success: false, message: 'Product not in cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const removeFromCart = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();

    res.json({ success: true, data: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const clearCart = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.cart = [];
    await user.save();

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
