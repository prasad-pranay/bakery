import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { sendEmail } from '../utils/email';
import Coupon from '../models/Coupon';



export const createOrder = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.cart.length === 0) {
      throw new Error("Cart is empty or user not found");
    }

    const { shippingAddress, paymentMethod, coupon } = req.body;

    let subtotal = 0;
    const orderItems = [];

    // Check products and update stock
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.count < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.count -= item.quantity;

      await product.save();

      subtotal += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Handle discounts/coupons here...
    const couponFind = await Coupon.findOne({ couponCode: coupon.code })
    let discount = 0;
    if (couponFind) {
      if (couponFind.discountType === "PERCENTAGE") {
        const disTemp = subtotal * (couponFind.discountValue / 100);
        if (disTemp > (couponFind.maximumDiscount || 0)) {
          discount = (couponFind.maximumDiscount || 0);
        } else {
          discount = disTemp;
        }
      } else {
        discount = couponFind.discountValue;
      }
      await user.usedCoupons.push(couponFind?._id)
      await user.save()
    }
    const deliveryFee = subtotal > 500 ? 0 : 30;
    const total = subtotal - discount + deliveryFee;

    const orderId =
      "ORD-" + Date.now() + Math.floor(Math.random() * 1000);

    const order = await Order.create({
      orderId,
      userId: user._id,
      items: orderItems,
      subtotal,
      discount,
      deliveryFee,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
    });

    // Clear cart and add order to user's orders
    user.cart = [];
    user.orders.push(order._id as any);

    await user.save();

    // Send emails async
    sendEmail(
      user.email,
      "Order Confirmation",
      `<p>Your order ${orderId} has been placed successfully.</p>`
    );

    sendEmail(
      process.env.EMAIL_FROM as string,
      "New Order Received",
      `<p>Order ${orderId} was placed.</p>`
    );

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', "yse": "no" });
  }
}

export const getUserOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOrderById = async (req: any, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelOrder = async (req: any, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (product) {
        product.count += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "CANCELLED";

    // Payment refund logic via PaymentService would go here if paid

    await order.save();

    const allOrders = await Order.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: allOrders,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const adminCancelOrder = async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (product) {
        product.count += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "CANCELLED";

    await order.save();

    const allOrder = await Order.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      data: allOrder,
    });
  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Can send email to user here if needed
    const AllOrder = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: AllOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
