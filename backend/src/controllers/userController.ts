import { Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user || !user.password) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect old password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const allUsers = await User.find();
    res.json({ success: true, data: allUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', "yes": "no" });
  }
}

// Address Management
export const getAddresses = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user?.savedAddresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addAddress = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = { ...req.body, id: Date.now().toString() };
    if (newAddress.isDefault || user.savedAddresses.length === 0) {
      user.savedAddresses.forEach(a => a.isDefault = false);
      newAddress.isDefault = true;
    }

    user.savedAddresses.push(newAddress);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateAddress = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const index = user.savedAddresses.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Address not found' });

    user.savedAddresses[index] = { ...user.savedAddresses[index], ...req.body, id };

    if (req.body.isDefault) {
      user.savedAddresses.forEach((a, i) => {
        if (i !== index) a.isDefault = false;
      });
    }

    await user.save();
    res.json({ success: true, data: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAddress = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.savedAddresses = user.savedAddresses.filter(a => a.id !== id);
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const setDefaultAddress = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.savedAddresses.forEach(a => {
      a.isDefault = (a.id === id);
    });

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Payment Method Management
export const getPaymentMethods = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user?.savedPaymentMethods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addPaymentMethod = async (req: any, res: Response) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newMethod = {
      provider: String(req.body.provider),
      paymentMethodId: Date.now().toString(),
      type: String(req.body.type),
      brand: String(req.body.brand || ""),
      last4: String(req.body.last4),
      expiryMonth: Number(req.body.expiryMonth),
      expiryYear: Number(req.body.expiryYear),
      isDefault: Boolean(req.body.isDefault),
    };


    if (newMethod.isDefault || user.savedPaymentMethods.length === 0) {
      user.savedPaymentMethods.forEach((method) => {
        method.isDefault = false;
      });

      newMethod.isDefault = true;
    } else {
      newMethod.isDefault = false;
    }

    user.savedPaymentMethods.push(newMethod);

    await user.save();

    return res.status(201).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const updatePaymentMethod = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const index = user.savedPaymentMethods.findIndex(m => m.paymentMethodId === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Payment method not found' });

    // Merge update but keep the original paymentMethodId
    user.savedPaymentMethods[index] = { ...user.savedPaymentMethods[index], ...req.body, paymentMethodId: id };

    if (req.body.isDefault) {
      user.savedPaymentMethods.forEach((m, i) => {
        if (i !== index) m.isDefault = false;
      });
    }

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deletePaymentMethod = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.savedPaymentMethods = user.savedPaymentMethods.filter(m => m.paymentMethodId !== id);
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const setDefaultPaymentMethod = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const exists = user.savedPaymentMethods.some(m => m.paymentMethodId === id);
    if (!exists) return res.status(404).json({ success: false, message: 'Payment method not found' });

    user.savedPaymentMethods.forEach(m => {
      m.isDefault = (m.paymentMethodId === id);
    });

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
