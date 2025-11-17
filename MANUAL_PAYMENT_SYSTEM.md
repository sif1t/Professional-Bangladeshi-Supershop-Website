# Manual Payment Checkout System - Documentation

## Overview
A complete manual payment processing system for your Bangladeshi supershop website with support for bKash, Nagad, Rocket, and Cash on Delivery.

## Features

### Customer Features
- ✅ Simple single-page checkout form
- ✅ Customer information (Name, Phone, Address)
- ✅ Payment method selection with visual cards
- ✅ Payment instructions with account numbers
- ✅ Transaction ID entry
- ✅ Payment screenshot upload
- ✅ Order summary with real-time calculations
- ✅ Mobile-responsive design
- ✅ Cash on Delivery option (no screenshot needed)

### Admin Features
- ✅ Dashboard to view all orders
- ✅ Filter by status (Pending, Approved, Rejected)
- ✅ View payment screenshots
- ✅ View transaction IDs
- ✅ Approve/Reject orders with one click
- ✅ Customer contact information
- ✅ Order details and items

## File Structure

```
pages/
├── checkout-manual.js          # Customer checkout page
├── admin/
│   └── manual-payments.js      # Admin payment verification dashboard

server/
├── routes/
│   ├── admin.js               # Admin API endpoints
│   ├── upload.js              # Image upload handler
│   └── orders.js              # Order creation (updated)
├── models/
│   └── Order.js               # Order model (updated with manual payment fields)

public/
└── uploads/
    └── payments/              # Payment screenshots stored here
```

## Setup Instructions

### 1. Update Payment Account Numbers

Edit `pages/checkout-manual.js` and update your business account numbers:

```javascript
const paymentAccounts = {
    bKash: {
        number: '01712345678',  // ← Change this
        type: 'Merchant',
        // ...
    },
    Nagad: {
        number: '01812345678',  // ← Change this
        type: 'Merchant',
        // ...
    },
    Rocket: {
        number: '01912345678',  // ← Change this
        type: 'Agent',
        // ...
    },
};
```

### 2. Database Schema

The Order model now includes these additional fields:

```javascript
{
    // ... existing fields ...
    
    manualPayment: {
        transactionId: String,
        screenshot: String,
        accountNumber: String,
        submittedAt: Date,
        verificationStatus: 'pending' | 'approved' | 'rejected',
        verifiedBy: ObjectId,
        verifiedAt: Date,
        rejectionReason: String,
    },
    customerName: String,
    deliveryLocation: String,
}
```

### 3. Server Configuration

The server has been updated with:
- `/api/upload` - Image upload endpoint (using multer)
- `/api/admin/manual-payments` - Admin dashboard endpoints
- multer package installed for file uploads

### 4. Access the System

**Customer Checkout:**
```
http://localhost:3000/checkout-manual
```

**Admin Dashboard:**
```
http://localhost:3000/admin/manual-payments
```
(Requires admin login)

## Usage Guide

### For Customers

1. **Add products to cart**
2. **Click "Proceed to Checkout"** (redirects to manual checkout)
3. **Fill in customer information:**
   - Full Name
   - Phone Number (11 digits)
   - Delivery Address

4. **Select payment method:**
   - bKash (Pink card)
   - Nagad (Orange card)
   - Rocket (Purple card)
   - Cash on Delivery (Green card)

5. **For Online Payments (bKash/Nagad/Rocket):**
   - View payment instructions
   - See the account number to send money to
   - Complete payment in your mobile app
   - Come back and enter Transaction ID
   - Upload payment screenshot
   - Click "Place Order"

6. **For Cash on Delivery:**
   - No screenshot needed
   - Simply click "Place Order"
   - Pay when you receive the product

7. **Order Status:**
   - Order saved as "Pending Review"
   - Wait for admin approval
   - Check order status in "My Orders"

### For Admin

1. **Access Admin Dashboard:**
   ```
   http://localhost:3000/admin/manual-payments
   ```

2. **View Orders:**
   - All pending orders are shown by default
   - Use filter buttons to view Approved/Rejected orders

3. **Review Each Order:**
   - Click "View Details" to see full information
   - Check payment screenshot
   - Verify transaction ID
   - See customer contact info

4. **Approve Payment:**
   - Click "Approve" button
   - Order status changes to "Confirmed"
   - Payment status becomes "Paid"
   - Customer can see approved status

5. **Reject Payment:**
   - Click "Reject" button
   - Enter rejection reason (optional)
   - Order status changes to "Cancelled"
   - Customer notified of rejection

## API Endpoints

### Customer Endpoints

**Create Order with Manual Payment**
```
POST /api/orders
Authorization: Bearer {token}

Body:
{
  "items": [...],
  "shippingAddress": {...},
  "contactNumber": "01XXXXXXXXX",
  "customerName": "Customer Name",
  "paymentMethod": "bKash",
  "paymentStatus": "pending_verification",
  "status": "pending",
  "manualPayment": {
    "transactionId": "8H3K5L7M",
    "screenshot": "/uploads/payments/payment-123456.jpg",
    "accountNumber": "01712345678"
  }
}
```

**Upload Payment Screenshot**
```
POST /api/upload
Content-Type: multipart/form-data

Body:
{
  "image": <file>
}

Response:
{
  "success": true,
  "url": "/uploads/payments/payment-123456.jpg"
}
```

### Admin Endpoints

**Get All Manual Payment Orders**
```
GET /api/admin/manual-payments?status=pending
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "orders": [...]
}
```

**Approve Payment**
```
POST /api/admin/manual-payments/:orderId/approve
Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "Payment approved successfully"
}
```

**Reject Payment**
```
POST /api/admin/manual-payments/:orderId/reject
Authorization: Bearer {admin_token}

Body:
{
  "reason": "Invalid transaction ID"
}

Response:
{
  "success": true,
  "message": "Payment rejected"
}
```

## Payment Method Configuration

### bKash Setup
1. Get a bKash merchant account
2. Update your merchant number in `checkout-manual.js`
3. (Optional) Generate QR code and add image path

### Nagad Setup
1. Get a Nagad merchant account
2. Update your merchant number
3. (Optional) Generate QR code

### Rocket Setup
1. Get a Rocket agent account
2. Update your agent number
3. (Optional) Generate QR code

## Security Considerations

### Current Implementation (Development)
- ⚠️ Upload endpoint is public (anyone can upload)
- ⚠️ Passwords stored in code (payment accounts)
- ⚠️ No rate limiting on uploads

### Production Recommendations
1. **Secure Upload Endpoint:**
   ```javascript
   router.post('/', protect, upload.single('image'), ...);
   ```

2. **Move Account Numbers to .env:**
   ```
   BKASH_MERCHANT_NUMBER=01XXXXXXXXX
   NAGAD_MERCHANT_NUMBER=01XXXXXXXXX
   ROCKET_AGENT_NUMBER=01XXXXXXXXX
   ```

3. **Add Rate Limiting:**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const uploadLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 10 // limit each IP to 10 requests per windowMs
   });
   ```

4. **Validate File Types:**
   - Already implemented in upload.js
   - Only allows: jpeg, jpg, png, gif
   - Max size: 5MB

5. **Sanitize File Names:**
   - Already implemented with timestamp + random string

## Customization

### Change Payment Account Display

Edit `pages/checkout-manual.js`:

```javascript
// Add instruction text
instruction: 'Your custom instructions here',

// Change colors
color: 'bg-pink-600', // or any Tailwind color

// Update QR code path
qrCode: '/images/your-qr-code.png',
```

### Add More Payment Methods

1. Add to `paymentAccounts` object
2. Add radio button in payment method section
3. Update Order model enum if needed

### Modify Order Statuses

Edit `server/models/Order.js`:

```javascript
paymentStatus: {
    type: String,
    enum: ['your', 'custom', 'statuses'],
}
```

## Testing

### Test Customer Flow
1. Add products to cart
2. Go to checkout-manual
3. Fill form with test data
4. Upload a test image
5. Enter fake transaction ID
6. Submit order
7. Check if order appears in admin dashboard

### Test Admin Flow
1. Login as admin
2. Go to /admin/manual-payments
3. View pending orders
4. Click "View Details"
5. Check if screenshot displays
6. Click "Approve"
7. Verify status changes

## Troubleshooting

### Images Not Uploading
- Check if `/public/uploads/payments` directory exists
- Check file size (max 5MB)
- Check file type (must be image)
- Check server logs for multer errors

### Orders Not Showing in Admin
- Verify user has admin role
- Check if orders have `manualPayment` field
- Check browser console for API errors

### Screenshot Not Displaying
- Verify file path is correct
- Check if file exists in `public/uploads/payments`
- Ensure Next.js static file serving is working

## Future Enhancements

### Potential Features
- [ ] Email notifications on approval/rejection
- [ ] SMS notifications
- [ ] Auto-verify using payment gateway APIs
- [ ] Bulk approve/reject
- [ ] Export orders to Excel
- [ ] Payment analytics dashboard
- [ ] QR code scanning in app
- [ ] Real-time order status updates
- [ ] Customer order tracking page
- [ ] Admin notes on orders

## Support

For issues or questions:
1. Check server logs: `cd server && node index.js`
2. Check browser console for frontend errors
3. Verify all dependencies installed: `npm install`
4. Ensure MongoDB is running
5. Check file permissions on uploads directory

## Summary

This manual payment system provides:
- ✅ 100% manual verification process
- ✅ No payment gateway integration needed
- ✅ No API keys required
- ✅ Simple admin approval workflow
- ✅ Screenshot-based payment proof
- ✅ Mobile-friendly interface
- ✅ Support for 4 payment methods
- ✅ Complete order management

Perfect for small to medium businesses in Bangladesh who want a simple, reliable payment collection system!
