require('dotenv').config();
const mongoose = require('mongoose');

const quickCheck = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bangladeshi-supershop');
        
        const Category = mongoose.model('Category', new mongoose.Schema({
            name: String,
            level: Number,
            parentCategory: mongoose.Schema.Types.ObjectId
        }));
        
        const Product = mongoose.model('Product', new mongoose.Schema({
            name: String,
            category: mongoose.Schema.Types.ObjectId
        }));
        
        const parentCats = await Category.find({ level: 1 }).lean();
        console.log(`\n📊 Checking ${parentCats.length} parent categories:\n`);
        
        for (const cat of parentCats) {
            const directCount = await Product.countDocuments({ category: cat._id });
            const subcats = await Category.find({ parentCategory: cat._id }).lean();
            
            let subCount = 0;
            for (const sub of subcats) {
                subCount += await Product.countDocuments({ category: sub._id });
            }
            
            const total = directCount + subCount;
            const icon = total > 0 ? '✅' : '❌';
            console.log(`${icon} ${cat.name}: ${total} products (${directCount} direct, ${subCount} in ${subcats.length} subcategories)`);
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

quickCheck();
