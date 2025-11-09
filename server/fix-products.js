require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const fixProducts = async () => {
    try {
        await connectDB();

        console.log('🔧 Fixing product fields...');

        // Update featured to isFeatured
        const result = await Product.updateMany(
            { featured: true },
            { $set: { isFeatured: true }, $unset: { featured: '' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} products`);

        // Count featured products
        const count = await Product.countDocuments({ isFeatured: true });
        console.log(`📊 Featured products: ${count}`);

        // Show some products
        const products = await Product.find().limit(5).select('name price isFeatured');
        console.log('\n📦 Sample products:');
        products.forEach(p => {
            console.log(`   - ${p.name} (₹${p.price}) ${p.isFeatured ? '⭐ FEATURED' : ''}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

fixProducts();
