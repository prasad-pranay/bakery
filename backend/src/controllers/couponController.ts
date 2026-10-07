import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon' });
    }

    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: 'Coupon expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin only
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({});
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid coupon data' });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid coupon data' });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
