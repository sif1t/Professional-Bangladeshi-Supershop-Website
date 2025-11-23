# Google OAuth Quick Reference Card

## 🎯 Quick Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **Credentials Page**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent

---

## 📝 Quick Steps Summary

### 1️⃣ Google Cloud Console Setup (5 minutes)

```
Google Cloud Console → New Project
   ↓
APIs & Services → Library → Enable "Google+ API"
   ↓
OAuth Consent Screen → External → Configure
   ↓
Credentials → Create OAuth 2.0 Client ID
   ↓
Copy Client ID
```

### 2️⃣ Environment Variables Setup (2 minutes)

**Backend** - `backend/.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Frontend** - `frontend/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3️⃣ Restart Servers (1 minute)

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

---

## 🔑 OAuth Client Configuration

### Application Type
```
Web Application
```

### Name
```
Bangladeshi Supershop Web Client
```

### Authorized JavaScript Origins
```
http://localhost:3000          # Development
https://yourdomain.com         # Production
```

### Authorized Redirect URIs
```
http://localhost:3000          # Development
http://localhost:3000/login    # Development
http://localhost:3000/register # Development
https://yourdomain.com         # Production
https://yourdomain.com/login   # Production
```

---

## 🧪 Testing Commands

### Check if Environment Variables are Loaded

**Backend:**
```javascript
// Add to backend/server/index.js temporarily
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
```

**Frontend (Browser Console):**
```javascript
console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
```

### Quick File Check
```powershell
# Check backend .env
Get-Content backend\.env | Select-String "GOOGLE"

# Check frontend .env.local
Get-Content frontend\.env.local | Select-String "GOOGLE"
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Wrong Variable Names
```env
# Backend - WRONG
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...  # ❌ Don't use NEXT_PUBLIC_ in backend

# Frontend - WRONG  
GOOGLE_CLIENT_ID=...  # ❌ Must use NEXT_PUBLIC_ prefix
```

### ❌ Wrong File Locations
```
❌ backend/.env.local     → Should be: backend/.env
❌ frontend/.env          → Should be: frontend/.env.local
```

### ❌ Spaces and Quotes
```env
# ❌ Wrong
GOOGLE_CLIENT_ID = "123-abc.apps.googleusercontent.com"

# ✅ Correct
GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com
```

### ❌ Forgetting to Restart Servers
```
After adding/changing .env files:
→ Always restart both backend and frontend servers!
```

---

## 🔍 Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Google button not showing | Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in frontend/.env.local |
| "Redirect URI mismatch" | Add `http://localhost:3000` to authorized origins in Google Console |
| "Invalid client" | Verify Client ID is correct in both .env files |
| "Invalid Gmail" | Only `@gmail.com` addresses are allowed |
| "Invalid mobile" | Use format: `01712345678` (11 digits, starts with 01) |
| Environment vars not loading | Restart servers after changing .env files |

---

## 📋 Pre-Flight Checklist

Before testing, verify:

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] Client ID copied
- [ ] `backend/.env` has `GOOGLE_CLIENT_ID`
- [ ] `frontend/.env.local` has `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Same Client ID in both files
- [ ] Backend server restarted
- [ ] Frontend server restarted
- [ ] http://localhost:3000/login loads
- [ ] Google button visible

---

## 🎯 Test Scenarios

### ✅ Successful Test Flow

1. Go to: `http://localhost:3000/register`
2. Click: "Sign up with Google"
3. Select: Your Gmail account
4. Enter: Valid mobile (e.g., `01712345678`)
5. Result: ✅ Logged in successfully!

### ❌ Expected Validation Errors

```
Email: user@yahoo.com     → ❌ "Please provide a valid Gmail address"
Mobile: 1712345678        → ❌ "Invalid mobile number" (missing leading 0)
Mobile: +8801712345678    → ❌ "Invalid mobile number" (no country code)
```

---

## 📱 Valid Formats

### Email (Gmail Only)
```
✅ user@gmail.com
✅ user.name@gmail.com
✅ user123@gmail.com
❌ user@yahoo.com
❌ user@outlook.com
❌ user@hotmail.com
```

### Mobile (Bangladesh Only)
```
✅ 01712345678    (11 digits, starts with 01)
✅ 01812345678
✅ 01912345678
❌ 1712345678     (missing leading 0)
❌ +8801712345678 (no country code)
❌ 01712 345678   (no spaces)
```

---

## 🚀 Production Deployment

When deploying to production:

1. **Update Google Cloud Console:**
   - Add production URL to authorized origins
   - Add production URL to redirect URIs

2. **Set Production Environment Variables:**
   - Backend hosting: Add `GOOGLE_CLIENT_ID`
   - Frontend hosting: Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

3. **Publish OAuth App:**
   - OAuth Consent Screen → Publish App
   - Required for public access

---

## 💡 Pro Tips

1. **Use the same Client ID** in both backend and frontend
2. **Always restart servers** after changing .env files
3. **Test in incognito mode** to avoid cached auth states
4. **Keep Client ID secure** - Add `.env` to `.gitignore`
5. **Use test users** in OAuth consent screen during development

---

## 📞 Quick Support

**Can't find Client ID?**
```
Google Cloud Console → APIs & Services → Credentials
→ Look under "OAuth 2.0 Client IDs"
→ Click your client name
→ Copy Client ID from the top
```

**Need to create new Client ID?**
```
Credentials → Create Credentials → OAuth client ID
→ Web application
→ Add authorized origins
→ Create
```

**Want to test without setup?**
```
You can skip Google OAuth and still use:
- Email + Password login
- Mobile + Password login
```

---

## ✨ What You Get

After setup, your app supports:

✅ **3 Login Methods:**
- Gmail + Password
- Mobile + Password  
- Google OAuth (one-click)

✅ **Strict Validation:**
- Only Gmail emails
- Only BD mobile numbers
- No invalid accounts

✅ **Seamless UX:**
- Auto-fill from Google
- Just add mobile number
- Instant login

---

## 🎉 You're All Set!

Your authentication system now has:
- ✅ Professional OAuth integration
- ✅ Gmail-only validation
- ✅ BD mobile number validation
- ✅ Multiple login options
- ✅ Secure token-based auth

Happy coding! 🚀
