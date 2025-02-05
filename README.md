# 🛒 E-Comm: Full-Stack E-Commerce App

## 📌 Description

E-Comm is a full-stack e-commerce application built with TypeScript. It provides users with a seamless shopping experience, including authentication, product listings, cart management, payments, and analytics.

---

## 🚀 Features

- 🔐 **User Authentication** (Sign up, login, logout)
- 🛍 **Product Management** (Browse, search, filter products)
- 🛒 **Shopping Cart** (Add, remove, update items)
- 💳 **Secure Payments** (Stripe integration)
- 🎟 **Discounts & Coupons** (Apply discounts on checkout)
- 📊 **Order Analytics** (Sales and user insights)
- 🌐 **Responsive Design** (Optimized for all devices)

---

## 🛠 Tech Stack

### **Frontend**

- ⚛️ React.js (with TypeScript)
- 🎨 Tailwind CSS
- 🚀 React Query (for API state management)
- 🔄 Zustand (for global state management)
- 🔗 React Router
- 🏗 Framer Motion

### **Backend**

- 🏗 Node.js + Express.js (TypeScript)
- 🛢 MongoDB + Mongoose
- 🔑 JWT Authentication
- ☁️ Cloudinary (for image storage)
- 🏦 Stripe (for payments)
- 🔍 Redis (for caching)

---

## 📡 API References

### **Authentication**

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout a user

### **Products**

- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get a single product
- `POST /api/product` - Create a product (Admin)
- `PUT /api/product/:id` - Update a product (Admin)
- `DELETE /api/product/:id` - Delete a product (Admin)

### **Cart**

- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `GET /api/cart` - Get user’s cart

### **Payments**

- `POST /api/payments/checkout` - Process payment
- `GET /api/payments/success` - Payment success callback

### **Coupons**

- `POST /api/coupons/apply` - Apply a discount coupon

### **Analytics**

- `GET /api/analytics/sales` - Get sales data

---

## 💻 How to Run Locally

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/Heismanish/e-commm.git
cd e-commm
```

### 2️⃣ Install Dependencies

```sh
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory with the following:

```shell
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
REDIS_URL=your_redis_connection_url

```

### 4️⃣ Run Backend

```shell
cd backend
npm run dev
```

### 5️⃣ Run Frontend

```shell
cd frontend
npm run dev
```

### 6️⃣ Open in Browser

Visit http://localhost:5173 to access the app.

# 🤝 Contributing

Feel free to submit issues or open pull requests to improve the project.

# 🌎 Deployment

The backend is deployed on Railway, and the frontend is hosted on Vercel.

# 📜 License

This project is licensed under the MIT License.
