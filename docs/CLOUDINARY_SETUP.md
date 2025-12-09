# 🖼️ Cloudinary Setup Guide for Image Uploads

## Why Cloudinary?
- ✅ **Free tier**: 25GB storage + 25GB bandwidth/month
- ✅ **Permanent storage**: Images never get deleted
- ✅ **CDN**: Fast image delivery worldwide
- ✅ **Auto-optimization**: Automatic format conversion and compression

## Setup Steps (5 minutes)

### 1. Create Free Cloudinary Account
1. Go to: https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email

### 2. Get Your Credentials
1. After login, go to **Dashboard**
2. You'll see:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "👁️ Show" to reveal)

### 3. Add to Backend .env File
Open `backend/.env` and replace these lines:

```env
# Cloudinary (For image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWx
```

### 4. Add to Render Environment Variables
1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your **backend service**
3. Go to **Environment** tab
4. Add these three variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
5. Click **Save Changes** (Render will auto-redeploy)

### 5. Test the Upload
1. Wait for Render to finish deploying (~2 minutes)
2. Go to your admin panel: https://bd-supershop.vercel.app/admin/add-product
3. Try uploading an image from your computer
4. ✅ You should see the image appear instantly!

## Features After Setup

### ✨ What Works Now:
1. **Local file upload** - Upload from your computer ✅
2. **Image URL** - Paste any image URL (Unsplash, etc.) ✅
3. **Multiple images** - Add many images at once ✅
4. **Permanent storage** - Images never disappear ✅
5. **Fast loading** - CDN delivers images quickly ✅
6. **Auto-optimization** - Images compressed automatically ✅

### 📁 Where Images Are Stored:
- Cloudinary folder: `bd-supershop/products/`
- All product images organized automatically
- View in Cloudinary Dashboard → Media Library

### 🎯 Image Quality:
- Max width/height: 1000px
- Auto format: WebP for modern browsers
- Quality: Auto (optimal balance)
- Max file size: 10MB per upload

## Troubleshooting

### ❌ Upload fails with "Failed to upload to Cloudinary"
**Solution:** Check your credentials in Render environment variables

### ❌ "demo" in error message
**Solution:** You forgot to set environment variables on Render

### ❌ Upload works locally but not on live site
**Solution:** Make sure you added env vars to BOTH:
- Local `backend/.env` file (for local testing)
- Render environment variables (for production)

## Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25 credits/month
- **Images**: Unlimited uploads

Perfect for your shop! Even with 1000 products × 4 images = 4000 images, you'll use only ~2-4GB.

## Next Steps
After setup completes:
1. ✅ Upload test image
2. ✅ Verify it appears in product
3. ✅ Check Cloudinary dashboard
4. 🎉 Start adding real products!

---

**Need help?** Check Cloudinary logs in Render dashboard → Logs tab
