# Deploy to Vercel - Complete Guide

This guide will help you deploy both the frontend and backend to Vercel in one unified deployment.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas cluster (free tier at https://cloud.mongodb.com)
3. GitHub account with this repository

## Step 1: Prepare MongoDB Atlas

1. Go to https://cloud.mongodb.com and create a free cluster
2. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Choose a username and strong password
   - Save credentials securely
3. Set up network access:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access From Anywhere" (0.0.0.0/0)
   - Confirm
4. Get your connection string:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `bangladeshi-supershop`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority`

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com and log in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variables (click "Environment Variables"):
   
   **Required Variables:**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
   JWT_EXPIRE=7d
   NODE_ENV=production
   PORT=3000
   ```
   
   **Optional Variables (for production features):**
   ```
   ALLOWED_ORIGINS=https://your-domain.vercel.app
   NEXT_PUBLIC_API_URL=/api
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   BKASH_APP_KEY=your_bkash_key
   BKASH_APP_SECRET=your_bkash_secret
   NAGAD_MERCHANT_ID=your_nagad_id
   NAGAD_MERCHANT_KEY=your_nagad_key
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_store_password
   ```

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? bangladeshi-supershop (or your choice)
# - Directory? ./ (just press Enter)
# - Override settings? No

# Add environment variables
vercel env add MONGODB_URI
# Paste your MongoDB connection string when prompted

vercel env add JWT_SECRET
# Enter a strong secret (at least 32 characters)

vercel env add JWT_EXPIRE
# Enter: 7d

vercel env add NODE_ENV
# Enter: production

# Deploy to production
vercel --prod
```

## Step 3: Verify Deployment

1. Once deployed, Vercel will provide a URL like: `https://your-project.vercel.app`

2. Test the API endpoint:
   - Visit: `https://your-project.vercel.app/api/health`
   - Should return: `{"success":true,"message":"Server is running on Vercel"}`

3. Test the frontend:
   - Visit: `https://your-project.vercel.app`
   - You should see the homepage

## Step 4: Seed Your Database (Optional)

You can seed your database with sample products using Vercel's deployment console:

1. Go to your Vercel project dashboard
2. Click on the deployment
3. Go to "Functions" tab
4. You'll need to run seed scripts locally and point to production DB:

```bash
# In your local project
# Temporarily update .env to use production MongoDB
MONGODB_URI=your_production_mongodb_uri npm run seed:pro
```

Or create an admin user:
```bash
MONGODB_URI=your_production_mongodb_uri npm run make-admin
```

## Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to update your DNS records
5. Update `NEXT_PUBLIC_SITE_URL` environment variable to your custom domain

## Important Notes

### File Uploads
- Vercel's serverless functions have ephemeral storage
- Uploaded images (payments, products) will be stored temporarily
- For production, consider using:
  - **Cloudinary** (recommended, free tier available)
  - **AWS S3**
  - **Vercel Blob Storage**

To set up Cloudinary:
1. Sign up at https://cloudinary.com
2. Get your credentials
3. Add to Vercel environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Environment Variables
- Never commit `.env` file to git (it's already in `.gitignore`)
- Always use Vercel's environment variables dashboard for secrets
- To update environment variables after deployment:
  1. Go to Project Settings → Environment Variables
  2. Update the value
  3. Redeploy (or it will update on next deployment)

### CORS
- The API is configured to allow requests from Vercel domains automatically
- If using a custom domain, add it to `ALLOWED_ORIGINS` environment variable

### Database Connection
- MongoDB Atlas free tier allows 512MB storage (plenty for testing)
- Ensure you've whitelisted `0.0.0.0/0` in Atlas network access
- For better security, use Vercel's IP ranges in production

## Troubleshooting

### API Not Working
- Check environment variables are set correctly in Vercel dashboard
- Verify MongoDB connection string is correct
- Check function logs in Vercel dashboard under "Deployments" → "Functions"

### Images Not Loading
- Check if upload directory exists: `public/uploads/`
- Verify static file serving in `api/index.js`
- Consider using Cloudinary for persistent storage

### Database Connection Errors
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user has read/write permissions
- Check connection string format

### CORS Errors
- Add your domain to `ALLOWED_ORIGINS` environment variable
- Format: `https://yourdomain.com,https://www.yourdomain.com`

## Monitoring

1. **Vercel Analytics**: Enable in project settings for traffic insights
2. **Function Logs**: View real-time logs in deployment details
3. **MongoDB Atlas**: Monitor database performance in Atlas dashboard

## Automatic Deployments

Once connected to GitHub:
- Push to main branch = automatic production deployment
- Push to other branches = preview deployments
- Pull requests = preview deployments with unique URLs

## Support

For issues:
1. Check Vercel function logs
2. Check MongoDB Atlas logs
3. Review environment variables
4. Test API endpoints directly

---

🎉 Your website is now live on Vercel!
