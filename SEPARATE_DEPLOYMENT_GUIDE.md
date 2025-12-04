# 🚀 SEPARATE DEPLOYMENT GUIDE
# Frontend & Backend Living Separately - 100% Working

This guide will help you deploy your frontend and backend on separate platforms and ensure they communicate properly.

## 📋 Overview

- **Backend**: Deploy on Render.com (or Railway, Heroku)
- **Frontend**: Deploy on Vercel (or Netlify)
- **Database**: MongoDB Atlas (already configured)

---

## 🎯 STEP 1: Deploy Backend on Render

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Connect your GitHub repository

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure as follows:
   - **Name**: `bangladeshi-supershop-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 1.3 Set Environment Variables
In Render dashboard, go to **Environment** section and add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024_minimum_32_characters_long
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-name.vercel.app
ALLOWED_ORIGINS=https://your-frontend-name.vercel.app
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**⚠️ IMPORTANT**: Leave `FRONTEND_URL` blank for now - you'll update it after deploying frontend!

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (2-5 minutes)
3. Copy your backend URL: `https://bangladeshi-supershop-backend.onrender.com`

---

## 🎨 STEP 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Import your repository

### 2.2 Configure Project
1. Click **"Add New Project"**
2. Import your repository
3. Configure as follows:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.3 Set Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://bangladeshi-supershop-backend.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://bangladeshi-supershop-backend.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Replace** `bangladeshi-supershop-backend` with your actual Render backend name!

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Get your frontend URL: `https://your-project.vercel.app`

---

## 🔄 STEP 3: Update Backend with Frontend URL

### 3.1 Update Render Environment Variables
1. Go back to Render dashboard
2. Navigate to your backend service
3. Go to **Environment** section
4. Update these variables:

```
FRONTEND_URL=https://your-project.vercel.app
ALLOWED_ORIGINS=https://your-project.vercel.app,https://your-project-*.vercel.app
```

**Replace with your actual Vercel URL!**

### 3.2 Trigger Redeploy
1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for deployment to complete

---

## ✅ STEP 4: Verify Everything Works

### 4.1 Test Backend Health
Open in browser:
```
https://bangladeshi-supershop-backend.onrender.com/api/health
```

Should see: `{"success":true,"message":"Server is running"}`

### 4.2 Test Frontend
1. Open your Vercel URL: `https://your-project.vercel.app`
2. Browse products - should load from backend
3. Try to register/login - should work
4. Add items to cart - should work

### 4.3 Test API Connection
Open browser console on your frontend and check for:
- ✅ No CORS errors
- ✅ API calls succeed
- ✅ Products load properly

---

## 🔧 Local Development Setup

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

Make sure your `.env` files point to:
- Backend `.env`: `FRONTEND_URL=http://localhost:3000`
- Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

---

## 🐛 Troubleshooting

### CORS Errors
**Problem**: Frontend shows CORS error when calling API

**Solution**:
1. Check backend environment variable `FRONTEND_URL` matches your Vercel URL exactly
2. Ensure `ALLOWED_ORIGINS` includes your Vercel URL
3. Redeploy backend after updating environment variables

### API Not Connecting
**Problem**: Frontend can't reach backend

**Solution**:
1. Verify backend is running: `https://your-backend.onrender.com/api/health`
2. Check frontend `.env` variables have correct backend URL
3. Ensure no typos in URLs
4. Redeploy frontend after updating environment variables

### Products Not Loading
**Problem**: Homepage shows empty or products don't appear

**Solution**:
1. Check MongoDB connection in backend logs
2. Verify products exist in database
3. Run seed script if needed: `npm run seed:pro`
4. Check browser console for errors

### Authentication Issues
**Problem**: Can't login or register

**Solution**:
1. Verify JWT_SECRET is set in backend environment
2. Check that cookies are enabled
3. Ensure CORS credentials: true is working
4. Clear browser cache and cookies

---

## 📊 Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 🎉 Success Checklist

- [ ] Backend deployed on Render
- [ ] Backend health endpoint responds
- [ ] Frontend deployed on Vercel
- [ ] Frontend loads without errors
- [ ] Products display correctly
- [ ] User registration works
- [ ] User login works
- [ ] Cart functionality works
- [ ] No CORS errors in console
- [ ] Images load properly

---

## 🚀 Alternative Platforms

### Backend Alternatives
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io
- **Heroku**: https://heroku.com

### Frontend Alternatives
- **Netlify**: https://netlify.com
- **Cloudflare Pages**: https://pages.cloudflare.com
- **AWS Amplify**: https://aws.amazon.com/amplify

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs in Render dashboard
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

---

## 🔒 Security Notes

1. **Never commit `.env` files** - they contain secrets!
2. Change JWT_SECRET in production
3. Use app-specific passwords for email
4. Enable MongoDB IP whitelist (or use 0.0.0.0/0 for cloud deployments)
5. Use HTTPS only in production

---

**Deployment Status**: Ready for Production ✅
**Last Updated**: 2025-11-29
