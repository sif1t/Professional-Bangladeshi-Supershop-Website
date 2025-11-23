const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('../../../server/config/db');
const authRoutes = require('../../../server/routes/auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use('/', authRoutes);

let isConnected = false;

export default async function handler(req, res) {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
    
    // Reconstruct URL for Express
    const slug = req.query.slug || [];
    req.url = '/' + slug.join('/');
    
    return app(req, res);
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
