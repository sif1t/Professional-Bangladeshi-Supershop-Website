# Frontend - Bangladeshi Supershop

Next.js frontend for the Professional Bangladeshi Supershop E-commerce Platform.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Run the Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

## 📁 Project Structure

```
frontend/
├── components/
│   ├── layout/
│   │   ├── Header.js          # Site header with navigation
│   │   ├── Footer.js          # Site footer
│   │   └── Layout.js          # Main layout wrapper
│   ├── products/
│   │   ├── ProductCard.js     # Product card component
│   │   └── ProductGrid.js     # Product grid layout
│   ├── shop/
│   │   └── FilterSidebar.js   # Product filters
│   └── ui/
│       ├── Pagination.js      # Pagination component
│       ├── QuantityStepper.js # Quantity selector
│       └── ImageZoom.js       # Product image zoom
├── context/
│   ├── AuthContext.js         # Authentication state
│   └── CartContext.js         # Shopping cart state
├── lib/
│   ├── axios.js               # Axios configuration
│   ├── utils.js               # Utility functions
│   ├── deliveryFee.js         # Delivery fee calculator
│   └── paymentGateway.js      # Payment integration
├── pages/
│   ├── _app.js                # App wrapper
│   ├── _document.js           # Document structure
│   ├── index.js               # Home page
│   ├── login.js               # Login page
│   ├── register.js            # Registration page
│   ├── cart.js                # Shopping cart
│   ├── checkout.js            # Checkout page
│   ├── search.js              # Search results
│   ├── track-order.js         # Order tracking
│   ├── product/
│   │   └── [slug].js          # Product details
│   ├── category/
│   │   └── [slug].js          # Category products
│   ├── account/
│   │   ├── dashboard.js       # User dashboard
│   │   ├── orders.js          # Order history
│   │   ├── addresses.js       # Saved addresses
│   │   └── settings.js        # Account settings
│   └── admin/
│       ├── index.js           # Admin dashboard
│       ├── products.js        # Product management
│       ├── orders.js          # Order management
│       └── categories.js      # Category management
├── public/
│   └── uploads/               # Uploaded files
├── styles/
│   └── globals.css            # Global styles
└── package.json
```

## 🎨 Pages Overview

### Public Pages
- **/** - Home page with featured products
- **/category/[slug]** - Category product listings
- **/product/[slug]** - Product details page
- **/search** - Search results
- **/cart** - Shopping cart
- **/checkout** - Checkout process
- **/login** - User login
- **/register** - User registration

### User Pages (Protected)
- **/account/dashboard** - User dashboard
- **/account/orders** - Order history
- **/account/orders/[id]** - Order details
- **/account/addresses** - Address management
- **/account/settings** - Account settings

### Admin Pages (Admin Only)
- **/admin** - Admin dashboard with stats
- **/admin/products** - Product management
- **/admin/add-product** - Add new product
- **/admin/orders** - Order management
- **/admin/categories** - Category management
- **/admin/manual-payments** - Manual payment verification

## 🔄 State Management

### Auth Context
Manages user authentication state:
- Login/logout functionality
- User profile data
- JWT token handling

```javascript
import { useAuth } from '@/context/AuthContext';

const { user, login, logout, loading } = useAuth();
```

### Cart Context
Manages shopping cart state:
- Add/remove items
- Update quantities
- Cart persistence

```javascript
import { useCart } from '@/context/CartContext';

const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
```

## 🛠️ Scripts

```bash
npm run dev         # Start development server (port 3000)
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

## 🌐 API Integration

All API calls are configured through `lib/axios.js` with automatic token handling:

```javascript
import axios from '@/lib/axios';

// GET request
const { data } = await axios.get('/products');

// POST request
const { data } = await axios.post('/orders', orderData);
```

## 🎨 Styling

Uses **Tailwind CSS** for styling with custom configuration:

- Responsive design (mobile-first)
- Custom color palette
- Reusable utility classes

## 📦 Key Features

- ✅ Server-side rendering (SSR)
- ✅ Static generation for performance
- ✅ Image optimization
- ✅ SEO friendly
- ✅ Responsive design
- ✅ Shopping cart with persistence
- ✅ User authentication
- ✅ Admin panel
- ✅ Order tracking
- ✅ Payment gateway integration

## 🔐 Authentication

Protected routes automatically redirect to login:

```javascript
// In pages
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## 🌐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API endpoint |
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Backend base URL |

**Note:** Next.js requires `NEXT_PUBLIC_` prefix for client-side variables.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configure environment variables in Vercel dashboard.

### Netlify
```bash
# Build the project
npm run build

# Deploy .next folder
```

### Static Export
For static hosting, configure in `next.config.js`:
```javascript
module.exports = {
  output: 'export',
}
```

Then run:
```bash
npm run build
```

## 🔧 Configuration Files

### next.config.js
Main Next.js configuration:
- Image domains
- Rewrites/redirects
- Environment variables

### tailwind.config.js
Tailwind CSS configuration:
- Custom colors
- Breakpoints
- Plugins

### jsconfig.json
Path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

## 🎯 Performance Optimization

- Image optimization with Next.js Image component
- Code splitting automatically
- Lazy loading for components
- SWR for efficient data fetching
- Local storage caching for cart

## 🐛 Debugging

Enable React strict mode in `next.config.js`:
```javascript
module.exports = {
  reactStrictMode: true,
}
```

## 📞 Support

For issues or questions about the frontend, check the main README.md or project documentation.

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
