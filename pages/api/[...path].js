require('dotenv').config();
const connectDB = require('../../server/config/db');

// Database connection cache
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        return;
    }
    
    try {
        await connectDB();
        isConnected = true;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

// Import route handlers
const authRoutes = require('../../server/routes/auth');
const productsRoutes = require('../../server/routes/products');
const categoriesRoutes = require('../../server/routes/categories');
const ordersRoutes = require('../../server/routes/orders');
const paymentRoutes = require('../../server/routes/payment');
const adminRoutes = require('../../server/routes/admin');
const uploadRoutes = require('../../server/routes/upload');

// Export handler for Next.js API routes
export default async function handler(req, res) {
    try {
        // Connect to database
        await connectToDatabase();
        
        // Enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        
        // Handle preflight
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        
        // Get the path array from Next.js
        const pathArray = req.query.path || [];
        const firstPath = pathArray[0];
        
        // Create a mock Express-like request object
        const mockReq = {
            ...req,
            url: '/' + pathArray.slice(1).join('/') + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''),
            path: '/' + pathArray.slice(1).join('/'),
            originalUrl: req.url,
            params: {},
            query: req.query,
            body: req.body,
            headers: req.headers,
            method: req.method,
            cookies: req.cookies || {}
        };
        
        const mockRes = {
            ...res,
            status: (code) => {
                res.status(code);
                return mockRes;
            },
            json: (data) => {
                return res.json(data);
            },
            send: (data) => {
                return res.send(data);
            }
        };
        
        // Route to appropriate handler
        switch(firstPath) {
            case 'auth':
                return authRoutes(mockReq, mockRes, () => {});
            case 'products':
                return productsRoutes(mockReq, mockRes, () => {});
            case 'categories':
                return categoriesRoutes(mockReq, mockRes, () => {});
            case 'orders':
                return ordersRoutes(mockReq, mockRes, () => {});
            case 'payment':
                return paymentRoutes(mockReq, mockRes, () => {});
            case 'admin':
                return adminRoutes(mockReq, mockRes, () => {});
            case 'upload':
                return uploadRoutes(mockReq, mockRes, () => {});
            default:
                return res.status(404).json({ success: false, message: 'Route not found' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred'
        });
    }
}// Disable body parsing, we'll handle it with Express
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
