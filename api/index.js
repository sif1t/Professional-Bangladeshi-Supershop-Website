require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('../server/config/db');
const errorHandler = require('../server/middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/products', require('../server/routes/products'));
app.use('/api/categories', require('../server/routes/categories'));
app.use('/api/orders', require('../server/routes/orders'));
app.use('/api/payment', require('../server/routes/payment'));
app.use('/api/admin', require('../server/routes/admin'));
app.use('/api/upload', require('../server/routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running on Vercel' });
});

// Error handler middleware
app.use(errorHandler);

// Export for Vercel serverless
module.exports = app;
module.exports.default = app;
