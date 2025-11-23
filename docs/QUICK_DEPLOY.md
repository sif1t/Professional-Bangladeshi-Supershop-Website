# 🚀 Quick Deploy to Vercel - 5 Minutes

## Step 1: Go to Vercel
👉 https://vercel.com → Sign in with GitHub

## Step 2: Import Project
- Click "Add New..." → "Project"
- Select: `Professional-Bangladeshi-Supershop-Website`
- Framework: Next.js (auto-detected)

## Step 3: Add Environment Variables
Click "Environment Variables" and add these:

```env
MONGODB_URI=mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024

JWT_EXPIRE=7d

NODE_ENV=production

NEXT_PUBLIC_API_URL=/api
```

✅ Check all boxes: Production, Preview, Development

## Step 4: Deploy
Click "Deploy" → Wait 2 minutes

## Step 5: Test
Visit: `https://your-project.vercel.app/api/test`
Should show: `"success": true`

## ✅ Done!
Your site is live at: `https://your-project.vercel.app`

---

## Need Help?
See `DEPLOY_NOW.md` for detailed guide.
