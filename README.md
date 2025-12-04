# 🛒 Professional Bangladeshi Supershop - E-commerce Platform

A complete, production-ready e-commerce platform with **separated frontend and backend** for independent deployment. Built with Next.js and Express.js.

## ✨ Ready for Deployment!

✅ Frontend and Backend configured to work 100% separately  
✅ Deploy frontend on Vercel, backend on Render  
✅ Complete documentation included  
✅ Production-tested and ready to go live  

**📚 Quick Links:**
- [🚀 Complete Deployment Guide](SEPARATE_DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [✅ Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Quick reference
- [🧪 Testing Guide](TESTING_GUIDE.md) - Test after deployment
- [📦 Ready to Deploy](DEPLOYMENT_READY.md) - Summary & overview

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

### Option 1: Automatic Start (Windows)
Double-click one of these files:
- `start-dev.bat` - Batch script
- `start-dev.ps1` - PowerShell script

Both will automatically start backend and frontend in separate windows!

### Option 2: Manual Start
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

### 🚀 Quick Deployment (Recommended)

**Total Time: ~15 minutes**

#### Step 1: Deploy Backend to Render (5 min)
1. Go to [Render.com](https://render.com)
2. Create New Web Service → Connect GitHub
3. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables (see below)
5. Deploy and copy URL: `https://your-backend.onrender.com`

**Backend Environment Variables:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_32_character_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
```

#### Step 2: Deploy Frontend to Vercel (3 min)
1. Go to [Vercel.com](https://vercel.com)
2. Import Project → Connect GitHub
3. Settings:
   - Root Directory: `frontend`
   - Framework: Next.js
4. Add environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```
5. Deploy and copy URL: `https://your-app.vercel.app`

#### Step 3: Connect Them (2 min)
1. Update backend `FRONTEND_URL` with your Vercel URL
2. Redeploy backend
3. Test: Visit your frontend URL
4. ✅ Everything should work!

**📖 Detailed Instructions:** See [SEPARATE_DEPLOYMENT_GUIDE.md](SEPARATE_DEPLOYMENT_GUIDE.md)

---

### Alternative Deployment Options

#### Backend Alternatives
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io  
- **Heroku**: https://heroku.com

#### Frontend Alternatives
- **Netlify**: https://netlify.com (use `frontend/netlify.toml`)
- **Cloudflare Pages**: https://pages.cloudflare.com
- **AWS Amplify**: https://aws.amazon.com/amplify

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

## 📖 Documentation

### Deployment & Setup
- 📦 [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md) - Complete deployment summary
- 🚀 [SEPARATE_DEPLOYMENT_GUIDE.md](SEPARATE_DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- ✅ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Quick deployment checklist
- 🔧 [ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md) - Environment variables guide
- 🧪 [TESTING_GUIDE.md](TESTING_GUIDE.md) - Complete testing procedures

### Product & Admin Management
- 📝 [PRODUCT_MANAGEMENT_GUIDE.md](docs/PRODUCT_MANAGEMENT_GUIDE.md) - How to manage products
- 👤 [ADMIN_ACCESS_FIXED.md](docs/ADMIN_ACCESS_FIXED.md) - Admin troubleshooting
- 💳 [PAYMENT_SYSTEM_GUIDE.md](docs/PAYMENT_SYSTEM_GUIDE.md) - Payment integration

### Additional Guides
- 📚 [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) - Detailed setup instructions
- 🚀 [DEPLOY_NOW.md](docs/DEPLOY_NOW.md) - Alternative deployment guide

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
