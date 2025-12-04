# 🧪 Testing Guide - Separate Frontend & Backend

## Test Checklist

Use this guide to verify everything works after deployment.

---

## 🏠 Local Testing (Before Deployment)

### 1. Backend Tests

#### Start Backend
```bash
cd backend
npm install
npm run dev
```

#### Test Endpoints
Open in browser or Postman:

1. **Health Check**
   ```
   GET http://localhost:5000/api/health
   ```
   ✅ Expected: `{"success":true,"message":"Server is running"}`

2. **Get Products**
   ```
   GET http://localhost:5000/api/products
   ```
   ✅ Expected: Array of products

3. **Get Categories**
   ```
   GET http://localhost:5000/api/categories
   ```
   ✅ Expected: Array of categories

#### Backend Checklist
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Health endpoint responds
- [ ] Products endpoint returns data
- [ ] Categories endpoint returns data
- [ ] No CORS errors in logs

---

### 2. Frontend Tests

#### Start Frontend (Keep Backend Running)
```bash
cd frontend
npm install
npm run dev
```

#### Test Pages
Open browser: http://localhost:3000

1. **Homepage**
   - [ ] Page loads without errors
   - [ ] Hero section displays
   - [ ] Featured products appear
   - [ ] Categories load
   - [ ] Images display correctly

2. **Products**
   - [ ] Product grid displays
   - [ ] Can filter by category
   - [ ] Search works
   - [ ] Product cards show prices
   - [ ] "Add to Cart" buttons work

3. **Authentication**
   - [ ] Can navigate to `/register`
   - [ ] Registration form works
   - [ ] Can navigate to `/login`
   - [ ] Login works
   - [ ] JWT token stored in localStorage
   - [ ] User menu shows after login

4. **Cart**
   - [ ] Add items to cart
   - [ ] Cart count updates
   - [ ] Cart page shows items
   - [ ] Can update quantities
   - [ ] Can remove items
   - [ ] Total price calculates correctly

5. **Checkout**
   - [ ] Checkout page loads
   - [ ] Form validation works
   - [ ] Can submit order
   - [ ] Order confirmation shows

#### Browser Console Checks
Press F12, check Console tab:
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] API calls succeed
- [ ] No JavaScript errors

---

## 🌍 Production Testing (After Deployment)

### 1. Backend (Render/Railway)

#### Test Backend URL
Replace with your actual backend URL:

1. **Health Check**
   ```
   https://your-backend.onrender.com/api/health
   ```
   ✅ Expected: `{"success":true,"message":"Server is running"}`

2. **Get Products**
   ```
   https://your-backend.onrender.com/api/products
   ```
   ✅ Expected: Array of products (check in browser)

3. **CORS Headers** (check in Network tab)
   ```
   Access-Control-Allow-Origin: https://your-frontend.vercel.app
   Access-Control-Allow-Credentials: true
   ```

#### Backend Production Checklist
- [ ] Health endpoint responds (200 OK)
- [ ] Products API returns data
- [ ] Categories API returns data
- [ ] CORS headers include frontend URL
- [ ] MongoDB connection established
- [ ] No errors in Render logs

---

### 2. Frontend (Vercel/Netlify)

#### Test Frontend URL
Open: `https://your-frontend.vercel.app`

1. **Homepage Test**
   - [ ] Page loads (no white screen)
   - [ ] Products display
   - [ ] Categories work
   - [ ] Images load
   - [ ] Navigation works

2. **API Connection Test**
   - Open Browser Console (F12)
   - Go to Network tab
   - Reload page
   - Check API calls:
     - [ ] Calls go to correct backend URL
     - [ ] Status: 200 OK
     - [ ] Response contains data
     - [ ] No CORS errors

3. **Functionality Test**
   - [ ] Can browse products
   - [ ] Can search products
   - [ ] Can filter by category
   - [ ] Can register new account
   - [ ] Can login
   - [ ] Can add to cart
   - [ ] Can view cart
   - [ ] Can proceed to checkout

#### Frontend Production Checklist
- [ ] All pages load without errors
- [ ] API calls reach backend
- [ ] No CORS errors
- [ ] Images display
- [ ] Authentication works
- [ ] Cart persistence works
- [ ] No console errors

---

## 🔍 Detailed Testing Scenarios

### Scenario 1: New User Journey

1. **Visit Homepage**
   ```
   https://your-frontend.vercel.app
   ```
   - [ ] Page loads in < 3 seconds
   - [ ] Products visible

2. **Browse Products**
   - [ ] Click category
   - [ ] Products filter
   - [ ] Use search bar
   - [ ] Results appear

3. **Register Account**
   - Navigate to `/register`
   - Fill form:
     - Name: Test User
     - Email: test@example.com
     - Password: Test123!
   - [ ] Registration succeeds
   - [ ] Redirects to homepage
   - [ ] User menu shows "Test User"

4. **Add to Cart**
   - [ ] Click "Add to Cart" on product
   - [ ] Cart badge shows (1)
   - [ ] Success toast appears

5. **View Cart**
   - Navigate to `/cart`
   - [ ] Product appears
   - [ ] Price correct
   - [ ] Can update quantity
   - [ ] Total updates

6. **Checkout**
   - Click "Proceed to Checkout"
   - Fill delivery form
   - [ ] Can submit order
   - [ ] Order confirmation shows
   - [ ] Order ID displayed

---

### Scenario 2: Returning User

1. **Login**
   - Navigate to `/login`
   - Use existing credentials
   - [ ] Login succeeds
   - [ ] Redirects to homepage
   - [ ] User menu shows name

2. **View Account**
   - Navigate to `/account`
   - [ ] User info displays
   - [ ] Order history shows (if any)

3. **Logout**
   - Click logout
   - [ ] Redirects to homepage
   - [ ] User menu disappears
   - [ ] Cart persists (local storage)

---

### Scenario 3: Admin Functions

1. **Admin Login**
   - Navigate to `/admin-login`
   - Use admin credentials
   - [ ] Login succeeds
   - [ ] Redirects to `/admin`

2. **Admin Dashboard**
   - [ ] Dashboard loads
   - [ ] Statistics display
   - [ ] Can view products
   - [ ] Can view orders
   - [ ] Can manage categories

---

## 🐛 Common Issues & Tests

### Issue: CORS Error
**Test**:
```bash
# Check backend logs for CORS blocks
# Check FRONTEND_URL environment variable
curl -I https://your-backend.onrender.com/api/health
```

**Expected Headers**:
```
Access-Control-Allow-Origin: https://your-frontend.vercel.app
Access-Control-Allow-Credentials: true
```

### Issue: Products Not Loading
**Test**:
```bash
# Check products API directly
curl https://your-backend.onrender.com/api/products
```

**Expected**: JSON array with products

### Issue: Authentication Not Working
**Test**:
```javascript
// In browser console on frontend
localStorage.getItem('token')
// Should show JWT token after login
```

---

## 📊 Performance Testing

### Page Load Speed
- [ ] Homepage loads < 3 seconds
- [ ] Product page loads < 2 seconds
- [ ] Images load progressively

### API Response Time
- [ ] Products API responds < 500ms
- [ ] Categories API responds < 300ms
- [ ] Search responds < 1 second

### Mobile Testing
- [ ] Test on mobile device
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Images scale properly

---

## ✅ Final Verification Checklist

### Before Going Live
- [ ] All tests pass locally
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Database seeded with products
- [ ] Admin account created
- [ ] Email notifications work (optional)
- [ ] Payment gateway configured (optional)

### Post-Deployment
- [ ] Monitor backend logs for errors
- [ ] Monitor frontend for console errors
- [ ] Test from different devices
- [ ] Test from different networks
- [ ] Test all user flows
- [ ] Verify data persistence

---

## 🔧 Testing Tools

### Browser DevTools
- **Console**: Check for errors
- **Network**: Monitor API calls
- **Application**: Check localStorage/cookies

### API Testing
- **Postman**: Test backend endpoints
- **curl**: Quick command-line tests
- **Browser**: Simple GET requests

### Monitoring
- **Render Logs**: Backend server logs
- **Vercel Analytics**: Frontend performance
- **MongoDB Atlas**: Database monitoring

---

## 📝 Bug Reporting Template

If you find issues, document them:

```
Issue: [Brief description]
Environment: [Local/Production]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
Expected: [What should happen]
Actual: [What actually happened]
Console Errors: [Copy errors here]
```

---

**Testing Status**: Ready for Testing ✅
**Last Updated**: 2025-11-29
