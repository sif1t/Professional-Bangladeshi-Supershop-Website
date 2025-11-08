# 🛒 How to Add Products Professionally

## 📋 Table of Contents
1. [Admin Panel Method (Recommended)](#1-admin-panel-method-recommended)
2. [API Method (For Developers)](#2-api-method-for-developers)
3. [Seed Script Method (For Bulk Import)](#3-seed-script-method-for-bulk-import)
4. [Direct Database Method](#4-direct-database-method-advanced)
5. [Best Practices](#best-practices)

---

## 1. Admin Panel Method (Recommended) ⭐

### Access the Admin Panel

1. **Login to your account** at http://localhost:3000/login
2. **Click on your user profile** (top right)
3. **Select "🛠️ Admin Panel"** from the dropdown
4. **Or directly visit**: http://localhost:3000/admin

### Add a Single Product

**Step-by-Step:**

1. **Navigate to Admin Dashboard**
   - URL: http://localhost:3000/admin
   - Click "Add Product" button

2. **Fill Product Information:**

   **Basic Information:**
   - Product Name: e.g., "Premium Basmati Rice"
   - Description: Detailed product description

   **Pricing & Inventory:**
   - Price: in BDT (e.g., 120)
   - Stock: Available quantity (e.g., 500)
   - Unit: Select from dropdown (kg, liter, piece, dozen, etc.)

   **Category:**
   - Main Category: Select parent category (e.g., "Rice, Flour & Pulses")
   - Subcategory: Auto-loads based on main category (e.g., "Rice")

   **Media & Tags:**
   - Image URLs: Comma-separated image links
   - Tags: Relevant keywords (e.g., "rice, basmati, premium")
   - Featured: Check if you want it on homepage

3. **Click "Add Product"**

### Manage Products

**View All Products:**
- Visit: http://localhost:3000/admin/products
- **Features:**
  - Search products by name
  - Filter by category
  - Filter by stock level
  - View stock status (In Stock, Low Stock, Out of Stock)
  - Quick edit/delete actions

**Edit a Product:**
- Click the edit icon (✏️) next to any product
- Update fields as needed
- Save changes

**Delete a Product:**
- Click the trash icon (🗑️) next to any product
- Confirm deletion

---

## 2. API Method (For Developers) 🔧

### Prerequisites
- Authentication token (JWT)
- API base URL: http://localhost:5000/api

### Add Product via API

**Endpoint:** `POST /api/products`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

**Request Body:**
```json
{
  "name": "Premium Basmati Rice",
  "description": "Long grain aromatic basmati rice imported from India",
  "price": 120,
  "category": "SUBCATEGORY_ID_HERE",
  "stock": 500,
  "unit": "kg",
  "images": [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800"
  ],
  "featured": true,
  "tags": ["rice", "basmati", "premium", "imported"]
}
```

**Get Category ID:**
```bash
GET /api/categories
# Find your subcategory and copy its _id
```

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Premium Basmati Rice",
    "price": 120,
    "category": "CATEGORY_ID",
    "stock": 500,
    "unit": "kg"
  }'
```

**Example with JavaScript/Axios:**
```javascript
const axios = require('axios');

const addProduct = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/products', {
      name: 'Premium Basmati Rice',
      description: 'Long grain aromatic basmati rice',
      price: 120,
      category: 'CATEGORY_ID',
      stock: 500,
      unit: 'kg',
      images: ['https://example.com/image.jpg'],
      featured: true,
      tags: ['rice', 'basmati']
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Product added:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};
```

---

## 3. Seed Script Method (For Bulk Import) 📦

### Use Existing Professional Structure

**Run the professional seed script:**
```bash
npm run seed:pro
```

This will populate:
- 10 Main Categories
- 30 Subcategories
- 64 Products

### Customize the Seed Script

**Edit:** `server/seed-professional.js`

**Add your products to the `productCatalog` object:**

```javascript
const productCatalog = {
    'Fresh Vegetables': {
        'Root Vegetables': [
            // Add your products here
            { 
                name: 'Sweet Potato', 
                price: 55, 
                stock: 120, 
                unit: 'kg', 
                featured: false,
                image: 'https://images.unsplash.com/photo-...'
            },
            // More products...
        ],
    },
    // More categories...
};
```

**Run the updated script:**
```bash
node server/seed-professional.js
```

### Create Custom Seed Script

**Example: Import from CSV/JSON**

```javascript
// server/import-products.js
require('dotenv').config();
const fs = require('fs');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const slugify = require('slugify');

const importProducts = async () => {
    await connectDB();
    
    // Read from JSON file
    const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
    
    for (const product of products) {
        await Product.create({
            ...product,
            slug: slugify(product.name, { lower: true, strict: true })
        });
    }
    
    console.log('Import complete!');
    process.exit(0);
};

importProducts();
```

**products.json format:**
```json
[
  {
    "name": "Product Name",
    "price": 100,
    "category": "CATEGORY_ID",
    "stock": 50,
    "unit": "kg"
  }
]
```

---

## 4. Direct Database Method (Advanced) 💾

### Using MongoDB Compass or Shell

**Connect to MongoDB:**
```bash
mongosh
use bangladeshi-supershop
```

**Insert Product:**
```javascript
db.products.insertOne({
  name: "Premium Basmati Rice",
  slug: "premium-basmati-rice",
  description: "Long grain aromatic basmati rice",
  price: 120,
  category: ObjectId("CATEGORY_ID"),
  stock: 500,
  unit: "kg",
  images: ["https://example.com/image.jpg"],
  featured: true,
  tags: ["rice", "basmati", "premium"],
  createdAt: new Date()
})
```

**Bulk Insert:**
```javascript
db.products.insertMany([
  {
    name: "Product 1",
    slug: "product-1",
    price: 50,
    category: ObjectId("CATEGORY_ID"),
    stock: 100,
    unit: "kg",
    createdAt: new Date()
  },
  // More products...
])
```

---

## Best Practices ✨

### 1. Product Organization

**Category Hierarchy:**
```
Main Category (e.g., Fresh Vegetables)
  └─ Subcategory (e.g., Root Vegetables)
      └─ Products (e.g., Potatoes, Onions, Carrots)
```

**Always assign products to SUBCATEGORIES, not main categories.**

### 2. Product Naming

✅ **Good:**
- "Fresh Tomatoes (Local)"
- "Miniket Rice (Premium)"
- "Coca Cola (2L Bottle)"

❌ **Bad:**
- "Tomato"
- "Rice1"
- "Product123"

### 3. Product Descriptions

**Include:**
- Product origin (Local/Imported)
- Quality grade (Premium/Standard)
- Special features (Organic, Fresh, etc.)
- Usage suggestions

**Example:**
```
"Premium Basmati rice imported from India. Known for its 
long grains and aromatic flavor. Perfect for biryani and 
special occasions. Each grain stays separate when cooked."
```

### 4. Pricing Strategy

- Research competitor prices
- Add 10-15% margin for online convenience
- Use psychological pricing (₹99 vs ₹100)
- Offer bulk discounts

### 5. Stock Management

| Stock Level | Status | Action |
|------------|---------|---------|
| 0 | Out of Stock | Hide from listing or show as unavailable |
| 1-20 | Low Stock | Show warning, reorder soon |
| 21-100 | Medium | Normal display |
| 100+ | High | Safe level |

### 6. Images

**Requirements:**
- Format: JPG or WebP
- Size: 800x800px minimum
- Aspect Ratio: 1:1 (square)
- File Size: < 200KB
- Background: White or clean

**Free Image Sources:**
- [Unsplash](https://unsplash.com) - High quality, free
- [Pexels](https://pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images

**Example URLs:**
```
https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800
```

### 7. Tags for SEO

**Good Tags:**
- Product type: "rice", "vegetable", "fruit"
- Quality: "premium", "organic", "fresh"
- Origin: "local", "imported", "bangladeshi"
- Bengali terms: "chawal", "doi", "ilish"

**Example:**
```javascript
tags: ["rice", "basmati", "premium", "chawal", "imported", "india"]
```

### 8. Featured Products

**What to Feature:**
- ✅ Bestsellers
- ✅ New arrivals
- ✅ Seasonal items
- ✅ High margin products
- ✅ Promotional items

**Limit:** Keep 10-15 featured products maximum

---

## Quick Commands Reference 📝

```bash
# Admin Panel
http://localhost:3000/admin

# Add product via Admin UI
http://localhost:3000/admin/add-product

# View all products
http://localhost:3000/admin/products

# Seed database with professional data
npm run seed:pro

# Start backend server
npm run server:dev

# Start frontend
npm run dev

# View database
mongosh
use bangladeshi-supershop
db.products.find().pretty()
```

---

## Troubleshooting 🔧

### Issue: "Category not found"
**Solution:** Get category ID first:
```bash
GET http://localhost:5000/api/categories
```

### Issue: "Validation failed: slug is required"
**Solution:** Add slug manually or use slugify:
```javascript
const slugify = require('slugify');
product.slug = slugify(product.name, { lower: true, strict: true });
```

### Issue: "Images not showing"
**Solution:** 
- Use full URLs (https://)
- Test URLs in browser first
- Use Unsplash URLs

### Issue: "Cannot add product"
**Solution:**
- Ensure you're logged in
- Check if backend server is running
- Verify MongoDB is connected

---

## Next Steps 🚀

1. ✅ Add products via Admin Panel
2. ✅ Organize by categories
3. ✅ Upload quality images
4. ✅ Set proper stock levels
5. ✅ Mark featured products
6. ✅ Test on mobile
7. ✅ Monitor inventory

---

**Need Help?**
- Check `PRODUCT_MANAGEMENT_GUIDE.md`
- Check `SETUP_GUIDE.md`
- Review API routes in `server/routes/products.js`

**Last Updated:** November 2025
