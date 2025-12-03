# 🚀 DEPLOYMENT GUIDE - Netlify + Heroku

## ✅ Configuration Files Created
- `netlify.toml` - Netlify frontend config
- `Procfile` - Heroku backend config  
- `app.json` - Heroku environment variables
- Backend CORS updated for Netlify domains

---

## 📦 FRONTEND - Deploy to Netlify

### Option 1: Import from GitHub (Recommended)
1. **Go to:** https://app.netlify.com/start
2. Click **"Import from Git"** → **GitHub**
3. Select: `Professional-Bangladeshi-Supershop-Website`
4. **Build settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`
5. **Environment variables:**
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-app.herokuapp.com/api`
   - (You'll update this after deploying backend)
6. Click **"Deploy site"**

### Option 2: Drag & Drop
1. Build locally: `cd frontend && npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `.next` folder
4. Add environment variable after upload

---

## 🔧 BACKEND - Deploy to Heroku

### Option 1: One-Click Deploy
1. **Click this button** (or go to opened tab):
   [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?template=https://github.com/sif1t/Professional-Bangladeshi-Supershop-Website)

2. **Fill in environment variables:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supershop
   JWT_SECRET=run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   FRONTEND_URL=https://your-site.netlify.app
   ```

3. Click **"Deploy app"**

### Option 2: Heroku CLI
```bash
# Install Heroku CLI first
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create bangladeshi-supershop-api

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASSWORD=your_password
heroku config:set FRONTEND_URL=https://your-site.netlify.app

# Deploy
git push heroku main
```

---

## 🔗 Connect Frontend to Backend

After both are deployed:

1. **Copy Heroku backend URL:**
   ```
   https://bangladeshi-supershop-api.herokuapp.com
   ```

2. **Update Netlify environment variable:**
   - Go to: Site settings → Environment variables
   - Update `NEXT_PUBLIC_API_URL` to: `https://bangladeshi-supershop-api.herokuapp.com/api`
   - Trigger redeploy

3. **Update Heroku FRONTEND_URL:**
   - Copy your Netlify URL (e.g., `https://bangladeshi-supershop.netlify.app`)
   - Go to Heroku → Settings → Config Vars
   - Update `FRONTEND_URL` to your Netlify URL

---

## 🎯 Your Live URLs

**Frontend (Netlify):**
```
https://your-site.netlify.app
```

**Backend (Heroku):**
```
https://your-app.herokuapp.com
```

**API Health Check:**
```
https://your-app.herokuapp.com/api/health
```

---

## ✅ Quick Checklist

### Before Deployment:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access: 0.0.0.0/0 allowed
- [ ] Gmail 2-Step Verification enabled
- [ ] Gmail App Password generated
- [ ] Code pushed to GitHub

### Netlify Deployment:
- [ ] Import from GitHub
- [ ] Set base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/.next`
- [ ] Add `NEXT_PUBLIC_API_URL` (temporary value first)
- [ ] Deploy successful

### Heroku Deployment:
- [ ] Create app from GitHub
- [ ] Add all environment variables
- [ ] Deploy successful
- [ ] Copy Heroku app URL

### Connect Services:
- [ ] Update `NEXT_PUBLIC_API_URL` in Netlify
- [ ] Update `FRONTEND_URL` in Heroku
- [ ] Redeploy both services
- [ ] Test registration flow
- [ ] Test OTP verification

---

## 🐛 Troubleshooting

**Netlify build fails:**
- Check base directory is set to `frontend`
- Verify build command: `npm run build`
- Check Node version (should be 18+)

**Heroku build fails:**
- Check `Procfile` exists in root
- Verify `backend/package.json` has start script
- Check Heroku logs: `heroku logs --tail`

**CORS errors:**
- Verify `FRONTEND_URL` in Heroku matches Netlify URL exactly
- Check `NEXT_PUBLIC_API_URL` in Netlify has `/api` suffix
- Redeploy both after updating

**API calls fail:**
- Test health endpoint: `https://your-app.herokuapp.com/api/health`
- Check Heroku logs for errors
- Verify MongoDB connection string is correct

---

## 💰 Cost

**Netlify Free Tier:**
- 100 GB bandwidth/month
- Unlimited sites
- Automatic SSL
- **Cost: $0**

**Heroku Free Tier (Eco Dynos):**
- 1000 dyno hours/month
- Sleeps after 30 min inactivity
- **Cost: $5/month** (replaces old free tier)
- Or use **Render** free tier instead

---

## 🎉 You're Done!

Both services will auto-deploy on every GitHub push!

**Test your live site and start selling!** 🛒🇧🇩
