# 🌍 Environment Configuration Guide

## Overview
This document explains how to configure environment variables for separate frontend and backend deployment.

---

## 📁 File Structure

```
project-root/
├── backend/
│   ├── .env                    # Backend environment variables
│   ├── .env.example           # Backend environment template
│   └── render.yaml            # Render deployment config
└── frontend/
    ├── .env.local             # Frontend environment variables
    ├── .env.local.example     # Frontend environment template
    ├── vercel.json            # Vercel deployment config
    └── netlify.toml           # Netlify deployment config (alternative)
```

---

## 🔧 Backend Environment Variables

### File: `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# CORS Configuration (IMPORTANT for separate deployment!)
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Email (Optional - for order notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Production Settings (Render/Railway/Heroku)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://... (your Atlas connection)
JWT_SECRET=... (generate new strong secret)
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend-*.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 🎨 Frontend Environment Variables

### File: `frontend/.env.local`

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Production Settings (Vercel/Netlify)

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 🔄 Environment Variable Flow

### Local Development
```
Frontend (localhost:3000) 
    ↓ NEXT_PUBLIC_API_URL
Backend (localhost:5000)
    ↓ MONGODB_URI
MongoDB Atlas
```

### Production
```
Frontend (Vercel) 
    ↓ NEXT_PUBLIC_API_URL
Backend (Render)
    ↓ MONGODB_URI
MongoDB Atlas
```

---

## 🛠️ How to Set Up

### 1. Local Development

#### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env and add your values
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local and add your values
npm install
npm run dev
```

### 2. Production Deployment

#### Step 1: Deploy Backend
1. Deploy backend to Render/Railway
2. Get backend URL: `https://your-app.onrender.com`
3. Set environment variables in platform dashboard

#### Step 2: Deploy Frontend
1. Update frontend `.env.local` with backend URL
2. Deploy frontend to Vercel
3. Get frontend URL: `https://your-app.vercel.app`

#### Step 3: Update Backend
1. Update backend `FRONTEND_URL` with Vercel URL
2. Redeploy backend

---

## 🔐 Security Best Practices

### ✅ DO:
- Use strong JWT_SECRET (32+ characters)
- Use app-specific passwords for email
- Keep .env files in .gitignore
- Use different secrets for dev/production
- Rotate secrets regularly

### ❌ DON'T:
- Commit .env files to git
- Share secrets in code or screenshots
- Use simple/weak JWT secrets
- Reuse passwords across services
- Expose API keys in frontend code

---

## 📋 Environment Variable Checklist

### Required for Backend
- [x] MONGODB_URI
- [x] JWT_SECRET
- [x] FRONTEND_URL
- [ ] EMAIL_USER (optional)
- [ ] EMAIL_PASSWORD (optional)

### Required for Frontend
- [x] NEXT_PUBLIC_API_URL
- [x] NEXT_PUBLIC_BACKEND_URL
- [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID (optional)

---

## 🐛 Troubleshooting

### CORS Errors
**Problem**: Frontend can't access backend API

**Check**:
1. `FRONTEND_URL` in backend matches your frontend URL exactly
2. `ALLOWED_ORIGINS` includes your frontend URL
3. Backend has been redeployed after updating env vars

### API Connection Failed
**Problem**: Frontend shows connection errors

**Check**:
1. `NEXT_PUBLIC_API_URL` points to correct backend URL
2. Backend is running and accessible
3. Backend health endpoint responds: `/api/health`

### Environment Variables Not Working
**Problem**: Changes don't take effect

**Solution**:
1. Restart development server
2. Clear Next.js cache: `rm -rf .next`
3. Redeploy on hosting platform
4. Check variable names (typos)

---

## 🔍 Testing Environment Variables

### Backend Test
```bash
cd backend
node -e "require('dotenv').config(); console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET')"
```

### Frontend Test
```bash
cd frontend
npm run build
# Check build output for env variables
```

### Browser Console Test (Frontend)
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
// Should show your backend URL
```

---

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Last Updated**: 2025-11-29
