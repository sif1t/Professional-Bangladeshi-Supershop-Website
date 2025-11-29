# Backend - Bangladeshi Supershop API

Express.js backend API for the Professional Bangladeshi Supershop E-commerce Platform.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bangladeshi-supershop
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
backend/
├── server/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Product.js         # Product model
│   │   ├── Category.js        # Category model
│   │   └── Order.js           # Order model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── products.js        # Product routes
│   │   ├── categories.js      # Category routes
│   │   ├── orders.js          # Order routes
│   │   ├── payment.js         # Payment routes
│   │   ├── admin.js           # Admin routes
│   │   └── upload.js          # File upload routes
│   ├── middleware/
│   │   ├── auth.js            # Auth middleware
│   │   └── errorHandler.js   # Error handling
│   ├── utils/
│   │   └── auth.js            # Auth utilities
│   └── index.js               # Main server file
├── api/
│   └── index.js               # Vercel serverless handler
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users

### Upload
- `POST /api/upload/product` - Upload product images
- `POST /api/upload/payment` - Upload payment proof

## 🔐 Authentication

Uses JWT tokens stored in HTTP-only cookies for secure authentication.

**Protected Routes:** Require valid JWT token
**Admin Routes:** Require admin role

## 🗄️ Database Models

### User Model
- email, password, name, phone
- role (user/admin)
- addresses, orders

### Product Model
- name, slug, description
- price, salePrice, stock
- category, images
- variants, featured, promotional

### Category Model
- name, slug, description
- parent (for nested categories)
- image, order

### Order Model
- user, products, totalAmount
- shippingAddress, deliverySlot
- status, paymentStatus
- paymentMethod, paymentProof

## 🛠️ Scripts

```bash
npm start              # Start production server
npm run dev            # Start with nodemon
npm run seed           # Seed basic data
npm run seed:pro       # Seed professional catalog
npm run make-admin     # Make user admin
npm run add-products   # Add more products
```

## 🌐 Deployment

### Vercel Serverless
The `api/index.js` file is configured for Vercel serverless deployment.

### Traditional Server
Use PM2 or similar process manager:
```bash
pm2 start server/index.js --name backend
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT tokens |
| `NODE_ENV` | No | Environment (development/production) |
| `FRONTEND_URL` | Yes | Frontend URL for CORS |
| `PAYMENT_GATEWAY_STORE_ID` | No | SSLCommerz store ID |
| `PAYMENT_GATEWAY_STORE_PASSWORD` | No | SSLCommerz password |

## 🔧 CORS Configuration

CORS is configured to accept requests from `FRONTEND_URL`. Update in production:

```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cors** - CORS middleware
- **dotenv** - Environment variables

## 🐛 Debugging

Enable detailed logging in development:
```javascript
// In server/index.js
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

## 🔒 Security

- Passwords hashed with bcrypt
- JWT tokens in HTTP-only cookies
- Input validation on all routes
- Rate limiting (recommended to add)
- Helmet.js for headers (recommended to add)

## 📞 Support

For issues or questions about the backend API, check the main README.md or project documentation.
