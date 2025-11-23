require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const markFeaturedProducts = async () => {
    try {
        await connectDB();
        
        console.log('⭐ Marking featured products...');
        
        const featuredNames = [
            'Fresh Tomatoes',
            'Red Onions',
            'Potato (Alu)',
            'Bananas (Kola)',
            'Fresh Mangoes (Aam)',
            'Farm Fresh Eggs (12 pcs)',
            'Fresh Milk 1 Liter',
            'Miniket Rice (5kg)',
            'Basmati Rice Premium (5kg)',
            'Soybean Oil (5 liter)',
            'Pure Ghee Premium (1kg)',
            'Coca Cola 250ml (12 pack)',
            'Red Chilli Powder 200g',
            'Sliced Bread (400g)',
            'Potato Chips (100g)'
        ];
        
        const result = await Product.updateMany(
            { name: { $in: featuredNames } },
            { $set: { isFeatured: true } }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} products to featured`);
        
        const count = await Product.countDocuments({ isFeatured: true });
        console.log(`📊 Total featured products: ${count}`);
        
        console.log('\n⭐ Featured products:');
        const featured = await Product.find({ isFeatured: true }).select('name price');
        featured.forEach(p => console.log(`   - ${p.name} (৳${p.price})`));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

markFeaturedProducts();
