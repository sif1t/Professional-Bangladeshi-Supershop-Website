# 🚨 RENDER DEPLOYMENT MANUAL TRIGGER GUIDE

## Current Issue
The backend user management routes are returning 404 errors because Render needs to deploy the latest code.

## Solution Options

### Option 1: Manual Deploy from Render Dashboard (FASTEST - 2 minutes)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find your service**: `bangladeshi-supershop-api`
3. **Click "Manual Deploy"** button (top right)
4. **Select branch**: `main`
5. **Click "Deploy"**
6. **Wait 2-3 minutes** for deployment to complete
7. **Test**: Visit https://bangladeshi-supershop-api.onrender.com/api/health

### Option 2: Verify Auto-Deploy is Enabled

1. Go to your Render service settings
2. Check **"Auto-Deploy"** is set to **Yes**
3. Verify **"Branch"** is set to **main**
4. Check **GitHub connection** is active
5. If not connected, click **"Connect Repository"**

### Option 3: If Render Service Doesn't Exist Yet

If you haven't created the Render service yet:

1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Web Service"
3. **Connect**: Your GitHub repository
4. **Configure**:
   - Name: `bangladeshi-supershop-api`
   - Branch: `main`
   - Root Directory: (leave empty)
   - Build Command: `cd backend && npm ci`
   - Start Command: `cd backend && node server/index.js`
   - Health Check Path: `/api/health`

5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_password
   FRONTEND_URL=https://bd-supershop.vercel.app
   ```

6. **Click**: "Create Web Service"

### Option 4: Force Deploy via Git

If auto-deploy is not working, you can force it:

```bash
# Make a small change to trigger deployment
echo "# Deploy $(date)" >> backend/DEPLOYMENT_TIMESTAMP.txt
git add .
git commit -m "Force Render deployment"
git push origin main
```

## Verification

After deployment, verify these endpoints work:

1. **Health Check**:
   ```
   https://bangladeshi-supershop-api.onrender.com/api/health
   ```
   Should return: `{"success": true, "message": "Server is running"}`

2. **User Routes** (requires auth token):
   ```
   https://bangladeshi-supershop-api.onrender.com/api/admin/users
   ```
   Should return JSON (not 404)

3. **Stats Route**:
   ```
   https://bangladeshi-supershop-api.onrender.com/api/admin/users/stats/overview
   ```
   Should return user statistics

## Timeline

- **Manual Deploy**: 2-3 minutes
- **Auto Deploy (if enabled)**: 3-5 minutes after push
- **First Time Setup**: 5-10 minutes

## Still Not Working?

If after 10 minutes the routes still don't work:

1. **Check Render Logs**:
   - Go to your service → "Logs" tab
   - Look for errors during deployment
   - Check if server started successfully

2. **Check Environment Variables**:
   - Verify all required env vars are set
   - Especially `MONGODB_URI` and `JWT_SECRET`

3. **Verify render.yaml**:
   - The file is at the root of your repository
   - It has the correct configuration

## Contact

If you need help, check:
- Render Status: https://status.render.com
- Render Docs: https://render.com/docs
- MongoDB Atlas: Verify your cluster is running
