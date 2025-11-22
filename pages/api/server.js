require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('../../server/config/db');
const errorHandler = require('../../server/middleware/errorHandler');

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware - allow all origins for Vercel
app.use(cors({
    origin: true,
    credentials: true,
}));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Connect to database once
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    await connectDB();
    isConnected = true;
};

// Routes
app.use('/api/auth', require('../../server/routes/auth'));
app.use('/api/products', require('../../server/routes/products'));
app.use('/api/categories', require('../../server/routes/categories'));
app.use('/api/orders', require('../../server/routes/orders'));
app.use('/api/payment', require('../../server/routes/payment'));
app.use('/api/admin', require('../../server/routes/admin'));
app.use('/api/upload', require('../../server/routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running on Vercel' });
});

// Error handler middleware
app.use(errorHandler);

// Serverless handler
module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};
