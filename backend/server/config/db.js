const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/supershop';

        console.log('🔌 Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`\n❌ MongoDB Connection Failed!`);
        console.error(`Error: ${error.message}\n`);

        // If Atlas connection fails
        if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv')) {
            console.error('🔧 MongoDB Atlas Connection Issue Detected!\n');
            console.error('📋 Solutions:');
            console.error('   1. Whitelist your IP address in MongoDB Atlas:');
            console.error('      - Go to: https://cloud.mongodb.com');
            console.error('      - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
            console.error('   2. Or use local MongoDB:');
            console.error('      - Install MongoDB Community Server');
            console.error('      - Or comment out MONGODB_URI in .env to use local connection\n');

            // Try local fallback
            console.log('🔄 Attempting local MongoDB connection...');
            try {
                const localConn = await mongoose.connect('mongodb://localhost:27017/supershop', {
                    serverSelectionTimeoutMS: 5000,
                });
                console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
                return localConn;
            } catch (localError) {
                console.error(`❌ Local MongoDB not available: ${localError.message}\n`);
            }
        }

        console.error('⛔ Cannot start server without database connection.\n');
        process.exit(1);
    }
};

module.exports = connectDB;
