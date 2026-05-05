<div align="center">

# eStore

**A full-featured, modern e-commerce web application built for a seamless online shopping experience.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rajputco.com-blue?style=for-the-badge)](https://www.rajputco.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Muhammad-Raheel04/eStore)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
- [Cart & Order Flow](#cart--order-flow)
- [Future Improvements](#future-improvements)

---

## Overview

eStore is a production-ready e-commerce platform with support for both guest and registered users. It includes product browsing, authentication with email verification, cart management, order processing, and a full admin dashboard — all deployable in minutes.

**Live at:** [https://www.rajputco.com](https://www.rajputco.com)

---

## Features

### User Features

| Feature | Description |
|---|---|
| Auth | Register, login, logout with JWT & email verification |
| Products | Browse, search, and filter by category/type |
| Product Detail | View full product info with image gallery |
| Cart | Add, remove, update quantity — works for guests too |
| Checkout | Secure Cash-on-Delivery checkout flow |
| Order History | View past orders (registered users) |
| Profile | Update personal info and profile picture |
| Responsive | Fully mobile-friendly design |

### Admin Features

| Feature | Description |
|---|---|
| Products | Add, edit, delete products with multi-image upload |
| Featured Products | Toggle products as featured |
| Categories | Manage product types and their sub-categories |
| Orders | View all orders, update status (Processing → Shipped → Delivered) |
| Users | View and manage all registered users |
| Sales Dashboard | Revenue charts, totals, and delivery stats |

---

## Tech Stack

### Frontend
- **React.js** — Component-based UI
- **React Router DOM** — Client-side routing
- **Redux Toolkit + Redux Persist** — Global state management with persistence
- **Tailwind CSS** — Utility-first styling
- **Shadcn/UI + Radix UI** — Accessible headless component primitives
- **Lucide React + React Icons** — Icon libraries
- **Recharts** — Sales dashboard charts
- **React Quill New** — Rich text editor
- **Motion (Framer Motion)** — Animations
- **Sonner** — Toast notifications
- **Next Themes** — Dark/light mode support
- **React Medium Image Zoom** — Product image zoom

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database & ODM
- **JWT + Bcrypt** — Authentication & password hashing
- **Cloudinary** — Image storage
- **Multer** — File upload middleware
- **Nodemailer + Brevo (SMTP)** — Transactional emails
- **Cookie Parser** — Cookie handling
- **Nodemon** — Development auto-restart

### DevOps & Tools
- Git & GitHub
- Postman (API testing)
- VS Code
- Railway (deployment)

---

## Project Structure

### Backend

```
Backend/
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── typeController.js
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   ├── CartModel.js
│   ├── orderModel.js
│   ├── productTypeModel.js
│   └── sessionModel.js
├── routes/
│   ├── userRoute.js
│   ├── productRoute.js
│   ├── cartRoute.js
│   ├── orderRoute.js
│   └── typeRoute.js
├── middleware/
│   ├── isAuthenticated.js
│   ├── cartIdentity.js
│   └── multer.js
├── utils/
│   ├── cloudinary.js
│   └── dataURI.js
├── emailVerify/
│   └── sendOrderEmail.js
├── database/
│   └── db.js
└── server.js
```

### Frontend

```
frontend/
├── public/
└── src/
    ├── assets/
    ├── components/
    │   └── ui/
    ├── constants/
    ├── lib/
    ├── pages/
    │   └── admin/
    ├── redux/
    └── utils/
```

---

## API Reference

Base URL: `/api/v1`

### Users — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Register new user |
| POST | `/verify`  | Email verification |
| POST | `/reverify` | Resend verification email |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| POST | `/forgot-password` | Send OTP for reset |
| POST | `/verify-otp/:email` | Verify OTP |
| POST | `/change-password/:email` | Change password |
| GET | `/all-user` | Admin | List all users |
| GET | `/get-user/:userId` | Get user by ID |
| PUT | `/update/:id` | Update profile |

### Products — `/product`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Admin | Add product (multipart) |
| GET | `/getallproducts` | Get all products |
| GET | `/featured` | Get featured products |
| GET | `/:productId` | Get single product |
| PUT | `/update/:productId` | Admin | Update product |
| DELETE | `/delete/:productId` | Admin | Delete product |
| PATCH | `/featured/:productId` | Admin | Toggle featured |

### Cart — `/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Guest/User | View cart |
| POST | `/add` | Guest/User | Add item |
| PUT | `/update` | Guest/User | Update quantity |
| DELETE | `/remove` | Guest/User | Remove item |

> Cart is identified by `userId` (logged-in) or `sessionId` cookie (guest).

### Orders — `/order`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/cod` | Guest/User | Place COD order |
| GET | `/my-orders` | User's order history |
| GET | `/all-orders` Admin | All orders |
| PUT | `/:id` Admin | Update order status |
| GET | `/sales` Admin | Sales dashboard data |

### Types & Categories — `/`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/types` | List all types |
| POST | `/type` Admin | Add type |
| DELETE | `/type/:typeName` Admin | Delete type |
| POST | `/category` Admin | Add category to type |
| DELETE | `/category/:type/:category` Admin | Remove category |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Brevo account (for emails)

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammad-Raheel04/eStore.git
cd eStore
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then run:

```bash
npm run dev
# or
nodemon server.js
```

Backend runs on: `http://localhost:<PORT>`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Environment Variables

Create a `.env` file inside `/Backend`:

```env
PORT=

# Database
MONGO_URI=

# JWT
SECRET_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Nodemailer / Brevo SMTP)
MAIL_USER=
MAIL_PASS=
BREVO_USER=
BREVO_PASS=
BREVO_API_KEY=
EMAIL_FROM=

# App
FRONTEND_URL=
ADMIN_EMAIL=
```

---

## Authentication Flow

```
User registers
    → Password hashed with bcrypt
    → Verification email sent via Brevo
User clicks verify link
    → Account activated
User logs in
    → JWT generated & stored in HTTP-only cookie
Protected routes
    → isAuthenticated middleware validates JWT
    → isAdmin middleware checks role
```

---

## Cart & Order Flow

```
Guest or logged-in user adds product to cart
    → Cart identified by userId or sessionId cookie
User proceeds to checkout
    → Registered: shipping address optional (uses profile)
    → Guest: full shipping info required
Order created (COD)
    → Confirmation email sent via Brevo
    → Cart cleared
Admin updates order status
    → Processing → Shipped → Delivered
```

---

## Future Improvements

- [ ] Online payment integration (PayFast)
- [ ] Wishlist / save for later
- [ ] Product reviews & star ratings
- [ ] Dark mode
- [ ] Advanced search with Elasticsearch
- [ ] Real-time order tracking

---

<div align="center">

Built by [Muhammad Raheel](https://github.com/Muhammad-Raheel04)

</div>