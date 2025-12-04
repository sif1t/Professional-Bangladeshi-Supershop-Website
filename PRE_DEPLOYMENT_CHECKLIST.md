# ✅ Pre-Deployment Checklist

## System Status: READY FOR DEPLOYMENT ✅

---

## Backend Status ✅

- [x] **CORS Configuration**: Updated to allow Vercel, Netlify, Render domains
- [x] **Health Check Endpoint**: `/api/health` available
- [x] **MongoDB Connection**: Atlas connection string configured
- [x] **Authentication Routes**: Register, Login, Verify, Resend OTP
- [x] **OTP System**: Email and Mobile OTP generation and verification
- [x] **JWT Authentication**: Token-based auth with 7-day expiration
- [x] **Environment Variables**: Template ready for production
- [x] **Render Configuration**: `render.yaml` configured
- [x] **Port Configuration**: Uses PORT from environment (default 5000)

**Backend Files Ready:**
- ✅ `backend/server/index.js` - Main server file
- ✅ `backend/server/routes/auth.js` - Authentication routes
- ✅ `backend/server/models/User.js` - User model with verification fields
- ✅ `backend/server/utils/verification.js` - OTP utilities
- ✅ `backend/server/config/db.js` - MongoDB connection
- ✅ `backend/package.json` - Dependencies and scripts

---

## Frontend Status ✅

- [x] **Next.js Configuration**: `next.config.js` properly set
- [x] **API Client**: Axios configured for backend calls
- [x] **Authentication Context**: Register, Login, Verify, Resend OTP functions
- [x] **Verification Page**: OTP input with countdown timer
- [x] **Validation**: Gmail-only and BD mobile number validation
- [x] **Environment Variables**: Production template created
- [x] **Vercel Configuration**: `vercel.json` configured
- [x] **Build Ready**: No build errors

**Frontend Files Ready:**
- ✅ `frontend/pages/register.js` - Registration page
- ✅ `frontend/pages/login.js` - Login page
- ✅ `frontend/pages/verify.js` - OTP verification page
- ✅ `frontend/context/AuthContext.js` - Auth state management
- ✅ `frontend/.env.production` - Production API URL template
- ✅ `frontend/package.json` - Dependencies and scripts

---

## Database Status ✅

- [x] **MongoDB Atlas**: Cluster active and accessible
- [x] **Connection String**: `mongodb+srv://bd-supeshop22:***@cluster0.zpcykbv.mongodb.net/`
- [x] **Database Name**: `bangladeshi-supershop`
- [x] **Network Access**: Allows all IPs (0.0.0.0/0)
- [x] **User Model Schema**: Includes emailVerified, mobileVerified, OTP fields

---

## Deployment Configuration Status ✅

**Render (Backend):**
- [x] `render.yaml` created
- [x] Root directory: `backend`
- [x] Region: Singapore
- [x] Health check path configured
- [x] Environment variables defined

**Vercel (Frontend):**
- [x] `vercel.json` created
- [x] Root directory: `frontend`
- [x] Output directory: `.next`
- [x] Build command configured

---

## Required Before Deployment ⚠️

### 1. GitHub Repository
- [ ] Create GitHub repository
- [ ] Push code to main branch
- [ ] Verify all files pushed correctly

### 2. Gmail App Password (for Email OTP)
- [ ] Go to https://myaccount.google.com/security
- [ ] Enable 2-Step Verification
- [ ] Generate App Password
- [ ] Save the 16-character password

### 3. Environment Variables for Render
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=[Generate new random 32+ character string]
JWT_EXPIRE=7d
EMAIL_USER=[Your Gmail address]
EMAIL_PASSWORD=[Your Gmail App Password]
FRONTEND_URL=[Will update after Vercel deployment]
```

### 4. Environment Variable for Vercel
```
NEXT_PUBLIC_API_URL=[Your Render backend URL]/api
```

---

## Deployment Order

### Step 1: Push to GitHub ⏰ 5 minutes
```powershell
git init
git add .
git commit -m "Production-ready deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bangladeshi-supershop.git
git push -u origin main
```

### Step 2: Deploy Backend to Render ⏰ 10 minutes
1. Sign in to Render with GitHub
2. Create Web Service from repository
3. Configure backend directory and commands
4. Add all environment variables
5. Deploy and get backend URL

### Step 3: Deploy Frontend to Vercel ⏰ 5 minutes
1. Sign in to Vercel with GitHub
2. Import repository
3. Configure frontend directory
4. Add NEXT_PUBLIC_API_URL environment variable
5. Deploy and get frontend URL

### Step 4: Connect Services ⏰ 2 minutes
1. Update FRONTEND_URL in Render
2. Backend redeploys automatically
3. Test full registration and login flow

**Total Time: ~25 minutes**

---

## Testing Checklist (After Deployment)

### Health Check
- [ ] Backend: `https://YOUR-RENDER-URL.onrender.com/api/health`
  - Should return: `{"success":true,"message":"Server is running"}`

### Frontend Access
- [ ] Frontend: `https://YOUR-VERCEL-URL.vercel.app`
  - Should load homepage

### Registration Flow
- [ ] Can access registration page
- [ ] Can submit form with valid Gmail and BD mobile
- [ ] Redirects to verification page
- [ ] Receives email OTP (check inbox/spam)
- [ ] Can enter OTPs
- [ ] Can verify and login
- [ ] Redirects to homepage logged in

### Login Flow
- [ ] Can access login page
- [ ] Can login with email/password
- [ ] Can login with mobile/password
- [ ] Redirects correctly based on verification status

### Validation
- [ ] Cannot register with non-Gmail email
- [ ] Cannot register with invalid mobile format
- [ ] Password requires minimum 6 characters
- [ ] Cannot verify with wrong OTP

---

## Troubleshooting Guide

### Issue: CORS Error in Browser
**Solution**: 
1. Check FRONTEND_URL in Render matches Vercel URL exactly
2. No trailing slash in FRONTEND_URL
3. Redeploy backend after changing

### Issue: Email OTP Not Received
**Solution**:
1. Check EMAIL_USER and EMAIL_PASSWORD in Render
2. Must use App Password, not regular Gmail password
3. Check spam folder
4. Check Render logs for errors

### Issue: "Network Error" in Frontend
**Solution**:
1. Check NEXT_PUBLIC_API_URL in Vercel
2. Should be: `https://YOUR-RENDER-URL.onrender.com/api`
3. Must include `/api` at the end
4. Redeploy frontend after changing

### Issue: MongoDB Connection Error
**Solution**:
1. Verify MONGODB_URI includes `appName=Cluster0`
2. Check MongoDB Atlas network access allows 0.0.0.0/0
3. Check Render logs for exact error

---

## Documentation Files

- 📘 **DEPLOY_NOW_SIMPLE.md** - Quick 3-step deployment guide
- 📗 **PRODUCTION_DEPLOYMENT.md** - Comprehensive deployment guide with troubleshooting
- 📙 **PRE_DEPLOYMENT_CHECKLIST.md** - This file

---

## Security Reminders

- ⚠️ Never commit `.env` files to Git
- ⚠️ Use different JWT_SECRET for production
- ⚠️ Use Gmail App Password, not regular password
- ⚠️ Keep MongoDB credentials secure
- ⚠️ Enable MongoDB Atlas IP whitelist if needed for extra security

---

## Post-Deployment Tasks (Optional)

1. **Custom Domain**: Add custom domain in Vercel
2. **SSL Certificate**: Automatic with Vercel and Render
3. **SMS Gateway**: Integrate SSL Wireless or Twilio
4. **Monitoring**: Set up Render alerts and Vercel analytics
5. **Backup**: Enable MongoDB Atlas backups
6. **CDN**: Vercel provides automatic CDN
7. **Error Tracking**: Add Sentry or similar service

---

## Support Links

- 🔗 Render Dashboard: https://dashboard.render.com/
- 🔗 Vercel Dashboard: https://vercel.com/dashboard
- 🔗 MongoDB Atlas: https://cloud.mongodb.com/
- 🔗 Gmail App Passwords: https://myaccount.google.com/apppasswords

---

## Ready to Deploy? ✅

If all items above are checked:

1. Read **DEPLOY_NOW_SIMPLE.md** for step-by-step instructions
2. Follow the 4 deployment steps in order
3. Test thoroughly after deployment
4. Celebrate! 🎉

Your Professional Bangladeshi Supershop will be live in ~25 minutes!
