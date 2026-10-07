import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Coupon from '../models/Coupon';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Configurable low stock threshold
    const lowStockThreshold = 5; 
    const lowStockProducts = await Product.countDocuments({ count: { $lte: lowStockThreshold, $gt: 0 } });
    const soldOutProducts = await Product.countDocuments({ count: 0 });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'PENDING' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'DELIVERED' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'CANCELLED' });

    const revenueAggregation = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['CANCELLED', 'REFUNDED'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const revenue = revenueAggregation[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        lowStockProducts,
        soldOutProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        revenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving stats' });
  }
};
