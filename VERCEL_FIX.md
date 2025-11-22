# Quick Fix: Set Environment Variables in Vercel

Your API is now fixed and will work once you add the required environment variables in Vercel.

## Go to Vercel Dashboard Now

1. Open: https://vercel.com/dashboard
2. Click on your project: **professional-bangladeshi-supershop-gamma**
3. Go to **Settings** → **Environment Variables**

## Add These Variables

Click "Add New" for each:

### Required (MUST ADD):
```
MONGODB_URI
Value: mongodb+srv://bd-supeshop22:XK0tOEThXJmKOGJV@cluster0.zpcykbv.mongodb.net/bangladeshi-supershop?retryWrites=true&w=majority
Environment: Production, Preview, Development
```

```
JWT_SECRET
Value: your_super_secret_jwt_key_change_this_in_production_2024
Environment: Production, Preview, Development
```

```
JWT_EXPIRE
Value: 7d
Environment: Production, Preview, Development
```

```
NODE_ENV
Value: production
Environment: Production, Preview, Development
```

### Optional (can add later):
```
ALLOWED_ORIGINS
Value: https://professional-bangladeshi-supershop-gamma.vercel.app
```

```
NEXT_PUBLIC_SITE_URL
Value: https://professional-bangladeshi-supershop-gamma.vercel.app
```

```
NEXT_PUBLIC_API_URL
Value: /api
```

## After Adding Variables

1. Click **Save** for each variable
2. Go to **Deployments** tab
3. Click the **three dots (...)** on the latest deployment
4. Click **Redeploy**
5. Wait 1-2 minutes

## Your site will be live at:
https://professional-bangladeshi-supershop-gamma.vercel.app

✅ The 404 errors will be gone after you add the environment variables and redeploy!
