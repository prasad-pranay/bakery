# SweetTreats - Python Flask Backend

This directory contains the Python Flask + Socket.IO replacement for the SweetTreats bakery application backend, maintaining 100% API compatibility with the Next.js frontend and MongoDB database.

---

## Architecture & Technology Stack

- **Framework**: Flask 3.x
- **Real-Time Communication**: Flask-SocketIO (with `python-engineio` and `python-socketio`)
- **Database**: MongoDB via `pymongo`
- **Authentication**: JWT (`PyJWT`) stored in HTTP-Only cookies with sameSite `Lax`
- **Password Hashing**: `bcrypt`
- **CORS**: `flask-cors` supporting credentials and cross-origin resource sharing

---

## Directory Structure

```
backend-python/
├── app/
│   ├── controllers/
│   │   ├── admin_controller.py
│   │   ├── auth_controller.py
│   │   ├── cart_controller.py
│   │   ├── coupon_controller.py
│   │   ├── order_controller.py
│   │   ├── product_controller.py
│   │   └── user_controller.py
│   ├── emails/
│   │   └── login_mail.py
│   ├── middleware/
│   │   ├── auth.py
│   │   └── upload.py
│   ├── models/
│   │   └── schemas.py
│   ├── services/
│   │   ├── payment_service.py
│   │   └── support_service.py
│   ├── socket/
│   │   ├── socket_auth.py
│   │   └── support_socket.py
│   ├── utils/
│   │   ├── email.py
│   │   └── serializers.py
│   ├── config.py
│   ├── db.py
│   └── __init__.py
├── images/
├── .env
├── .env.example
├── requirements.txt
├── run.py
├── seed.py
└── README.md
```

---

## Setup & Running Instructions

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.14)
- A running MongoDB instance (default `mongodb://localhost:27017/bakery`)

### 2. Environment Configuration
Copy `.env.example` to `.env` or verify configuration values in `.env`:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bakery
JWT_SECRET=supersecretkey
ADMIN_USERNAME=admin4862
ADMIN_PASSWORD=adminpassword
CLIENT_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. (Optional) Seed the Database
```bash
python seed.py
```

### 5. Start the Server
```bash
python run.py
```
The server will start on `http://0.0.0.0:5000`.

---

## Compatible Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check (`{ "message": "Bakery API is running" }`) |
| `GET` | `/items` | List all bakery products |
| `POST` | `/logout` | Clear auth token cookie |
| `GET` | `/images/<filename>` | Static image serving |
| `GET` | `/api/all-orders` | Fetch all orders |
| `GET` | `/api/all-users` | Fetch all users |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login (issues HTTP-only cookie + email) |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/me` | Fetch authenticated session |
| `POST` | `/api/auth/admin/login` | Admin login |
| `GET` | `/api/auth/verify/<token>` | Verify user email |
| `POST` | `/api/auth/forgot-password` | Request password reset token |
| `POST` | `/api/auth/reset-password` | Reset password using token |
| `GET` | `/api/products` | Retrieve all products |
| `GET` | `/api/products/<id>` | Product details |
| `POST` | `/api/products` | Create product (admin, file upload support) |
| `PUT` | `/api/products/<id>` | Update product (admin, file upload support) |
| `DELETE` | `/api/products/<id>` | Delete product (admin) |
| `POST` | `/api/products/<id>/reviews` | Add product review |
| `DELETE` | `/api/products/<id>/reviews/<reviewId>` | Delete review (admin) |
| `GET` | `/api/cart` | Get current user cart |
| `POST` | `/api/cart` | Add item to cart |
| `PATCH` | `/api/cart/<productId>` | Update item quantity in cart |
| `DELETE` | `/api/cart/<productId>` | Remove item from cart |
| `DELETE` | `/api/cart` | Clear entire cart |
| `POST` | `/api/orders` | Place order & update product stocks |
| `GET` | `/api/orders` | Fetch user orders |
| `GET` | `/api/orders/<id>` | Get order by ID |
| `POST` | `/api/orders/<id>/cancel` | Cancel order & restore inventory |
| `POST` | `/api/orders/admin/<id>/cancel` | Admin cancel order |
| `PATCH` | `/api/orders/<id>/status` | Update order status |
| `POST` | `/api/coupons/validate` | Check coupon validity |
| `GET` | `/api/coupons` | List all coupons (admin) |
| `POST` | `/api/coupons` | Create coupon (admin) |
| `PUT` | `/api/coupons/<id>` | Update coupon (admin) |
| `DELETE` | `/api/coupons/<id>` | Delete coupon (admin) |
| `GET` | `/api/admin/dashboard` | Dashboard analytics |
| `PATCH` | `/api/users/me` | Update user profile |
| `POST` | `/api/users/change-password` | Change user password |
| `GET` | `/api/users/me/addresses` | Get saved addresses |
| `POST` | `/api/users/me/addresses` | Add address |
| `PUT` | `/api/users/me/addresses/<id>` | Update address |
| `DELETE` | `/api/users/me/addresses/<id>` | Delete address |
| `PATCH` | `/api/users/me/addresses/<id>/default` | Set default address |
| `GET` | `/api/users/me/payments` | Get saved payment methods |
| `POST` | `/api/users/me/payments` | Add payment method |
| `PUT` | `/api/users/me/payments/<id>` | Update payment method |
| `DELETE` | `/api/users/me/payments/<id>` | Delete payment method |
| `PATCH` | `/api/users/me/payments/<id>/default` | Set default payment method |

---

## Socket.IO Events

All Socket.IO events match the Node backend specification:
- Handshake authenticates via HTTP-only `token` cookie or Bearer authorization.
- **Client to Server**:
  - `support:message`: Send chat message
  - `support:typing`: Typing indicators
  - `support:leave`: Leave conversation room
  - `support:admin:get_conversations`: Fetch conversation list
  - `support:admin:join`: Admin join conversation room
  - `support:admin:leave`: Admin leave room
  - `support:admin:close_conversation`: Admin close conversation
- **Server to Client**:
  - `support:history`: Emit conversation messages
  - `support:message`: Broadcast new message
  - `support:typing`: Typing broadcast
  - `support:status`: Presence & online/closed status
  - `support:user_status`: User status updates to `support:admin`
  - `support:admin:conversations`: List of conversations for admin
  - `support:error`: Structured error events (`{ "code": "...", "message": "..." }`)
