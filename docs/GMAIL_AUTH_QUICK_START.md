# Quick Start: Gmail OAuth Authentication

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Google OAuth Credentials

1. Visit: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized origins: `http://localhost:3000`
5. Copy the Client ID

### Step 2: Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Step 3: Install Dependencies (Already Done)

```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install
```

### Step 4: Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 5: Test It!

1. Go to: http://localhost:3000/register
2. Click "Sign up with Google"
3. Select your Gmail account
4. Enter your mobile number (format: 01XXXXXXXXX)
5. Done! 🎉

## ✅ What's Now Required

### For Registration:
- ✅ Valid Gmail address (ends with @gmail.com)
- ✅ Valid Bangladeshi mobile number (01XXXXXXXXX)
- ✅ Password (min 6 characters) OR Google OAuth

### For Login:
- ✅ Gmail OR Mobile + Password
- ✅ OR Google OAuth button

## 🎯 Features

✨ **Multiple Login Methods:**
- Login with Gmail + Password
- Login with Mobile + Password  
- Login with Google OAuth

✨ **Strict Validation:**
- Only Gmail addresses allowed
- Only Bangladeshi mobile numbers (01XXXXXXXXX)
- No account creation without valid credentials

✨ **Seamless Google Integration:**
- One-click Google login
- Auto-fills name, email, avatar
- Only asks for mobile number

## 📝 Validation Rules

### Email Format
- ✅ `user@gmail.com`
- ❌ `user@yahoo.com`
- ❌ `user@outlook.com`

### Mobile Format
- ✅ `01712345678` (11 digits, starts with 01)
- ❌ `1712345678` (missing leading 0)
- ❌ `+8801712345678` (no country code)

## 🐛 Common Issues

**Issue:** "Google login not working"
- **Fix:** Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local`

**Issue:** "Invalid Gmail address"
- **Fix:** Use email ending with `@gmail.com`

**Issue:** "Invalid mobile number"
- **Fix:** Use format `01XXXXXXXXX` (11 digits)

## 📱 User Experience

### New User Registration Flow:
1. Click "Sign up with Google"
2. Select Gmail account
3. Enter mobile number → ✅ Account created!

### Existing User Login Flow:
1. Click "Continue with Google"
2. Select Gmail account → ✅ Logged in!

### Manual Registration Flow:
1. Enter name, Gmail, mobile, password
2. All validated → ✅ Account created!

## 🎨 UI Updates

**Login Page:**
- Google "Continue with" button
- Toggle: Mobile/Email login
- Bilingual (Bengali + English)

**Registration Page:**
- Google "Sign up with" button  
- Email field (Gmail only)
- Mobile field (BD format)
- Bilingual (Bengali + English)

## 🔗 Documentation

For detailed setup: See `docs/GMAIL_OAUTH_SETUP.md`

## 🎉 Done!

Your authentication system now enforces:
- ✅ Gmail-only email addresses
- ✅ Valid Bangladeshi mobile numbers
- ✅ Secure password OR Google OAuth

Enjoy secure, validated authentication! 🚀
