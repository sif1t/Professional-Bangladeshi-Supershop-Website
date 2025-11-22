require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('../../server/config/db');
const errorHandler = require('../../server/middleware/errorHandler');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware - allow all origins for Vercel
app.use(cors({
    origin: true,
    credentials: true,
}));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Database connection cache
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    
    try {
        await connectDB();
        cachedDb = true;
        return cachedDb;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

// Mount routes without /api prefix (Next.js already adds it)
app.use('/auth', require('../../server/routes/auth'));
app.use('/products', require('../../server/routes/products'));
app.use('/categories', require('../../server/routes/categories'));
app.use('/orders', require('../../server/routes/orders'));
app.use('/payment', require('../../server/routes/payment'));
app.use('/admin', require('../../server/routes/admin'));
app.use('/upload', require('../../server/routes/upload'));

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is running on Vercel' });
});

// Error handler middleware
app.use(errorHandler);

// Export handler for Next.js API routes
export default async function handler(req, res) {
    try {
        // Connect to database
        await connectToDatabase();
        
        // Let Express handle the request
        return app(req, res);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Disable body parsing, we'll handle it with Express
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
