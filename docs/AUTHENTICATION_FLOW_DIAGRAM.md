# Google OAuth Authentication Flow Diagram

## 🔄 Complete Authentication Flows

### Flow 1: New User Registration with Google OAuth

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. User visits /register
   │
   ├─→ Sees "Sign up with Google" button
   │
   └─→ Clicks button
       │
       └─→ Google OAuth popup appears
           │
           ├─→ User selects Gmail account
           │
           └─→ Google verifies credentials
               │
               ├─→ Returns to your app with JWT token
               │
               └─→ Frontend sends token to: POST /api/auth/google
                   │
                   ├─→ Backend verifies token with Google
                   │
                   ├─→ Checks if email is Gmail (@gmail.com)
                   │
                   └─→ Searches database for existing user
                       │
                       ├─→ User NOT found (New User)
                       │   │
                       │   ├─→ Backend returns: { requireMobile: true, tempData }
                       │   │
                       │   └─→ Frontend shows mobile input form
                       │       │
                       │       ├─→ User enters mobile: 01712345678
                       │       │
                       │       ├─→ Frontend validates mobile format
                       │       │
                       │       └─→ Sends to: POST /api/auth/google/complete
                       │           │
                       │           ├─→ Backend validates mobile (BD format)
                       │           │
                       │           ├─→ Creates new user in database
                       │           │
                       │           ├─→ Generates JWT token
                       │           │
                       │           └─→ Returns: { success: true, token, user }
                       │               │
                       │               └─→ ✅ User logged in & redirected to dashboard
                       │
                       └─→ User FOUND (Existing User)
                           │
                           ├─→ Backend generates JWT token
                           │
                           └─→ Returns: { success: true, token, user }
                               │
                               └─→ ✅ User logged in & redirected to dashboard
```

---

### Flow 2: Existing User Login with Google OAuth

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER LOGIN FLOW (GOOGLE)                    │
└─────────────────────────────────────────────────────────────────┘

1. User visits /login
   │
   ├─→ Sees "Continue with Google" button
   │
   └─→ Clicks button
       │
       └─→ Google OAuth popup
           │
           └─→ User selects Gmail account
               │
               └─→ Returns with JWT token
                   │
                   └─→ POST /api/auth/google
                       │
                       └─→ User exists in database
                           │
                           └─→ ✅ Instant login (no mobile input needed)
```

---

### Flow 3: Manual Registration with Email & Mobile

```
┌─────────────────────────────────────────────────────────────────┐
│                  MANUAL REGISTRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. User visits /register
   │
   └─→ Fills form:
       ├─→ Name: John Doe
       ├─→ Email: john@gmail.com
       ├─→ Mobile: 01712345678
       ├─→ Password: ••••••
       └─→ Confirm Password: ••••••
           │
           └─→ Clicks "Register"
               │
               ├─→ Frontend validates:
               │   ├─→ Email must end with @gmail.com ✓
               │   ├─→ Mobile must be 01XXXXXXXXX ✓
               │   └─→ Passwords must match ✓
               │
               └─→ POST /api/auth/register
                   │
                   ├─→ Backend validates:
                   │   ├─→ Email regex: /^[^@]+@gmail\.com$/ ✓
                   │   ├─→ Mobile regex: /^01[0-9]{9}$/ ✓
                   │   └─→ Check duplicate email/mobile ✓
                   │
                   ├─→ Hash password with bcrypt
                   │
                   ├─→ Create user in database
                   │
                   └─→ ✅ Return JWT token & user data
```

---

### Flow 4: Login with Email/Mobile & Password

```
┌─────────────────────────────────────────────────────────────────┐
│                     PASSWORD LOGIN FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. User visits /login
   │
   ├─→ Chooses login method:
   │   ├─→ Option A: Email
   │   └─→ Option B: Mobile
   │
   ├─→ Enters credentials:
   │   ├─→ Email: john@gmail.com  OR  Mobile: 01712345678
   │   └─→ Password: ••••••
   │
   └─→ Clicks "Login"
       │
       └─→ POST /api/auth/login
           │
           ├─→ Backend finds user by email OR mobile
           │
           ├─→ Compares password with bcrypt
           │
           ├─→ Checks if user is active
           │
           └─→ ✅ Returns JWT token & user data
```

---

## 🔐 Security & Validation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATION CHECKPOINTS                       │
└─────────────────────────────────────────────────────────────────┘

Frontend Validation:
├─→ Email Format
│   ├─→ Must end with @gmail.com
│   └─→ Regex: /^[a-zA-Z0-9._%+-]+@gmail\.com$/
│
├─→ Mobile Format
│   ├─→ Must start with 01
│   ├─→ Must be exactly 11 digits
│   └─→ Regex: /^01[0-9]{9}$/
│
└─→ Password Requirements
    ├─→ Minimum 6 characters
    └─→ Required for non-OAuth users

Backend Validation:
├─→ Email Verification
│   ├─→ Gmail validation
│   ├─→ Uniqueness check
│   └─→ Google token verification (OAuth)
│
├─→ Mobile Verification
│   ├─→ Bangladesh format validation
│   └─→ Uniqueness check
│
└─→ Security Checks
    ├─→ JWT token verification
    ├─→ Password hashing (bcrypt)
    └─→ Active account check
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER MODEL                              │
└─────────────────────────────────────────────────────────────────┘

User {
  _id:          ObjectId       // Auto-generated
  name:         String         // Required, min 2 chars
  email:        String         // Required, unique, @gmail.com only
  mobile:       String         // Required, unique, 01XXXXXXXXX
  password:     String         // Required if not OAuth, bcrypt hashed
  googleId:     String         // Optional, for OAuth users
  avatar:       String         // Optional, from Google profile
  role:         String         // 'user' or 'admin', default: 'user'
  isActive:     Boolean        // Default: true
  addresses:    [Address]      // Array of address objects
  createdAt:    Date           // Auto-generated
}

Indexes:
├─→ email (unique)
├─→ mobile (unique)
└─→ googleId (unique, sparse)
```

---

## 🌐 API Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION APIs                        │
└─────────────────────────────────────────────────────────────────┘

POST /api/auth/register
├─→ Body: { name, email, mobile, password }
├─→ Validates: email (@gmail.com), mobile (01XXXXXXXXX)
└─→ Returns: { success, token, user }

POST /api/auth/login
├─→ Body: { email OR mobile, password }
├─→ Validates: credentials, active account
└─→ Returns: { success, token, user }

POST /api/auth/google
├─→ Body: { credential }  // Google JWT token
├─→ Verifies: token with Google
├─→ If new user: Returns { requireMobile: true, tempData }
└─→ If existing: Returns { success, token, user }

POST /api/auth/google/complete
├─→ Body: { googleId, email, name, avatar, mobile }
├─→ Creates: new user with Google data
└─→ Returns: { success, token, user }

GET /api/auth/me
├─→ Headers: Authorization: Bearer <token>
├─→ Returns: { success, user }
└─→ Protected route (requires authentication)
```

---

## 🔄 Token Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      JWT TOKEN LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────┘

1. User authenticates (login/register/OAuth)
   │
   └─→ Backend generates JWT token
       │
       ├─→ Payload: { id: user._id, role: user.role }
       ├─→ Secret: process.env.JWT_SECRET
       ├─→ Expiry: 30 days
       │
       └─→ Returns token to frontend
           │
           └─→ Frontend stores in localStorage
               │
               ├─→ Key: 'token'
               │
               └─→ Axios interceptor adds to requests:
                   │
                   └─→ Header: Authorization: Bearer <token>

2. Protected API calls
   │
   └─→ Request includes token in header
       │
       └─→ Backend middleware verifies token
           │
           ├─→ Valid → Allow request
           └─→ Invalid → Return 401 Unauthorized

3. User logout
   │
   └─→ Frontend removes token from localStorage
       │
       └─→ User logged out (stateless)
```

---

## 🎨 UI Components Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND COMPONENTS                        │
└─────────────────────────────────────────────────────────────────┘

/login page
├─→ GoogleOAuthProvider
│   └─→ GoogleLogin button
│       └─→ onSuccess → handleGoogleSuccess()
│
├─→ Login Method Toggle
│   ├─→ Mobile input
│   └─→ Email input
│
└─→ Password input

/register page
├─→ GoogleOAuthProvider
│   └─→ GoogleLogin button
│       └─→ onSuccess → handleGoogleSuccess()
│
├─→ Manual Registration Form
│   ├─→ Name input
│   ├─→ Email input (Gmail only)
│   ├─→ Mobile input (BD format)
│   ├─→ Password input
│   └─→ Confirm password input
│
└─→ Mobile Input Modal (for Google users)
    └─→ Shows after Google OAuth if new user

AuthContext
├─→ login(mobile/email, password)
├─→ register(name, email, mobile, password)
├─→ googleLogin(credential)
├─→ completeGoogleRegistration(tempData, mobile)
└─→ logout()
```

---

## ✅ Validation Examples

```
┌─────────────────────────────────────────────────────────────────┐
│                     VALIDATION EXAMPLES                         │
└─────────────────────────────────────────────────────────────────┘

✅ VALID EMAILS:
├─→ user@gmail.com
├─→ john.doe@gmail.com
├─→ test123@gmail.com
└─→ my.email+tag@gmail.com

❌ INVALID EMAILS:
├─→ user@yahoo.com        → "Not a Gmail address"
├─→ user@outlook.com      → "Not a Gmail address"
├─→ user@company.com      → "Not a Gmail address"
└─→ user@gmail.co         → "Not a valid Gmail format"

✅ VALID MOBILE NUMBERS:
├─→ 01712345678           → Grameenphone
├─→ 01812345678           → Robi
├─→ 01912345678           → Banglalink
├─→ 01512345678           → Teletalk
└─→ 01612345678           → Airtel

❌ INVALID MOBILE NUMBERS:
├─→ 1712345678            → "Missing leading 0"
├─→ +8801712345678        → "No country code allowed"
├─→ 01712 345 678         → "No spaces allowed"
├─→ 017-1234-5678         → "No dashes allowed"
└─→ 0171234567            → "Must be 11 digits"
```

---

## 🚀 Production Deployment Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION CHECKLIST                          │
└─────────────────────────────────────────────────────────────────┘

Google Cloud Console:
├─→ Update authorized origins with production URLs
├─→ Update redirect URIs with production URLs
├─→ Publish OAuth app (remove testing restrictions)
└─→ Consider app verification for Google badge

Environment Variables:
├─→ Backend: Set GOOGLE_CLIENT_ID in hosting platform
├─→ Frontend: Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in hosting
├─→ Never commit .env files to Git
└─→ Use different Client IDs for dev/staging/prod

Security:
├─→ Use HTTPS for all production URLs
├─→ Set secure cookie flags in production
├─→ Enable CORS only for your domain
├─→ Rate limit authentication endpoints
└─→ Monitor for suspicious login attempts

Database:
├─→ Ensure email index is unique
├─→ Ensure mobile index is unique
├─→ Set up database backups
└─→ Monitor user creation rate
```

---

## 📊 Success Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICATION CHECKLIST                       │
└─────────────────────────────────────────────────────────────────┘

✅ Google OAuth Integration:
├─→ [ ] Google button appears on login page
├─→ [ ] Google button appears on register page
├─→ [ ] OAuth popup opens correctly
├─→ [ ] User can select Gmail account
└─→ [ ] Returns to app after authentication

✅ Email Validation:
├─→ [ ] Accepts @gmail.com addresses
├─→ [ ] Rejects non-Gmail addresses
├─→ [ ] Shows appropriate error messages
└─→ [ ] Validates on both frontend and backend

✅ Mobile Validation:
├─→ [ ] Accepts 01XXXXXXXXX format
├─→ [ ] Rejects invalid formats
├─→ [ ] Required for all users
└─→ [ ] Validates on both frontend and backend

✅ User Flows:
├─→ [ ] New Google user provides mobile
├─→ [ ] Existing Google user logs in instantly
├─→ [ ] Manual registration works with email+mobile
├─→ [ ] Login works with email OR mobile
└─→ [ ] JWT token persists across page refreshes

✅ Security:
├─→ [ ] Passwords are hashed
├─→ [ ] JWT tokens are secure
├─→ [ ] Environment variables are not exposed
└─→ [ ] Protected routes require authentication
```

---

## 🎉 Complete!

Your authentication system now supports:
- ✅ Google OAuth (one-click login)
- ✅ Gmail-only email validation
- ✅ Bangladesh mobile validation
- ✅ Secure JWT authentication
- ✅ Multiple login methods
- ✅ Production-ready security

Happy coding! 🚀
