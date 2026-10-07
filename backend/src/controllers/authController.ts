import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendEmail } from '../utils/email';
import { loginMailContent } from '../emails/loginMail';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = Math.random().toString(36).substring(2, 15);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await sendEmail(
      email,
      'Welcome to Bakery! Please verify your email',
      `<p>Hi ${name},</p><p>Please verify your email using this token: ${verificationToken}</p>`
    );

    res.status(201).json({ success: true, message: 'User registered. Please verify your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(email, password)
    const user = await User.findOne({ email });

    if (!user) {
      console.log('1')
      return res.status(401).json({ success: false, message: 'User Not Found' });
    } else if (!user || !user.password) {
      console.log('2')
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }



    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('3')
      return res.status(401).json({ success: false, message: 'Password is wrong' });
    }


    // await sendEmail(
    //   email,
    //   'New login detected',
    //   `<p>Hi ${user.name}, a new login was detected on your account at ${new Date().toLocaleString()}.</p>`
    // );
    const mailContent = loginMailContent(user.name, new Date().toLocaleString(), email)

    await sendEmail(
      email,
      'New login detected',
      mailContent
    );

    const token = jwt.sign({ id: user._id.toString(), admin: false }, process.env.JWT_SECRET!, {
      expiresIn: "30d"
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: "Welcome back!", data: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: any, res: Response) => {
  res.json({ success: true, data: req.user, admin: req.admin });
};

export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET as string, {
      expiresIn: '1d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, message: 'Admin logged in' });
  }
  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const resetToken = Math.random().toString(36).substring(2, 15);
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await sendEmail(
      email,
      'Password Reset',
      `<p>Use this token to reset your password: ${resetToken}</p>`
    );

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
