# ⚡ Quick Deployment Reference Card

## 🎯 Your Mission: Deploy in 25 Minutes

---

## 📋 Before You Start

✅ Code is ready (no changes needed)  
✅ Get Gmail App Password: https://myaccount.google.com/apppasswords  
✅ Have GitHub account ready  
✅ Have Render account ready (sign up with GitHub)  
✅ Have Vercel account ready (sign up with GitHub)

---

## 🚀 The 5-Step Process

### Step 1: Push to GitHub (5 min)

```powershell
cd "d:\projects\Professional Bangladeshi Supershop Website"
git init
git add .
git commit -m "Production-ready deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bangladeshi-supershop.git
git push -u origin main
```

✅ Verify: Check GitHub that all files are pushed

---

### Step 2: Deploy Backend to Render (10 min)

1. Go to: https://dashboard.render.com/
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - Name: `bangladeshi-supershop-api`
   - Region: `Singapore`
   - Branch: `main`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=bangladeshi_supershop_jwt_secret_xyz789
   JWT_EXPIRE=7d
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   FRONTEND_URL=https://temporary.vercel.app
   ```
7. Click "Create Web Service"
8. Wait for deployment
9. Copy your Render URL (e.g., `https://bangladeshi-supershop-api.onrender.com`)

✅ Test: Visit `https://YOUR-RENDER-URL.onrender.com/api/health`

---

### Step 3: Deploy Frontend to Vercel (5 min)

1. Go to: https://vercel.com/dashboard
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your repository
5. Configure:
   - Framework: `Next.js`
   - Root Directory: `frontend`
6. Add Environment Variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://YOUR-RENDER-URL.onrender.com/api`
7. Click "Deploy"
8. Wait for deployment
9. Copy your Vercel URL (e.g., `https://bangladeshi-supershop.vercel.app`)

✅ Test: Visit your Vercel URL

---

### Step 4: Connect Frontend & Backend (2 min)

1. Go back to Render Dashboard
2. Click your Web Service
3. Click "Environment" tab
4. Edit `FRONTEND_URL`
5. Change to your actual Vercel URL (e.g., `https://bangladeshi-supershop.vercel.app`)
6. Click "Save Changes"
7. Backend redeploys automatically (wait 2-3 min)

---

### Step 5: Test Everything (3 min)

1. Visit your Vercel URL
2. Click "Register"
3. Fill form:
   - Name: Test User
   - Email: your-email@gmail.com
   - Mobile: 01712345678
   - Password: test123
4. Check email for OTP
5. Enter OTP and verify
6. Should redirect to homepage logged in

✅ **SUCCESS!** Your site is live!

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Render Dashboard | https://dashboard.render.com/ | Backend deployment |
| Vercel Dashboard | https://vercel.com/dashboard | Frontend deployment |
| Gmail App Password | https://myaccount.google.com/apppasswords | Get email password |
| MongoDB Atlas | https://cloud.mongodb.com/ | Database management |

---

## 🐛 Quick Troubleshooting

### CORS Error
**Fix**: FRONTEND_URL in Render must match Vercel URL exactly (no trailing slash)

### Email Not Received
**Fix**: Use Gmail App Password, not regular password. Check spam folder.

### Network Error
**Fix**: NEXT_PUBLIC_API_URL in Vercel must end with `/api`

### Build Failed
**Fix**: Check logs in Render/Vercel dashboard for specific error

---

## 📱 After Deployment

**Your URLs**:
- Frontend: `https://YOUR-PROJECT.vercel.app`
- Backend: `https://YOUR-PROJECT.onrender.com`
- API: `https://YOUR-PROJECT.onrender.com/api`

**Save these URLs!**

---

## 💡 Optional Next Steps

1. Add custom domain in Vercel
2. Enable SMS gateway (SSL Wireless)
3. Add more products in admin
4. Configure payment gateway (bKash/Nagad)
5. Enable MongoDB backups

---

## 📚 Need More Help?

- **Simple Guide**: `DEPLOY_NOW_SIMPLE.md`
- **Detailed Guide**: `PRODUCTION_DEPLOYMENT.md`
- **Checklist**: `PRE_DEPLOYMENT_CHECKLIST.md`
- **Status**: `DEPLOYMENT_STATUS.md`

---

## ⏱️ Time Breakdown

| Step | Time | Description |
|------|------|-------------|
| 1. GitHub | 5 min | Push code |
| 2. Render | 10 min | Deploy backend |
| 3. Vercel | 5 min | Deploy frontend |
| 4. Connect | 2 min | Update URLs |
| 5. Test | 3 min | Verify works |
| **TOTAL** | **25 min** | **Site is live!** |

---

**Status**: READY TO DEPLOY ✅

**Start now**: Step 1 - Push to GitHub

🚀 **Let's go!**
