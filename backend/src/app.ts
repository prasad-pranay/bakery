import express, { Response, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import couponRoutes from './routes/couponRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import { getProducts } from './controllers/productController';
import { requireAdmin } from './middleware/auth';
import { getAllOrders } from './controllers/orderController';
import { getAllUsers } from './controllers/userController';
// other routes will be imported here

dotenv.config();

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.8:3000', 'http://localhost:3001'],
  credentials: true
}));

// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
// app.use(limiter);
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.get('/api/all-orders', getAllOrders);
app.get('/api/all-users', getAllUsers);
app.get('/items', getProducts);

const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
app.post("/logout", logout);

app.use(
  "/images",
  express.static("images")
);


app.get('/', (req, res) => res.send({ message: 'Bakery API is running' }));

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
