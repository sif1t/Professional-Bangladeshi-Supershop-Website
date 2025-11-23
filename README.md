# Professional Bangladeshi Supershop - Separated Frontend & Backend

This project has been restructured into separate frontend and backend folders for independent deployment.

## 📁 Project Structure

```
├── frontend/           # Next.js frontend application
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   └── package.json
│
└── backend/           # Express.js backend API
    ├── server/
    ├── api/
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

---

## Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bangladeshi-supershop
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Payment Gateway (Optional - SSLCommerz)
PAYMENT_GATEWAY_STORE_ID=your_store_id
PAYMENT_GATEWAY_STORE_PASSWORD=your_store_password
PAYMENT_GATEWAY_API_URL=https://sandbox.sslcommerz.com
```

### 4. Start the backend server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on: **http://localhost:5000**

### 5. Seed the database (Optional)
```bash
# Add professional product catalog
npm run seed:pro

# Make a user admin
npm run make-admin
```

---

## Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the frontend folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 4. Start the frontend development server
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Frontend will run on: **http://localhost:3000**

---

## 🖥️ Running Both Services Locally

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then visit: **http://localhost:3000**

---

## 🌐 Deployment Guide

### Backend Deployment

#### Option 1: Railway / Render / Heroku
1. Create a new project on your platform
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
5. Deploy!

#### Option 2: VPS (DigitalOcean, AWS, etc.)
```bash
# SSH into your server
ssh user@your-server-ip

# Clone repository
git clone your-repo-url
cd your-repo/backend

# Install dependencies
npm install --production

# Install PM2 for process management
npm install -g pm2

# Start the server
pm2 start server/index.js --name backend

# Save PM2 process list
pm2 save
pm2 startup
```

**Backend URL Example:** `https://api.yourshop.com`

---

### Frontend Deployment

#### Option 1: Vercel (Recommended for Next.js)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd frontend`
3. Run: `vercel`
4. Follow prompts
5. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL=https://api.yourshop.com/api`
   - `NEXT_PUBLIC_BACKEND_URL=https://api.yourshop.com`

#### Option 2: Netlify
1. Build the project: `cd frontend && npm run build`
2. Connect your GitHub repo to Netlify
3. Set build directory to `frontend`
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables in Netlify dashboard

#### Option 3: Static Export
```bash
cd frontend
npm run build
# Deploy the .next folder or use next export
```

**Frontend URL Example:** `https://yourshop.com`

---

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/shop` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_random_secret_key_123` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Frontend URL (for CORS) | `https://yourshop.com` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://api.yourshop.com/api` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend base URL | `https://api.yourshop.com` |

---

## 📚 Available Scripts

### Backend Scripts
```bash
npm start           # Start production server
npm run dev         # Start with nodemon (auto-reload)
npm run seed        # Seed basic data
npm run seed:pro    # Seed professional product catalog
npm run make-admin  # Make a user admin
npm run add-products # Add more products
```

### Frontend Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

---

## 🏗️ Architecture

### Backend (Express.js)
- RESTful API architecture
- JWT authentication with HTTP-only cookies
- MongoDB with Mongoose ODM
- File upload handling with Multer
- Payment gateway integration (SSLCommerz)

### Frontend (Next.js)
- Server-side rendering (SSR)
- Static generation for performance
- Context API for state management
- SWR for data fetching
- Responsive Tailwind CSS design

---

## 📦 Key Features

- ✅ **Separated Architecture**: Independent frontend and backend
- ✅ **User Authentication**: Secure JWT-based auth
- ✅ **Product Management**: Multi-level categories, variants, stock tracking
- ✅ **Shopping Cart**: Persistent cart with local storage sync
- ✅ **Order Management**: Complete order lifecycle
- ✅ **Payment Integration**: SSLCommerz gateway support
- ✅ **Admin Panel**: Product, order, and user management
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **SEO Optimized**: Next.js SSR for better SEO

---

## 🔐 Admin Access

After seeding the database, use these credentials:
- **Email**: admin@supershop.com
- **Password**: admin123

Or create admin access:
```bash
cd backend
npm run make-admin
```

---

## 📖 Additional Documentation

- `SETUP_GUIDE.md` - Detailed setup instructions
- `DEPLOY_NOW.md` - Deployment guide
- `PRODUCT_MANAGEMENT_GUIDE.md` - How to manage products
- `PAYMENT_SYSTEM_GUIDE.md` - Payment integration guide
- `ADMIN_ACCESS_FIXED.md` - Admin troubleshooting

---

## 🆘 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure PORT is not already in use
- Verify all environment variables are set

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is running
- Check CORS settings in backend

### Database connection issues
- Verify MongoDB is running (local) or URI is correct (Atlas)
- Check network access/IP whitelist (MongoDB Atlas)
- Ensure credentials are correct

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Success!

You now have a fully separated, production-ready e-commerce platform!

**Local URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api

Happy coding! 🚀
