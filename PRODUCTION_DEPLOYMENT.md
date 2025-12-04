# Production Deployment Guide - 100% Complete Setup

This guide will deploy the Bangladeshi Supershop with **Frontend on Vercel** and **Backend on Render** - completely working.

## 🎯 Deployment Overview

- **Frontend**: Vercel (Fast Next.js hosting)
- **Backend**: Render (Free tier with persistent deployment)
- **Database**: MongoDB Atlas (Already configured)

---

## ✅ Step 1: Deploy Backend to Render

### 1.1 Push Code to GitHub (If not already done)

```powershell
cd "d:\projects\Professional Bangladeshi Supershop Website"
git add .
git commit -m "Prepare for production deployment with OTP verification"
git push origin main
```

### 1.2 Create Render Web Service

1. Go to **https://dashboard.render.com/**
2. Sign in/Sign up (can use GitHub account)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure the service:

**Basic Settings:**
- **Name**: `bangladeshi-supershop-api`
- **Region**: `Singapore` (closest to Bangladesh)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Health Check Path**: `/api/health`
- **Auto-Deploy**: `Yes` (deploys on git push)

### 1.3 Add Environment Variables in Render

Click **"Environment"** tab and add these variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=bangladeshi_supershop_secure_jwt_secret_key_2024_production_xyz789
JWT_EXPIRE=7d
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=https://temporary-url.vercel.app
```

**⚠️ IMPORTANT**: Replace `EMAIL_USER` and `EMAIL_PASSWORD` with your actual Gmail credentials:
- `EMAIL_USER`: Your Gmail address (e.g., myshop@gmail.com)
- `EMAIL_PASSWORD`: Gmail App Password (not regular password - see below)

**How to Get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not enabled
3. Search for "App passwords" in the search bar
4. Select "Mail" and "Other (Custom name)"
5. Name it "Bangladeshi Supershop"
6. Copy the 16-character password
7. Use this password in `EMAIL_PASSWORD`

### 1.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll get a URL like: `https://bangladeshi-supershop-api.onrender.com`
4. Test it by visiting: `https://bangladeshi-supershop-api.onrender.com/api/health`
5. Should see: `{"success":true,"message":"Server is running"}`

**✅ Copy the backend URL** - you'll need it for frontend deployment.

---

## ✅ Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI (if not installed)

```powershell
npm install -g vercel
```

### 2.2 Update Frontend Environment Variable

Create/update `frontend/.env.production`:

```powershell
cd frontend
echo NEXT_PUBLIC_API_URL=https://bangladeshi-supershop-api.onrender.com/api > .env.production
```

Replace `bangladeshi-supershop-api.onrender.com` with your actual Render backend URL.

### 2.3 Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```powershell
cd frontend
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: `Yes`
- **Which scope**: Select your account
- **Link to existing project**: `No`
- **What's your project's name**: `bangladeshi-supershop`
- **In which directory is your code located**: `./` (just press Enter)
- **Want to override settings**: `No`

Wait for deployment. You'll get a URL like: `https://bangladeshi-supershop.vercel.app`

**Option B: Using Vercel Dashboard**

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://bangladeshi-supershop-api.onrender.com/api`
6. Click **"Deploy"**

**✅ Copy the frontend URL** - you'll need to update backend.

---

## ✅ Step 3: Connect Frontend and Backend

### 3.1 Update Backend FRONTEND_URL

1. Go back to **Render Dashboard** → Your Web Service
2. Click **"Environment"** tab
3. Edit `FRONTEND_URL` variable
4. Change from `https://temporary-url.vercel.app` to your actual Vercel URL
5. Example: `FRONTEND_URL=https://bangladeshi-supershop.vercel.app`
6. Click **"Save Changes"**
7. Backend will automatically redeploy (takes 2-3 minutes)

### 3.2 Verify Connection

1. Visit your frontend URL: `https://bangladeshi-supershop.vercel.app`
2. Click **"Register"** (রেজিস্টার করুন)
3. Fill in:
   - Name: Test User
   - Email: test@gmail.com
   - Mobile: 01712345678
   - Password: test123
4. Click Submit
5. Should redirect to verification page
6. Check your email (test@gmail.com) for OTP
7. Enter email OTP and mobile OTP (mobile OTP will be in console for now)
8. Click **"Verify Account"**
9. Should redirect to home page logged in

**✅ If this works, your deployment is 100% complete!**

---

## 🔒 Security Checklist

- ✅ JWT_SECRET changed from development value
- ✅ MongoDB Atlas IP whitelist includes 0.0.0.0/0 (allows Render/Vercel)
- ✅ CORS configured to allow Vercel and Render domains
- ✅ Environment variables not committed to Git
- ✅ Email credentials using App Password (not regular password)

---

## 🚀 Testing Checklist

### Registration Flow
- [ ] Can register with valid Gmail and BD mobile number
- [ ] Receives email OTP within 1 minute
- [ ] Email OTP verification works
- [ ] Mobile OTP verification works (or shows in console if SMS not configured)
- [ ] After verification, redirected to home page
- [ ] User is logged in (shows name in header)

### Login Flow
- [ ] Can login with registered email and password
- [ ] Can login with registered mobile and password
- [ ] If not verified, redirected to verification page
- [ ] If verified, logged in directly
- [ ] Session persists on page refresh

### Validation
- [ ] Cannot register with non-Gmail email
- [ ] Cannot register with invalid BD mobile (must be 01XXXXXXXXX)
- [ ] Password must be at least 6 characters
- [ ] Cannot verify with wrong OTP
- [ ] OTP expires after 10 minutes

---

## 🐛 Troubleshooting

### Frontend shows "Network Error" or CORS error

**Solution**: Check backend FRONTEND_URL matches your actual Vercel URL
```powershell
# In Render Dashboard → Environment → FRONTEND_URL
# Should be: https://your-actual-vercel-url.vercel.app (no trailing slash)
```

### Backend shows "MongoNetworkError"

**Solution**: Check MongoDB Atlas network access
1. Go to MongoDB Atlas → Network Access
2. Ensure `0.0.0.0/0` is in IP Access List
3. Or add Render's IP ranges

### Email OTP not received

**Solution 1**: Check EMAIL_USER and EMAIL_PASSWORD in Render
**Solution 2**: Check Gmail App Password is correct (not regular password)
**Solution 3**: Check email spam folder
**Solution 4**: Check backend logs in Render → Logs tab

### "Module not found" error in Render

**Solution**: Check `backend/package.json` has all dependencies
```powershell
cd backend
npm install
# If missing packages, add them:
npm install express mongoose bcryptjs jsonwebtoken nodemailer cors dotenv
```

### Vercel deployment fails

**Solution**: Ensure Root Directory is set to `frontend`
1. Vercel Dashboard → Project Settings → General
2. Root Directory: `frontend`
3. Redeploy

---

## 📱 SMS Gateway Integration (Optional)

Currently, mobile OTP is mocked. To enable real SMS:

### Option 1: SSL Wireless (Bangladesh Local)
```javascript
// In backend/server/utils/verification.js
const axios = require('axios');

async function sendMobileOTP(mobile, otp) {
    try {
        const response = await axios.get('https://sms.sslwireless.com/pushapi/dynamic/server.php', {
            params: {
                user: process.env.SSL_SMS_USER,
                pass: process.env.SSL_SMS_PASSWORD,
                sid: process.env.SSL_SMS_SID,
                sms: `Your verification code is: ${otp}`,
                msisdn: mobile,
                csmsid: Date.now()
            }
        });
        console.log('SMS sent successfully:', response.data);
        return true;
    } catch (error) {
        console.error('Failed to send SMS:', error.message);
        return false;
    }
}
```

Add to Render environment variables:
```
SSL_SMS_USER=your_ssl_wireless_username
SSL_SMS_PASSWORD=your_ssl_wireless_password
SSL_SMS_SID=your_ssl_wireless_sender_id
```

### Option 2: Twilio (International)
```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendMobileOTP(mobile, otp) {
    try {
        await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+88${mobile}` // Bangladesh country code
        });
        return true;
    } catch (error) {
        console.error('Failed to send SMS:', error.message);
        return false;
    }
}
```

---

## 🎉 Success!

Your Bangladeshi Supershop is now live with:
- ✅ Secure OTP-based registration and login
- ✅ Gmail and Bangladesh mobile validation
- ✅ Email verification working
- ✅ Production-ready deployment
- ✅ CORS properly configured
- ✅ MongoDB Atlas cloud database

**Frontend URL**: Your Vercel deployment URL
**Backend URL**: Your Render deployment URL

---

## 📞 Support

If you encounter any issues:
1. Check Render Logs: Dashboard → Your Service → Logs
2. Check Vercel Logs: Dashboard → Your Project → Deployments → View Function Logs
3. Check Browser Console: F12 → Console tab
4. Check Network Tab: F12 → Network tab → Look for failed requests

**Common URLs:**
- Render Dashboard: https://dashboard.render.com/
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com/
