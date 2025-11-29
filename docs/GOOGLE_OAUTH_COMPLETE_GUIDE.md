# Complete Google OAuth Setup Guide - Step by Step

## 📋 Prerequisites
- Google account (Gmail)
- Access to Google Cloud Console
- Your project running locally (localhost:3000 for frontend, localhost:5000 for backend)

---

## Part 1: Getting Google OAuth Credentials

### Step 1: Access Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. You should see the Google Cloud Console dashboard

### Step 2: Create a New Project

1. Click on the **project dropdown** at the top of the page (next to "Google Cloud")
2. Click **"NEW PROJECT"** button in the top-right corner of the modal
3. Fill in the project details:
   - **Project name**: `Bangladeshi-Supershop` (or any name you prefer)
   - **Organization**: Leave as default (No organization)
   - **Location**: Leave as default
4. Click **"CREATE"** button
5. Wait for the project to be created (takes 10-30 seconds)
6. Once created, make sure your new project is selected in the project dropdown

### Step 3: Enable Google+ API (Required for OAuth)

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
   - Or use the search bar and search for "API Library"
2. In the API Library search box, type: **"Google+ API"**
3. Click on **"Google+ API"** from the results
4. Click the **"ENABLE"** button
5. Wait for it to enable (takes a few seconds)

**Alternative (Recommended):** Enable **"Google Identity Toolkit API"**
1. Search for **"Google Identity Toolkit API"** or **"Identity Platform"**
2. Click **"ENABLE"**

### Step 4: Configure OAuth Consent Screen

1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **User Type**:
   - Choose **"External"** (allows any Gmail user to sign in)
   - Click **"CREATE"**

3. **OAuth Consent Screen Configuration (Page 1: App Information)**

   Fill in the following fields:

   - **App name**: `Professional Bangladeshi Supershop`
   - **User support email**: Select your email from dropdown
   - **App logo**: (Optional) Upload your shop logo if you have one
   - **Application home page**: `http://localhost:3000` (for development)
   - **Application privacy policy link**: (Optional) Leave empty for now
   - **Application terms of service link**: (Optional) Leave empty for now
   - **Authorized domains**: 
     - For localhost: Leave empty OR add `localhost`
     - For production: Add your domain (e.g., `yourwebsite.com`)
   - **Developer contact information**: Enter your email address

   Click **"SAVE AND CONTINUE"**

4. **Scopes (Page 2: Optional)**
   - Click **"ADD OR REMOVE SCOPES"**
   - Select these scopes:
     - `/.../auth/userinfo.email`
     - `/.../auth/userinfo.profile`
     - `openid`
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

5. **Test Users (Page 3: Optional for Development)**
   - For development, you can add test Gmail accounts
   - Click **"ADD USERS"**
   - Enter Gmail addresses that will test your app
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

6. **Summary (Page 4)**
   - Review your settings
   - Click **"BACK TO DASHBOARD"**

### Step 5: Create OAuth 2.0 Client ID

1. In the left sidebar, go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** button at the top
3. Select **"OAuth client ID"** from the dropdown

4. **Configure OAuth Client:**

   - **Application type**: Select **"Web application"**
   
   - **Name**: `Bangladeshi Supershop Web Client` (or any name you prefer)
   
   - **Authorized JavaScript origins** - Click **"+ ADD URI"** and add:
     ```
     http://localhost:3000
     ```
     For production, also add:
     ```
     https://yourdomain.com
     ```
   
   - **Authorized redirect URIs** - Click **"+ ADD URI"** and add:
     ```
     http://localhost:3000
     ```
     For production, also add:
     ```
     https://yourdomain.com
     https://yourdomain.com/login
     https://yourdomain.com/register
     ```

5. Click **"CREATE"** button

### Step 6: Copy Your Credentials

1. A modal will appear showing:
   - **Your Client ID**: Something like `123456789-abc123def456.apps.googleusercontent.com`
   - **Your Client Secret**: You won't need this for frontend OAuth

2. **IMPORTANT**: Copy the **Client ID** (the long string ending in `.apps.googleusercontent.com`)

3. Click **"OK"** to close the modal

4. You can always find your credentials again by:
   - Going to **"APIs & Services"** → **"Credentials"**
   - Looking under **"OAuth 2.0 Client IDs"**
   - Clicking on your client name

---

## Part 2: Setting Up Environment Variables

### Step 1: Backend Environment Setup

1. Navigate to your backend folder:
   ```bash
   cd "D:\projects\Professional Bangladeshi Supershop Website\backend"
   ```

2. Create or edit the `.env` file:
   ```bash
   # If file doesn't exist
   notepad .env
   
   # Or use any text editor
   code .env
   ```

3. Add/Update these variables in `.env`:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # MongoDB Configuration (Your existing connection)
   MONGODB_URI=mongodb://localhost:27017/bangladeshi-supershop
   # OR if using MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   
   # JWT Configuration (Your existing secrets)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   
   # Google OAuth - ADD THIS LINE
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   
   # Payment Gateway (Your existing config)
   PAYMENT_GATEWAY_STORE_ID=your_store_id
   PAYMENT_GATEWAY_STORE_PASSWORD=your_store_password
   PAYMENT_GATEWAY_API_URL=https://sandbox.sslcommerz.com
   ```

4. **Replace** `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com` with your actual Client ID from Step 6 above

5. Save the file (Ctrl+S)

### Step 2: Frontend Environment Setup

1. Navigate to your frontend folder:
   ```bash
   cd "D:\projects\Professional Bangladeshi Supershop Website\frontend"
   ```

2. Create or edit the `.env.local` file:
   ```bash
   # If file doesn't exist
   notepad .env.local
   
   # Or use any text editor
   code .env.local
   ```

3. Add these variables in `.env.local`:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   
   # Google OAuth - ADD THIS LINE
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
   
   # Site Configuration
   NEXT_PUBLIC_SITE_NAME=Professional Bangladeshi Supershop
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Replace** `YOUR_CLIENT_ID_HERE.apps.googleusercontent.com` with your actual Client ID

5. Save the file (Ctrl+S)

### Step 3: Verify Your Configuration

**Backend `.env` should look like:**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

**Frontend `.env.local` should look like:**
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

**⚠️ IMPORTANT NOTES:**
- Both files should use the **SAME** Client ID
- Frontend variable must start with `NEXT_PUBLIC_`
- No spaces around the `=` sign
- No quotes around the value (unless the value has spaces)
- Make sure `.env` and `.env.local` are in `.gitignore` (don't commit them to Git)

---

## Part 3: Restart Your Servers

### Stop Current Servers (If Running)

1. In your terminals, press **Ctrl+C** to stop the servers

### Start Backend Server

```powershell
cd "D:\projects\Professional Bangladeshi Supershop Website\backend"
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

### Start Frontend Server (New Terminal)

```powershell
cd "D:\projects\Professional Bangladeshi Supershop Website\frontend"
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Part 4: Testing Your Setup

### Test 1: Check Environment Variables

**Backend Test:**
```javascript
// Temporarily add this to backend/server/index.js (remove after testing)
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Loaded' : '❌ Missing');
```

**Frontend Test:**
Open browser console (F12) and type:
```javascript
console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✅ Loaded' : '❌ Missing');
```

### Test 2: Visual Test

1. Open browser: **http://localhost:3000/login**
2. You should see a **"Continue with Google"** button
3. If the button appears, your Client ID is loaded correctly!

### Test 3: Full Authentication Test

1. Go to: **http://localhost:3000/register**
2. Click **"Sign up with Google"**
3. A Google popup should appear
4. Select your Gmail account
5. You should be redirected back and asked for a mobile number
6. Enter a valid BD mobile number: `01712345678`
7. Click **"Complete Registration"**
8. You should be logged in! ✅

---

## Part 5: Troubleshooting

### Issue 1: "Google Client ID not defined"

**Solution:**
- Check if `.env` and `.env.local` files exist
- Verify the Client ID is correctly pasted (no extra spaces)
- Restart both servers after adding environment variables
- Make sure the variable name is exactly: `GOOGLE_CLIENT_ID` (backend) and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (frontend)

### Issue 2: "Redirect URI mismatch" Error

**Solution:**
- Go to Google Cloud Console → Credentials
- Edit your OAuth Client
- Add authorized redirect URIs:
  - `http://localhost:3000`
  - `http://localhost:3000/login`
  - `http://localhost:3000/register`

### Issue 3: Google Button Not Appearing

**Solution:**
- Check browser console (F12) for errors
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in frontend `.env.local`
- Clear browser cache and reload
- Check if `@react-oauth/google` package is installed:
  ```bash
  cd frontend
  npm list @react-oauth/google
  ```

### Issue 4: "Invalid Gmail address" Error

**Solution:**
- Only Gmail addresses ending with `@gmail.com` are allowed
- Don't use `@yahoo.com`, `@outlook.com`, or other email providers

### Issue 5: "Invalid mobile number" Error

**Solution:**
- Use Bangladeshi mobile format: `01712345678`
- Must be 11 digits
- Must start with `01`
- No spaces, dashes, or country codes

---

## Part 6: Production Deployment Setup

### When Deploying to Production (Vercel/Netlify/etc.):

1. **Update Google Cloud Console:**
   - Go to Credentials → Edit your OAuth Client
   - Add production URLs to **Authorized JavaScript origins**:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Add production URLs to **Authorized redirect URIs**:
     ```
     https://yourdomain.com
     https://yourdomain.com/login
     https://yourdomain.com/register
     ```

2. **Update OAuth Consent Screen:**
   - Change **Application home page** to your production URL
   - Update **Authorized domains** to your production domain

3. **Set Environment Variables in Production:**
   - Add `GOOGLE_CLIENT_ID` to your backend hosting (Railway, Heroku, etc.)
   - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to your frontend hosting (Vercel, Netlify, etc.)

4. **Publish OAuth App (Optional):**
   - If you want any Gmail user to sign in (not just test users)
   - Go to OAuth Consent Screen → Click **"PUBLISH APP"**
   - Submit for verification (may take a few days)

---

## ✅ Checklist

- [ ] Created Google Cloud project
- [ ] Enabled Google+ API or Identity Platform
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Copied Client ID
- [ ] Added `GOOGLE_CLIENT_ID` to `backend/.env`
- [ ] Added `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `frontend/.env.local`
- [ ] Restarted backend server
- [ ] Restarted frontend server
- [ ] Google button appears on login page
- [ ] Successfully tested Google authentication
- [ ] Can register with Gmail + mobile number
- [ ] Can login with existing Google account

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the logs:**
   - Backend terminal for server errors
   - Browser console (F12) for frontend errors

2. **Verify file locations:**
   - Backend: `backend/.env` (not `.env.local`)
   - Frontend: `frontend/.env.local` (not `.env`)

3. **Common file content check:**
   ```bash
   # Backend
   cat backend/.env | grep GOOGLE
   
   # Frontend
   cat frontend/.env.local | grep GOOGLE
   ```

4. **Environment variable format:**
   ```env
   # ✅ Correct
   GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   
   # ❌ Wrong (has spaces)
   GOOGLE_CLIENT_ID = 123456789-abc.apps.googleusercontent.com
   
   # ❌ Wrong (has quotes)
   GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
   ```

---

## 🎉 Success!

Once everything is working:
- Users can register with Gmail
- Users can login with Google
- Both email and mobile number are validated
- Secure authentication is enabled

Your e-commerce platform now has professional-grade authentication! 🚀
