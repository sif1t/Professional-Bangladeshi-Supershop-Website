# Google OAuth Setup Checklist ✓

## Phase 1: Google Cloud Console Setup

### Project Setup
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project: "Bangladeshi-Supershop"
- [ ] Verify project is selected in dropdown

### Enable APIs
- [ ] Go to: APIs & Services → Library
- [ ] Search and enable: "Google+ API" OR "Identity Platform"
- [ ] Verify API is enabled (green checkmark)

### OAuth Consent Screen
- [ ] Go to: APIs & Services → OAuth consent screen
- [ ] Select: External
- [ ] Fill in:
  - [ ] App name: "Professional Bangladeshi Supershop"
  - [ ] User support email: (your email)
  - [ ] Developer email: (your email)
- [ ] Click: Save and Continue (all pages)
- [ ] Return to Dashboard

### Create OAuth Client
- [ ] Go to: APIs & Services → Credentials
- [ ] Click: Create Credentials → OAuth client ID
- [ ] Select: Web application
- [ ] Name: "Bangladeshi Supershop Web Client"
- [ ] Add Authorized JavaScript origin:
  - [ ] `http://localhost:3000`
- [ ] Add Authorized redirect URI:
  - [ ] `http://localhost:3000`
- [ ] Click: Create
- [ ] Copy the Client ID (save it somewhere safe!)

---

## Phase 2: Environment Variables Setup

### Backend Configuration
- [ ] Navigate to: `backend` folder
- [ ] Open or create: `.env` file
- [ ] Add this line:
  ```
  GOOGLE_CLIENT_ID=paste-your-client-id-here.apps.googleusercontent.com
  ```
- [ ] Replace with your actual Client ID
- [ ] Save the file

### Frontend Configuration
- [ ] Navigate to: `frontend` folder
- [ ] Open or create: `.env.local` file
- [ ] Add this line:
  ```
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=paste-your-client-id-here.apps.googleusercontent.com
  ```
- [ ] Replace with your actual Client ID (same as backend)
- [ ] Save the file

### Verify Configuration
- [ ] Both files use the SAME Client ID
- [ ] Backend variable name: `GOOGLE_CLIENT_ID`
- [ ] Frontend variable name: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] No spaces around `=` sign
- [ ] No quotes around the value

---

## Phase 3: Start Servers

### Stop Running Servers
- [ ] Press Ctrl+C in backend terminal
- [ ] Press Ctrl+C in frontend terminal

### Start Backend
- [ ] Open Terminal 1
- [ ] Run:
  ```powershell
  cd "D:\projects\Professional Bangladeshi Supershop Website\backend"
  npm run dev
  ```
- [ ] Verify: "Server running on port 5000"
- [ ] Check for: No error messages

### Start Frontend
- [ ] Open Terminal 2
- [ ] Run:
  ```powershell
  cd "D:\projects\Professional Bangladeshi Supershop Website\frontend"
  npm run dev
  ```
- [ ] Verify: "ready - started server on 0.0.0.0:3000"
- [ ] Check for: No error messages

---

## Phase 4: Testing

### Visual Test
- [ ] Open browser: `http://localhost:3000/login`
- [ ] Verify: Google "Continue with" button appears
- [ ] Check: Button has Google logo and text

### Registration Test
- [ ] Go to: `http://localhost:3000/register`
- [ ] Click: "Sign up with Google" button
- [ ] Google popup appears
- [ ] Select: Your Gmail account
- [ ] Popup closes and returns to your site
- [ ] Mobile number input appears
- [ ] Enter: Valid mobile number (e.g., `01712345678`)
- [ ] Click: "Complete" button
- [ ] Verify: Redirected to dashboard
- [ ] Check: You are logged in

### Login Test
- [ ] Logout from your account
- [ ] Go to: `http://localhost:3000/login`
- [ ] Click: "Continue with Google" button
- [ ] Select: Same Gmail account
- [ ] Verify: Logged in immediately (no mobile input)
- [ ] Check: Redirected to dashboard

### Email Validation Test
- [ ] Go to: `http://localhost:3000/register`
- [ ] Try manual registration with: `user@yahoo.com`
- [ ] Verify: Error message appears
- [ ] Error should say: "Please provide a valid Gmail address"

### Mobile Validation Test
- [ ] Go to: `http://localhost:3000/register`
- [ ] Try registration with mobile: `1712345678`
- [ ] Verify: Error message appears
- [ ] Error should say: "Invalid mobile number"

---

## Phase 5: Final Verification

### Environment Check
- [ ] Backend `.env` exists in `backend/.env`
- [ ] Frontend `.env.local` exists in `frontend/.env.local`
- [ ] Both files contain Google Client ID
- [ ] Client IDs match in both files

### Feature Check
- [ ] Google login button visible on login page
- [ ] Google signup button visible on register page
- [ ] Toggle between mobile/email works on login
- [ ] Email field visible on registration form
- [ ] Gmail validation works (rejects non-Gmail)
- [ ] Mobile validation works (BD format only)
- [ ] Google OAuth flow completes successfully
- [ ] Mobile input appears for new Google users
- [ ] Existing Google users login without mobile input

### Security Check
- [ ] `.env` file is in `.gitignore`
- [ ] `.env.local` file is in `.gitignore`
- [ ] Client ID is not committed to Git
- [ ] No console errors in browser
- [ ] No server errors in terminal

---

## 🎉 Success Criteria

You're done when:

✅ All checkboxes above are checked
✅ Google login works smoothly
✅ Email validation enforces Gmail only
✅ Mobile validation enforces BD format
✅ New users provide mobile number
✅ Existing users login instantly
✅ No errors in console or terminal

---

## 📄 Documentation Files Available

If you need help, check these files:

1. **Complete Guide**: `docs/GOOGLE_OAUTH_COMPLETE_GUIDE.md`
   - Full step-by-step instructions
   - Screenshots descriptions
   - Detailed troubleshooting

2. **Quick Reference**: `docs/GOOGLE_OAUTH_QUICK_REFERENCE.md`
   - Quick commands and configs
   - Common errors and fixes
   - Format examples

3. **Setup Overview**: `docs/GMAIL_OAUTH_SETUP.md`
   - Feature overview
   - API endpoints
   - Security features

4. **Quick Start**: `docs/GMAIL_AUTH_QUICK_START.md`
   - 5-minute setup
   - Essential steps only
   - Common issues

---

## 🐛 If Something Goes Wrong

**Google button not showing?**
- [ ] Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in frontend
- [ ] Restart frontend server
- [ ] Clear browser cache

**"Redirect URI mismatch" error?**
- [ ] Add `http://localhost:3000` to authorized origins
- [ ] Wait 5 minutes for Google to update
- [ ] Try again

**"Invalid client" error?**
- [ ] Verify Client ID is correct in both .env files
- [ ] Check for typos or extra spaces
- [ ] Restart both servers

**Validation errors?**
- [ ] Gmail: Must end with `@gmail.com`
- [ ] Mobile: Must be `01XXXXXXXXX` (11 digits)

---

## 📞 Need Help?

Stuck? Check:
1. Browser console (F12) for frontend errors
2. Backend terminal for server errors
3. Google Cloud Console for configuration issues

---

## ✨ Congratulations!

Once all items are checked, you have:
- Professional OAuth authentication
- Gmail-only email validation
- BD mobile number validation
- Secure, production-ready login system

Your e-commerce platform is now ready! 🚀
