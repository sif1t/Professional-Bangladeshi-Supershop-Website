require('dotenv').config();
const mongoose = require('mongoose');

const listCategories = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bangladeshi-supershop');
        
        const Category = mongoose.model('Category', new mongoose.Schema({
            name: String,
            level: Number,
            parentCategory: mongoose.Schema.Types.ObjectId
        }));
        
        const parentCats = await Category.find({ level: 1 }).lean();
        
        console.log('\n📋 All Categories:\n');
        
        for (const parent of parentCats) {
            console.log(`\n${parent.name} (ID: ${parent._id})`);
            const subcats = await Category.find({ parentCategory: parent._id }).lean();
            for (const sub of subcats) {
                console.log(`  ├─ ${sub.name} (ID: ${sub._id})`);
            }
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

listCategories();
