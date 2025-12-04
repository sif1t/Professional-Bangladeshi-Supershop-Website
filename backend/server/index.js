require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
// MongoDB Atlas Connected
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

<<<<<<< HEAD
// CORS middleware - Allow Vercel, Netlify, Render and localhost
=======
// CORS middleware - Enhanced for separate frontend/backend deployment
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview URLs
    /^https:\/\/.*\.netlify\.app$/, // Allow Netlify deployments
    /^https:\/\/.*\.onrender\.com$/, // Allow Render deployments
];

// Add additional origins from environment variable
if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    allowedOrigins.push(...additionalOrigins);
}

>>>>>>> 75d98113d20629b28259090bf7291b523b08c5c0
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
<<<<<<< HEAD

        // Allow localhost
        if (origin.includes('localhost')) return callback(null, true);

        // Allow Vercel domains
        if (origin.endsWith('.vercel.app')) return callback(null, true);

        // Allow Netlify domains
        if (origin.endsWith('.netlify.app')) return callback(null, true);

        // Allow Render domains
        if (origin.endsWith('.onrender.com')) return callback(null, true);

        // Allow specific frontend URL from env
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
=======

        // Check if origin matches allowed origins or patterns
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            }
            if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
>>>>>>> 75d98113d20629b28259090bf7291b523b08c5c0
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
