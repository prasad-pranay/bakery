# Bakery Backend API

Production-ready backend for the bakery website, built with Node.js, Express, TypeScript, and MongoDB.

## Features
- **TypeScript** integration
- **Mongoose Models**: User, Product, Order, Coupon
- **Security**: Helmet, CORS, Rate Limiting, HTTP-Only Cookies
- **Authentication**: JWT & bcrypt for passwords
- **Email**: Nodemailer for login and verification notifications

## Directory Structure
\`\`\`
src/
├── config/
├── controllers/    # authController.ts
├── middleware/     # auth.ts
├── models/         # User.ts, Product.ts, Order.ts, Coupon.ts
├── routes/         # authRoutes.ts
├── services/
├── utils/          # email.ts
├── validators/
├── app.ts          # Express setup and security middlewares
└── server.ts       # Database connection & server listening
\`\`\`

## Getting Started

1. Set up your environment variables by copying `.env.example` to `.env`.
2. Install dependencies (already executed).
3. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register a new user and send verification email
- \`POST /api/auth/login\` - Login and receive HTTP-Only cookie with JWT
- \`POST /api/auth/logout\` - Clear authentication cookie
- \`GET /api/auth/me\` - Get current authenticated user details
- \`POST /api/auth/admin/login\` - Separate admin authentication endpoint

### Products
- \`GET /api/products\` - List all products
- \`GET /api/products/:id\` - Get a single product
- \`POST /api/products\` - Create a product (Admin only)
- \`PUT /api/products/:id\` - Update a product (Admin only)
- \`DELETE /api/products/:id\` - Delete a product (Admin only)

### Cart
- \`GET /api/cart\` - Get current user's cart
- \`POST /api/cart\` - Add an item to the cart
- \`PATCH /api/cart/:productId\` - Update quantity of an item
- \`DELETE /api/cart/:productId\` - Remove an item from the cart
- \`DELETE /api/cart\` - Clear the entire cart

### Orders
- \`POST /api/orders\` - Create a new order (Checkout)
- \`GET /api/orders\` - Get current user's orders
- \`GET /api/orders/:id\` - Get a specific order by ID

### Coupons
- \`POST /api/coupons/validate\` - Validate a coupon code before checkout
- \`GET /api/coupons\` - List all coupons (Admin only)
- \`POST /api/coupons\` - Create a coupon (Admin only)
- \`PUT /api/coupons/:id\` - Update a coupon (Admin only)
- \`DELETE /api/coupons/:id\` - Delete a coupon (Admin only)

### Admin Dashboard
- \`GET /api/admin/dashboard\` - Get dashboard statistics (users, products, revenue, etc.) (Admin only)
