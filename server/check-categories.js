require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');

const checkCategories = async () => {
    try {
        await connectDB();
        
        console.log('📊 Checking all categories...\n');

        // Get all parent categories
        const parentCategories = await Category.find({ level: 1 }).lean();
        
        for (const cat of parentCategories) {
            // Count products directly in this category
            const directCount = await Product.countDocuments({ category: cat._id });
            
            // Get subcategories
            const subcategories = await Category.find({ parentCategory: cat._id }).lean();
            
            // Count products in subcategories
            let subCount = 0;
            for (const subcat of subcategories) {
                const sc = await Product.countDocuments({ category: subcat._id });
                subCount += sc;
            }
            
            const total = directCount + subCount;
            const icon = total > 0 ? '✅' : '❌';
            
            console.log(`${icon} ${cat.name}: ${directCount} direct + ${subCount} in subcategories = ${total} total`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkCategories();
