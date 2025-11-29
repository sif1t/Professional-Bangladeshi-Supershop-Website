require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const makeAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        console.log('🔍 Looking for users...');

        // Find user by mobile or name (you can modify this)
        const mobile = '01700000000'; // Change this to your mobile number
        const name = 'Ariyan'; // Or change this to your name

        let user = await User.findOne({ $or: [{ mobile }, { name }] });

        if (!user) {
            // If no user found, create an admin user
            console.log('❌ User not found. Creating new admin user...');

            user = await User.create({
                name: 'Admin',
                mobile: '01700000000',
                password: 'admin123',
                role: 'admin',
            });

            console.log('✅ Admin user created successfully!');
            console.log('📱 Mobile: 01700000000');
            console.log('🔑 Password: admin123');
        } else {
            // Update existing user to admin
            user.role = 'admin';
            await user.save();

            console.log('✅ User updated to admin successfully!');
            console.log(`👤 Name: ${user.name}`);
            console.log(`📱 Mobile: ${user.mobile}`);
            console.log(`🔐 Role: ${user.role}`);
        }

        console.log('\n🎉 Done! You can now access admin features.');
        console.log('🌐 Login at: http://localhost:3000/login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

makeAdmin();
