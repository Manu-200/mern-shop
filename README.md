# MAISON — MERN E-Commerce Store

A production-ready, internship-level full-stack e-commerce application built with **MongoDB, Express, React, and Node.js**. Styled with a luxury editorial aesthetic.

---

## ✨ Features

### Customer-Facing
- **Homepage** — editorial hero, category grid, featured products
- **Shop** — filterable product grid (category, search, sort, pagination)
- **Product Detail** — image gallery, size/colour selector, quantity picker, customer reviews
- **Cart** — persistent server-side cart, quantity management, real-time totals
- **Checkout** — shipping address form, payment method selection, order summary
- **Order History** — track all past orders and their statuses
- **User Profile** — update name, address, change password

### Admin Panel
- **Dashboard** — revenue overview, recent orders, top products
- **Product Management** — full CRUD: create, edit, delete, search, filter, paginate
- **Order Management** — view all orders, update status (processing → confirmed → shipped → delivered), add tracking numbers

### Technical
- JWT Authentication with bcrypt password hashing
- Protected routes (customer + admin)
- Server-side cart persistence in MongoDB
- Stock management (decrements on order, prevents overselling)
- Product reviews system (one per user per product)
- Aggregation pipelines for category stats
- Pagination on all list endpoints
- Axios interceptors for auth headers + 401 redirect
- Toast notifications throughout
- Responsive, accessible UI

---

## 🛠 Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React 18, React Router v6, Vite  |
| Styling    | Pure CSS with CSS custom properties |
| HTTP       | Axios with interceptors          |
| Toasts     | React Hot Toast                  |
| Backend    | Node.js + Express 4              |
| Database   | MongoDB + Mongoose               |
| Auth       | JWT + bcryptjs                   |
| Validation | express-validator                |
| Logging    | Morgan                           |
| Dev        | Nodemon, Concurrently            |

---

## 📁 Project Structure

```
mern-shop/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # register, login, profile
│   │   ├── productController.js   # CRUD + reviews + search
│   │   ├── cartController.js      # add, update, remove, clear
│   │   └── orderController.js     # place, list, admin manage
│   ├── middleware/
│   │   └── auth.js               # protect, adminOnly, optionalAuth
│   ├── models/
│   │   ├── User.js               # bcrypt, address, wishlist
│   │   ├── Product.js            # reviews subdoc, rating calc
│   │   ├── Cart.js               # per-user, calcTotals method
│   │   └── Order.js              # full order lifecycle
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── utils/
│   │   └── seed.js               # 12 products + admin + demo users
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx     # scroll-aware, cart badge
        │   │   └── Footer.jsx
        │   └── product/
        │       └── ProductCard.jsx # hover image swap, badges
        ├── context/
        │   ├── AuthContext.jsx    # global user state
        │   └── CartContext.jsx    # global cart state
        ├── pages/
        │   ├── Home.jsx           # hero + categories + featured
        │   ├── Shop.jsx           # grid + filters + pagination
        │   ├── ProductDetail.jsx  # gallery + options + reviews
        │   ├── Cart.jsx           # full cart with totals
        │   ├── Checkout.jsx       # address + payment + summary
        │   ├── OrderSuccess.jsx   # confirmation page
        │   ├── Orders.jsx         # order history
        │   ├── Profile.jsx        # account settings
        │   ├── Login.jsx          # split-screen auth
        │   ├── Register.jsx       # split-screen auth
        │   └── admin/
        │       ├── AdminDashboard.jsx  # stats + recent data
        │       ├── AdminProducts.jsx   # full CRUD table + modal
        │       └── AdminOrders.jsx     # order management + modal
        ├── utils/
        │   ├── api.js             # Axios instance + interceptors
        │   └── format.js          # currency, date, status helpers
        ├── App.jsx                # routes + guards
        ├── main.jsx
        └── index.css              # design system + utilities
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local) or [MongoDB Atlas](https://mongodb.com/atlas) (free tier)

### 1. Clone & Install

```bash
# Install all dependencies at once
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

#### a. Backend `.env` file

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-shop
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **12 curated products** across clothing, bags, footwear, accessories
- **Admin account**: `admin@shop.com` / `admin123`
- **Demo account**: `demo@shop.com` / `demo1234`

### 4. Run the App

```bash
# Run both servers simultaneously
npm run dev
```

Or separately:
```bash
npm run dev:backend   # → http://localhost:5000
npm run dev:frontend  # → http://localhost:5173
```

---

## 🔌 API Reference

### Auth  `POST /api/auth/...`
| Method | Endpoint      | Auth | Description           |
|--------|---------------|------|-----------------------|
| POST   | /register     | No   | Create account        |
| POST   | /login        | No   | Sign in, receive JWT  |
| GET    | /me           | Yes  | Get current user      |
| PUT    | /profile      | Yes  | Update name/address   |
| PUT    | /password     | Yes  | Change password       |

### Products  `GET|POST|PUT|DELETE /api/products/...`
| Method | Endpoint          | Auth  | Description               |
|--------|-------------------|-------|---------------------------|
| GET    | /                 | No    | List with filters/search  |
| GET    | /:id              | No    | Single product + reviews  |
| GET    | /categories/stats | No    | Category aggregation      |
| POST   | /                 | Admin | Create product            |
| PUT    | /:id              | Admin | Update product            |
| DELETE | /:id              | Admin | Soft-delete product       |
| POST   | /:id/reviews      | User  | Add review                |

#### Query Parameters for GET /api/products
| Param    | Type   | Example              |
|----------|--------|----------------------|
| search   | string | `?search=cashmere`   |
| category | string | `?category=clothing` |
| featured | bool   | `?featured=true`     |
| minPrice | number | `?minPrice=100`      |
| maxPrice | number | `?maxPrice=300`      |
| sort     | string | `?sort=price-asc`    |
| page     | number | `?page=2`            |
| limit    | number | `?limit=12`          |

Sort options: `newest`, `oldest`, `price-asc`, `price-desc`, `rating`, `popular`

### Cart  `/api/cart/...`  *(all require auth)*
| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| GET    | /              | Get user's cart      |
| POST   | /add           | Add item             |
| PUT    | /item/:itemId  | Update quantity      |
| DELETE | /item/:itemId  | Remove item          |
| DELETE | /clear         | Empty cart           |

### Orders  `/api/orders/...`  *(all require auth)*
| Method | Endpoint             | Auth  | Description         |
|--------|----------------------|-------|---------------------|
| POST   | /                    | User  | Place order         |
| GET    | /                    | User  | My orders           |
| GET    | /:id                 | User  | Single order        |
| GET    | /admin/all           | Admin | All orders          |
| PUT    | /admin/:id/status    | Admin | Update order status |

---

## 🎯 Internship Skills Demonstrated

1. **REST API Design** — proper HTTP verbs, status codes, resource naming
2. **Authentication & Security** — JWT tokens, bcrypt hashing, protected routes, role-based access
3. **Database Modeling** — Mongoose schemas, subdocuments, virtual fields, aggregation pipelines
4. **State Management** — React Context API for auth and cart
5. **Component Architecture** — reusable components, separation of concerns, prop drilling avoidance
6. **Data Fetching** — Axios with request/response interceptors, parallel requests with Promise.all
7. **Form Handling** — controlled inputs, client + server-side validation
8. **Error Handling** — global Express error middleware, Axios error handling, user-facing toasts
9. **UX Details** — loading states, optimistic UI, hover effects, responsive pagination
10. **Code Organization** — MVC pattern on backend, feature-based frontend structure
11. **Environment Config** — .env management, different configs per environment
12. **Database Seeding** — reproducible test data for demos

---

## 🚀 Deployment

### Backend → Railway or Render
1. Connect your GitHub repo
2. Set root directory to `/backend`
3. Add environment variables (MONGO_URI, JWT_SECRET, etc.)
4. MongoDB Atlas for production database

### Frontend → Vercel or Netlify
1. Set root directory to `/frontend`
2. Build command: `npm run build`
3. Add `VITE_API_URL` environment variable pointing to your deployed backend

---

*Built with care for internship portfolio demonstration.*
