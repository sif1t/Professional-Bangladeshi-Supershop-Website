# Professional Product & Category Management Guide

## 📋 Overview

Your Bangladeshi Supershop now has a **professional 3-level category hierarchy**:

```
Main Categories (10)
  └─ Subcategories (30)
      └─ Products (64)
```

## 🏗️ Category Structure

### Level 1: Main Categories (Parent)
These are the top-level categories displayed on your homepage:

1. **Fresh Vegetables** - Featured
2. **Fresh Fruits** - Featured  
3. **Dairy & Eggs** - Featured
4. **Rice, Flour & Pulses** - Featured
5. **Cooking Oil & Ghee**
6. **Beverages**
7. **Meat & Fish** - Featured
8. **Spices & Masala**
9. **Bakery & Snacks**
10. **Personal Care**

### Level 2: Subcategories (Children)
Each main category has 2-4 subcategories for better organization:

**Example: Fresh Vegetables**
- Leafy Vegetables (Spinach, Amaranth, Lettuce)
- Root Vegetables (Potatoes, Onions, Carrots)
- Exotic Vegetables (Broccoli, Capsicum, Zucchini)

**Example: Dairy & Eggs**
- Milk (Fresh, Packaged, Powder)
- Eggs (White, Brown, Duck)
- Butter & Ghee
- Yogurt & Cheese

## 📦 Product Organization Best Practices

### 1. **Category-Based Organization**
✅ **DO:**
- Group related products under appropriate subcategories
- Use consistent naming conventions
- Keep stock levels realistic

❌ **DON'T:**
- Mix unrelated products in same subcategory
- Create too many main categories (keep 8-15)
- Have subcategories with less than 3 products

### 2. **Product Attributes**

Each product should have:

```javascript
{
  name: "Product Name",           // Clear, descriptive
  price: 120,                      // In BDT (Taka)
  stock: 100,                      // Available quantity
  unit: "kg",                      // kg, liter, piece, dozen, etc.
  featured: true/false,            // Show on homepage
  image: "url",                    // Product image URL
  description: "Details...",       // Product description
  tags: ["tag1", "tag2"]          // For search & filtering
}
```

### 3. **Units System**

Use these standard units:
- **Weight:** kg (kilograms)
- **Volume:** liter
- **Count:** piece, dozen
- **Package:** packet, box

## 🔧 How to Add New Products

### Method 1: Using Seed Script (Recommended for Bulk)

1. **Open:** `server/seed-professional.js`

2. **Add to `productCatalog` object:**

```javascript
'Fresh Vegetables': {
    'Root Vegetables': [
        // Add your new product here
        { 
            name: 'Sweet Potato', 
            price: 55, 
            stock: 120, 
            unit: 'kg', 
            featured: false,
            image: 'https://example.com/image.jpg'
        },
    ],
},
```

3. **Run the seed script:**
```bash
npm run seed:pro
```

### Method 2: Using API (For Single Products)

**POST** `http://localhost:5000/api/products`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

**Body:**
```json
{
  "name": "Sweet Potato",
  "price": 55,
  "category": "SUBCATEGORY_ID",
  "stock": 120,
  "unit": "kg",
  "description": "Fresh sweet potatoes",
  "images": ["https://example.com/image.jpg"],
  "featured": false,
  "tags": ["vegetables", "root vegetables"]
}
```

### Method 3: MongoDB Direct (Advanced)

```javascript
db.products.insertOne({
  name: "Sweet Potato",
  slug: "sweet-potato",
  price: 55,
  category: ObjectId("category_id"),
  stock: 120,
  unit: "kg",
  images: ["url"],
  featured: false,
  createdAt: new Date()
})
```

## 📁 Adding New Categories

### Add Main Category:

```javascript
{
    name: 'Frozen Foods',
    description: 'Frozen vegetables, meat, and ready meals',
    image: 'https://images.unsplash.com/photo-example?w=800',
    featured: true,
    order: 11,  // Display order
    subcategories: [
        { name: 'Frozen Vegetables', description: '...', order: 1 },
        { name: 'Frozen Meat', description: '...', order: 2 },
    ]
}
```

## 🎯 Featured Products Strategy

**What to Feature:**
1. **Best Sellers** - Popular items
2. **Seasonal Items** - Mangoes in summer, etc.
3. **High Margin** - Profitable products
4. **New Arrivals** - Fresh inventory
5. **Promotional** - Discounted items

**Limit:** 10-15 featured products for best UX

## 📊 Inventory Management Tips

### Stock Level Guidelines:

| Category | Min Stock | Max Stock | Reorder Point |
|----------|-----------|-----------|---------------|
| Perishables (Veg/Fruit) | 50 kg | 300 kg | 100 kg |
| Dairy | 30 units | 150 units | 50 units |
| Staples (Rice/Oil) | 200 kg | 1000 kg | 300 kg |
| Packaged Goods | 50 units | 500 units | 100 units |

### Stock Status Indicators:
- **High Stock:** > 100 units (Green)
- **Medium Stock:** 20-100 units (Yellow)
- **Low Stock:** < 20 units (Orange)
- **Out of Stock:** 0 units (Red - Auto-hide from listing)

## 🏷️ Pricing Strategy

### Competitive Pricing:
1. Research local market prices
2. Add 10-15% margin for online convenience
3. Offer bundle discounts
4. Use psychological pricing (₹99 instead of ₹100)

### Price Categories:
- **Budget:** Basic items, high competition
- **Premium:** Organic, imported items
- **Luxury:** Specialty products

## 🔍 SEO & Search Optimization

### Product Names:
```
✅ Good: "Miniket Rice (Premium)"
❌ Bad: "Rice1" or "MNK-RIC-001"
```

### Tags Best Practices:
- Use 3-5 relevant tags per product
- Include category names
- Add Bengali terms: "doi", "atta", "ilish"
- Use common search terms

### Example:
```javascript
tags: ['rice', 'miniket', 'premium', 'chawal', 'grain']
```

## 🔄 Updating Products

### Price Update (Bulk):
```javascript
// In MongoDB
db.products.updateMany(
    { category: "categoryId" },
    { $mul: { price: 1.10 } }  // 10% increase
)
```

### Stock Update:
```javascript
// Via API
PATCH /api/products/:id
{
  "stock": 150
}
```

## 📱 Category Display Order

Set the `order` field to control display sequence:

```javascript
order: 1  // First position
order: 2  // Second position
// etc.
```

**Homepage displays:** `featured: true` categories first, then by order.

## 🎨 Image Guidelines

### Recommended Specs:
- **Format:** JPG or WebP
- **Size:** 800x800px minimum
- **Aspect Ratio:** 1:1 (square)
- **File Size:** < 200KB (compressed)
- **Background:** White or neutral

### Free Image Sources:
- Unsplash (https://unsplash.com)
- Pexels (https://pexels.com)
- Pixabay (https://pixabay.com)

## 🚀 Quick Commands Reference

```bash
# Seed database with professional structure
npm run seed:pro

# Seed with basic structure
npm run seed

# Start backend server
npm run server:dev

# Start frontend
npm run dev

# View MongoDB data
mongo
use bangladeshi-supershop
db.products.find().pretty()
db.categories.find().pretty()
```

## 📈 Scaling Tips

### When to Add Subcategories:
- Main category has > 20 products
- Products can be logically grouped
- Improves user navigation

### When to Split Categories:
- Category has > 10 subcategories
- User confusion in navigation
- Better SEO opportunities

### Performance:
- Index frequently queried fields
- Cache category tree
- Paginate product listings
- Lazy load images

## 🔐 Access Control (Future Enhancement)

Consider adding:
- **Admin Role:** Full CRUD access
- **Manager Role:** Product updates only
- **Viewer Role:** Read-only access

## 📞 Support

Need help? Check:
1. `SETUP_GUIDE.md` - Setup instructions
2. API documentation in route files
3. MongoDB docs: https://docs.mongodb.com
4. Mongoose docs: https://mongoosejs.com

---

**Last Updated:** November 2025
**Database Version:** Professional v1.0
**Total Products:** 64 across 30 subcategories
