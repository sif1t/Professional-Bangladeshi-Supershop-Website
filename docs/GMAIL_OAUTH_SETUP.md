# Gmail OAuth Authentication Setup Guide

## Overview
This guide explains how to set up Gmail authentication for the Bangladeshi Supershop website. Users can now:
- Login with Gmail (Google OAuth)
- Register with Gmail + valid mobile number
- Login with email and password
- Login with mobile and password

## ✅ Changes Made

### Backend Changes
1. **User Model Updated** (`backend/server/models/User.js`)
   - Added `email` field (required, Gmail only)
   - Added `googleId` field for OAuth users
   - Added `avatar` field for profile pictures
   - Made `password` optional for OAuth users

2. **Auth Routes Updated** (`backend/server/routes/auth.js`)
   - Added email and mobile validation
   - Added `/api/auth/google` endpoint for OAuth
   - Added `/api/auth/google/complete` for OAuth registration with mobile
   - Updated login to support both email and mobile
   - Updated registration to require email

3. **Packages Installed**
   - `google-auth-library` - For verifying Google tokens
   - `passport`, `passport-google-oauth20`, `express-session` - For OAuth support

### Frontend Changes
1. **Auth Context Updated** (`frontend/context/AuthContext.js`)
   - Added `googleLogin()` function
   - Added `completeGoogleRegistration()` function
   - Updated `register()` to accept email
   - Updated `login()` to accept email or mobile

2. **Login Page Updated** (`frontend/pages/login.js`)
   - Added Google Login button
   - Added toggle between mobile and email login
   - Added email validation
   - Added mobile input flow for new Google users

3. **Registration Page Updated** (`frontend/pages/register.js`)
   - Added Google Sign Up button
   - Added email field (Gmail only)
   - Added email validation
   - Added mobile input flow for new Google users

4. **Utilities Updated** (`frontend/lib/utils.js`)
   - Added `validateEmail()` function

5. **Packages Installed**
   - `@react-oauth/google` - For Google OAuth integration

## 🔧 Required Environment Variables

### Backend (.env)
Add the following to your `backend/.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### Frontend (.env.local)
Add the following to your `frontend/.env.local` file:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

## 🚀 Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: Professional Bangladeshi Supershop
   - User support email: your-email@gmail.com
   - Authorized domains: your-domain.com (if deployed)

6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: Bangladeshi Supershop Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://your-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000` (development)
     - `https://your-domain.com` (production)

7. Copy the **Client ID** and add it to your environment variables

### Step 2: Update Environment Variables

**Backend** (`backend/.env`):
```env
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
```

### Step 3: Restart Your Servers

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 📝 Validation Rules

### Email Validation
- **Only Gmail addresses allowed**: `example@gmail.com`
- Pattern: `/^[a-zA-Z0-9._%+-]+@gmail\.com$/`
- Required for registration and email-based login

### Mobile Validation
- **Only Bangladeshi mobile numbers**: `01XXXXXXXXX` (11 digits)
- Pattern: `/^01[0-9]{9}$/`
- Required for registration and mobile-based login

## 🔒 Security Features

1. **Google Token Verification**: Backend verifies Google OAuth tokens
2. **Email Restriction**: Only Gmail addresses are accepted
3. **Mobile Requirement**: All users must provide a valid BD mobile number
4. **No Registration Without Validation**: Both email and mobile are validated before account creation
5. **Unique Constraints**: Both email and mobile must be unique in the database

## 🎯 User Flows

### Flow 1: Register with Google
1. User clicks "Sign up with Google"
2. Google OAuth popup appears
3. User selects Gmail account
4. If new user: System asks for mobile number
5. User provides valid BD mobile number
6. Account created and logged in

### Flow 2: Login with Google
1. User clicks "Continue with Google"
2. Google OAuth popup appears
3. User selects Gmail account
4. If account exists: Logged in immediately
5. If new user: Asked for mobile number

### Flow 3: Register with Email/Mobile
1. User fills registration form
2. Provides name, Gmail, mobile, password
3. Both email and mobile are validated
4. Account created if validation passes

### Flow 4: Login with Email/Mobile
1. User selects login method (email or mobile)
2. Provides credentials and password
3. Logged in if credentials are valid

## 🧪 Testing

### Test Cases
1. ✅ Register with valid Gmail and mobile
2. ✅ Register with invalid email (non-Gmail) - should fail
3. ✅ Register with invalid mobile - should fail
4. ✅ Login with Google (existing user)
5. ✅ Login with Google (new user + mobile)
6. ✅ Login with email and password
7. ✅ Login with mobile and password
8. ✅ Duplicate email registration - should fail
9. ✅ Duplicate mobile registration - should fail

## 🐛 Troubleshooting

### Google Login Not Working
- Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in frontend
- Verify the Client ID matches in Google Cloud Console
- Ensure authorized origins are configured correctly
- Check browser console for errors

### Email Validation Failing
- Ensure email ends with `@gmail.com`
- Check for typos in email address
- Verify regex pattern is correct

### Mobile Validation Failing
- Ensure mobile starts with `01`
- Verify mobile has exactly 11 digits
- Check for spaces or special characters

## 📚 API Endpoints

### POST /api/auth/register
Register with email, mobile, and password
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "mobile": "01712345678",
  "password": "password123"
}
```

### POST /api/auth/login
Login with email/mobile and password
```json
{
  "email": "john@gmail.com",  // or use "mobile"
  "password": "password123"
}
```

### POST /api/auth/google
Login/Register with Google OAuth
```json
{
  "credential": "google-jwt-token"
}
```

### POST /api/auth/google/complete
Complete Google registration with mobile
```json
{
  "googleId": "google-user-id",
  "email": "john@gmail.com",
  "name": "John Doe",
  "avatar": "https://...",
  "mobile": "01712345678"
}
```

## ✨ Features

- ✅ Gmail-only authentication
- ✅ Valid mobile number requirement (BD format)
- ✅ Google OAuth integration
- ✅ Email or mobile login options
- ✅ Validation on both frontend and backend
- ✅ Secure token-based authentication
- ✅ Profile pictures from Google
- ✅ Bilingual UI (Bengali and English)

## 📄 Files Modified

### Backend
- `backend/server/models/User.js`
- `backend/server/routes/auth.js`
- `backend/package.json`

### Frontend
- `frontend/pages/login.js`
- `frontend/pages/register.js`
- `frontend/context/AuthContext.js`
- `frontend/lib/utils.js`
- `frontend/package.json`

## 🎉 Success!

Your authentication system now requires:
1. ✅ Valid Gmail address
2. ✅ Valid Bangladeshi mobile number
3. ✅ Secure password (or Google OAuth)

Users can authenticate using:
- 🔐 Gmail + Password
- 📱 Mobile + Password
- 🔑 Google OAuth (with mobile verification)
