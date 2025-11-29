require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');

const testAddProduct = async () => {
    try {
        await connectDB();

        console.log('🔍 Finding a category...');
        const category = await Category.findOne();

        if (!category) {
            console.log('❌ No categories found. Run: npm run seed:pro');
            process.exit(1);
        }

        console.log('✅ Found category:', category.name);

        console.log('\n📦 Creating test product...');
        const product = await Product.create({
            name: 'Test Product ' + Date.now(),
            description: 'This is a test product',
            price: 100,
            category: category._id,
            stock: 50,
            unit: 'piece',
            images: [],
            tags: ['test'],
            isFeatured: false,
        });

        console.log('✅ Product created successfully!');
        console.log('Product ID:', product._id);
        console.log('Product Name:', product.name);
        console.log('Product Slug:', product.slug);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.errors) {
            console.error('Validation errors:');
            Object.keys(error.errors).forEach(key => {
                console.error(`  - ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

testAddProduct();
