# Professional Bangladeshi Supershop E-commerce Platform

A full-stack, professional-grade e-commerce platform tailored for the Bangladeshi supershop market, combining the best features of top competitors like Meena Bazar, Shwapno, and Agora.

## 🚀 Features

### Core Features
- **Fast Delivery System**: Mandatory delivery location selector with visible delivery slots
- **Multi-level Category System**: Support for 3+ level product categorization
- **Advanced Product Catalog**: Variants, stock management, sale prices
- **Promotional Sections**: Best Saving, Buy & Get Free, New Arrivals, Featured Products
- **User Authentication**: JWT-based authentication with HTTP-Only cookies
- **Order Management**: Complete order tracking and history
- **Responsive Design**: 100% mobile-responsive UI

### Technology Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API
- **HTTP Client**: Axios, SWR

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Professional Bangladeshi Supershop Website"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` and add your MongoDB connection string and other configurations.

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Run the development servers**

Terminal 1 - Backend API:
```bash
npm run server:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
.
├── components/           # React components
│   ├── layout/          # Header, Footer, Layout
│   ├── products/        # ProductCard, ProductGrid
│   ├── shop/            # FilterSidebar, CategoryMenu
│   └── ui/              # Reusable UI components
├── pages/               # Next.js pages
│   ├── api/            # API routes (proxied to Express)
│   ├── category/       # Category pages
│   ├── product/        # Product detail pages
│   ├── account/        # User dashboard
│   └── index.js        # Homepage
├── server/              # Express backend
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, error handling
│   └── config/         # Database configuration
├── context/             # React Context providers
├── lib/                 # Utility functions
├── styles/              # Global styles
└── public/              # Static assets
```

## 🔑 Key Pages

1. **Homepage** (`/`) - Hero carousel, category grid, promotional sections
2. **Category Page** (`/category/[slug]`) - Product listing with filters
3. **Product Page** (`/product/[slug]`) - Detailed product information
4. **Cart** (`/cart`) - Shopping cart management
5. **Checkout** (`/checkout`) - Multi-step checkout process
6. **Account Dashboard** (`/account/dashboard`) - User profile and orders

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get single product
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details

## 🎨 UI Components

- **Header**: Mega menu, search, location selector, cart icon
- **Footer**: Contact info, links, app downloads, social media
- **ProductCard**: Image, name, price, add to cart
- **QuantityStepper**: Increment/decrement quantity
- **FilterSidebar**: Category, brand, price filters

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Update `.env` with production values:
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL`

## 📝 License

This project is proprietary and confidential.

## 👥 Support

For support, email support@yourcompany.com or call 16469.
