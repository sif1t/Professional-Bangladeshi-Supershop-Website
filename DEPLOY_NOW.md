# Complete Vercel Deployment Guide - Full Stack

Your project is ready to deploy! Follow these steps to get your full-stack application live on Vercel.

## Prerequisites ✅
- ✅ GitHub repository with your code
- ✅ MongoDB Atlas database
- ✅ Vercel account (free)

---

## Step 1: Deploy to Vercel (5 minutes)

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. **Import** your repository: `Professional-Bangladeshi-Supershop-Website`
5. Configure project:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (leave default)
   - Install Command: `npm install` (leave default)
6. **Don't deploy yet!** First, add environment variables below ⬇️

---

## Step 2: Add Environment Variables (CRITICAL!)

Click **"Environment Variables"** section and add each one:

### Required Variables:

**1. Database Connection:**
```
Name: MONGODB_URI
Value: mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority
Environment: Production, Preview, Development (check all)
```

**2. JWT Secret:**
```
Name: JWT_SECRET
Value: your_super_secret_jwt_key_change_this_in_production_2024
Environment: Production, Preview, Development (check all)
```

**3. JWT Expiration:**
```
Name: JWT_EXPIRE
Value: 7d
Environment: Production, Preview, Development (check all)
```

**4. Node Environment:**
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (check all)
```

**5. API URL (for frontend):**
```
Name: NEXT_PUBLIC_API_URL
Value: /api
Environment: Production, Preview, Development (check all)
```

### Optional Variables (for production features):

**6. Site URL** (add after first deployment):
```
Name: NEXT_PUBLIC_SITE_URL
Value: https://your-domain.vercel.app
Environment: Production, Preview, Development
```

**7. Payment Gateway Keys** (if using):
```
Name: BKASH_APP_KEY
Value: your_bkash_key
```
```
Name: BKASH_APP_SECRET
Value: your_bkash_secret
```
```
Name: SSLCOMMERZ_STORE_ID
Value: your_store_id
```
```
Name: SSLCOMMERZ_STORE_PASSWORD
Value: your_password
```

---

## Step 3: Deploy! 🚀

1. After adding all environment variables, click **"Deploy"**
2. Wait **2-3 minutes** for the build to complete
3. Vercel will give you a URL like: `https://your-project-name.vercel.app`

---

## Step 4: Verify Deployment

### Test these endpoints:

**1. Test API Health:**
```
Visit: https://your-project.vercel.app/api/test

Expected Response:
{
  "success": true,
  "message": "API is working!",
  "env": {
    "hasMongoUri": true,
    "hasJwtSecret": true,
    "nodeEnv": "production"
  }
}
```

**2. Test Categories API:**
```
Visit: https://your-project.vercel.app/api/categories/tree

Expected: JSON array of categories
```

**3. Test Frontend:**
```
Visit: https://your-project.vercel.app

Expected: Your homepage loads with products/categories
```

---

## Step 5: Update Site URL (After First Deploy)

1. Copy your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Go back to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL
4. **Redeploy** (Deployments tab → three dots → Redeploy)

---

## Step 6: Add Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your custom domain (e.g., `supershop.com`)
4. Follow Vercel's instructions to:
   - Add DNS records to your domain registrar
   - Wait for DNS propagation (5-60 minutes)
5. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
6. Redeploy

---

## What's Deployed:

### Frontend (Next.js):
✅ Homepage with product catalog
✅ Product detail pages
✅ Shopping cart
✅ Checkout system
✅ User authentication (login/register)
✅ User account dashboard
✅ Order tracking
✅ Admin panel

### Backend API (Serverless):
✅ `/api/auth/*` - Authentication endpoints
✅ `/api/products/*` - Product management
✅ `/api/categories/*` - Category management
✅ `/api/orders/*` - Order management
✅ `/api/payment/*` - Payment processing
✅ `/api/admin/*` - Admin operations
✅ `/api/upload/*` - File uploads

### Database:
✅ MongoDB Atlas (cloud)
✅ Automatic connection pooling
✅ Serverless-optimized

---

## Automatic Deployments

Once connected to GitHub:
- **Push to `main` branch** = Auto-deploy to production
- **Push to other branches** = Preview deployments
- **Pull requests** = Automatic preview URLs

---

## Troubleshooting

### If you see 404/405 errors:
❌ **Problem**: Environment variables not set
✅ **Solution**: Add all variables in Step 2, then redeploy

### If database connection fails:
❌ **Problem**: `MONGODB_URI` incorrect or MongoDB Atlas network access
✅ **Solution**: 
   - Verify connection string is correct
   - In MongoDB Atlas: Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)

### If images don't load:
❌ **Problem**: Vercel has ephemeral storage
✅ **Solution**: Use Cloudinary for persistent image storage (recommended for production)

### If API is slow:
❌ **Problem**: Cold starts on free tier
✅ **Solution**: Normal for serverless. Upgrade to Pro for faster cold starts.

---

## Monitor Your Deployment

### In Vercel Dashboard:

1. **Deployments**: View build logs and deployment history
2. **Analytics**: Traffic insights (Pro plan)
3. **Logs**: Real-time function logs
4. **Speed Insights**: Performance metrics

### In MongoDB Atlas:

1. **Metrics**: Database performance
2. **Logs**: Database queries
3. **Alerts**: Set up notifications

---

## Cost Breakdown

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Preview deployments
- ✅ GitHub integration

### Upgrade Needed For:
- Large traffic (>100GB bandwidth)
- More team members
- Advanced analytics
- Priority support

---

## Next Steps After Deployment

1. **Test all features**: Register, login, add products to cart, checkout
2. **Create admin user**: Run seed script or manually create in database
3. **Add products**: Use admin panel or bulk import
4. **Configure payment gateways**: Add real API keys for bKash, SSL Commerz
5. **Set up Cloudinary**: For persistent image storage
6. **Add monitoring**: Set up error tracking (Sentry, LogRocket)
7. **Optimize images**: Use Next.js Image optimization
8. **Add analytics**: Google Analytics, Facebook Pixel

---

## Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ MongoDB Atlas has IP whitelist configured
- ✅ Environment variables are set in Vercel (not committed to git)
- ✅ CORS is configured for your domain
- ✅ HTTPS is enabled (automatic on Vercel)
- ⬜ Rate limiting on API endpoints (consider adding)
- ⬜ Input validation on all forms (review)
- ⬜ SQL injection protection (using Mongoose)
- ⬜ XSS protection (React automatic)

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Your Project Repo**: https://github.com/sif1t/Professional-Bangladeshi-Supershop-Website

---

## 🎉 Your Website is Live!

Once deployed, share your link:
- **Live Site**: https://your-project.vercel.app
- **Admin Panel**: https://your-project.vercel.app/admin-login
- **API Docs**: https://your-project.vercel.app/api/test

**Congratulations! Your full-stack e-commerce platform is now live on Vercel! 🚀**
