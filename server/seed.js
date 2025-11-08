require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

const slugify = require('slugify');

const categories = [
    {
        name: 'Fresh Vegetables',
        slug: slugify('Fresh Vegetables', { lower: true, strict: true }),
        description: 'Farm fresh vegetables delivered daily',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
        featured: true,
    },
    {
        name: 'Fresh Fruits',
        slug: slugify('Fresh Fruits', { lower: true, strict: true }),
        description: 'Seasonal fresh fruits',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
        featured: true,
    },
    {
        name: 'Dairy Products',
        slug: slugify('Dairy Products', { lower: true, strict: true }),
        description: 'Fresh milk, butter, cheese and yogurt',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800',
        featured: true,
    },
    {
        name: 'Rice & Flour',
        slug: slugify('Rice & Flour', { lower: true, strict: true }),
        description: 'Premium quality rice and flour',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
    },
    {
        name: 'Cooking Oil',
        slug: slugify('Cooking Oil', { lower: true, strict: true }),
        description: 'Pure cooking oils and ghee',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800',
    },
    {
        name: 'Beverages',
        slug: slugify('Beverages', { lower: true, strict: true }),
        description: 'Soft drinks, juices and more',
        image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800',
    },
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await Category.deleteMany();
        await Product.deleteMany();

        // Create categories
        console.log('Creating categories...');
        const createdCategories = [];
        for (const cat of categories) {
            const category = await Category.create(cat);
            createdCategories.push(category);
        }
        console.log(`✓ ${createdCategories.length} categories created`);

        // Create products for each category
        const products = [];

        // Fresh Vegetables
        const vegCategory = createdCategories.find(c => c.name === 'Fresh Vegetables');
        products.push(
            {
                name: 'Fresh Tomatoes',
                description: 'Farm fresh red tomatoes, rich in vitamins and perfect for cooking',
                price: 60,
                category: vegCategory._id,
                images: ['https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800'],
                stock: 100,
                unit: 'kg',
                featured: true,
                tags: ['fresh', 'vegetables', 'organic'],
            },
            {
                name: 'Green Chili',
                description: 'Spicy fresh green chilies',
                price: 40,
                category: vegCategory._id,
                images: ['https://images.unsplash.com/photo-1583468323330-9032ad490fed?w=800'],
                stock: 50,
                unit: 'kg',
                tags: ['fresh', 'vegetables', 'spicy'],
            },
            {
                name: 'Potatoes',
                description: 'Fresh potatoes from local farms',
                price: 35,
                category: vegCategory._id,
                images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800'],
                stock: 200,
                unit: 'kg',
                tags: ['fresh', 'vegetables'],
            },
            {
                name: 'Onions',
                description: 'Premium quality red onions',
                price: 50,
                category: vegCategory._id,
                images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800'],
                stock: 150,
                unit: 'kg',
                featured: true,
                tags: ['fresh', 'vegetables'],
            }
        );

        // Fresh Fruits
        const fruitCategory = createdCategories.find(c => c.name === 'Fresh Fruits');
        products.push(
            {
                name: 'Red Apples',
                description: 'Crispy and sweet imported apples',
                price: 280,
                category: fruitCategory._id,
                images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800'],
                stock: 80,
                unit: 'kg',
                featured: true,
                tags: ['fresh', 'fruits', 'imported'],
            },
            {
                name: 'Bananas',
                description: 'Fresh ripe bananas from local farms',
                price: 60,
                category: fruitCategory._id,
                images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800'],
                stock: 100,
                unit: 'dozen',
                tags: ['fresh', 'fruits', 'local'],
            },
            {
                name: 'Mangoes (Seasonal)',
                description: 'Sweet Bangladeshi mangoes',
                price: 150,
                category: fruitCategory._id,
                images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=800'],
                stock: 60,
                unit: 'kg',
                featured: true,
                tags: ['fresh', 'fruits', 'seasonal'],
            },
            {
                name: 'Orange',
                description: 'Juicy fresh oranges',
                price: 120,
                category: fruitCategory._id,
                images: ['https://images.unsplash.com/photo-1547514701-42782101795e?w=800'],
                stock: 70,
                unit: 'kg',
                tags: ['fresh', 'fruits'],
            }
        );

        // Dairy Products
        const dairyCategory = createdCategories.find(c => c.name === 'Dairy Products');
        products.push(
            {
                name: 'Fresh Milk',
                description: 'Farm fresh full cream milk',
                price: 65,
                category: dairyCategory._id,
                images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800'],
                stock: 50,
                unit: 'liter',
                featured: true,
                tags: ['dairy', 'fresh'],
            },
            {
                name: 'Butter',
                description: 'Pure cow butter',
                price: 450,
                category: dairyCategory._id,
                images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800'],
                stock: 30,
                unit: 'kg',
                tags: ['dairy'],
            },
            {
                name: 'Yogurt',
                description: 'Fresh homemade style yogurt',
                price: 80,
                category: dairyCategory._id,
                images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'],
                stock: 40,
                unit: 'kg',
                tags: ['dairy', 'fresh'],
            }
        );

        // Rice & Flour
        const riceCategory = createdCategories.find(c => c.name === 'Rice & Flour');
        products.push(
            {
                name: 'Miniket Rice',
                description: 'Premium quality miniket rice',
                price: 65,
                category: riceCategory._id,
                images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800'],
                stock: 500,
                unit: 'kg',
                featured: true,
                tags: ['rice', 'staple'],
            },
            {
                name: 'Wheat Flour (Atta)',
                description: 'Fine quality wheat flour',
                price: 52,
                category: riceCategory._id,
                images: ['https://images.unsplash.com/photo-1608197449339-7a80b9a8f7c1?w=800'],
                stock: 300,
                unit: 'kg',
                tags: ['flour', 'staple'],
            }
        );

        // Cooking Oil
        const oilCategory = createdCategories.find(c => c.name === 'Cooking Oil');
        products.push(
            {
                name: 'Soybean Oil',
                description: 'Pure soybean cooking oil',
                price: 185,
                category: oilCategory._id,
                images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'],
                stock: 200,
                unit: 'liter',
                featured: true,
                tags: ['oil', 'cooking'],
            },
            {
                name: 'Mustard Oil',
                description: 'Pure mustard oil',
                price: 220,
                category: oilCategory._id,
                images: ['https://images.unsplash.com/photo-1608418078698-90b62b658b43?w=800'],
                stock: 100,
                unit: 'liter',
                tags: ['oil', 'cooking'],
            }
        );

        // Beverages
        const beverageCategory = createdCategories.find(c => c.name === 'Beverages');
        products.push(
            {
                name: 'Coca Cola',
                description: 'Refreshing cola drink',
                price: 45,
                category: beverageCategory._id,
                images: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800'],
                stock: 100,
                unit: 'piece',
                tags: ['beverages', 'soft drinks'],
            },
            {
                name: 'Orange Juice',
                description: 'Fresh orange juice',
                price: 120,
                category: beverageCategory._id,
                images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800'],
                stock: 50,
                unit: 'liter',
                tags: ['beverages', 'juice'],
            }
        );

        // Insert products
        console.log('Creating products...');
        const createdProducts = [];
        for (const prod of products) {
            prod.slug = slugify(prod.name, { lower: true, strict: true });
            const product = await Product.create(prod);
            createdProducts.push(product);
        }
        console.log(`✓ ${createdProducts.length} products created`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\nYou can now:');
        console.log('1. Visit http://localhost:3000 to see products');
        console.log('2. Register an account to start shopping');
        console.log('3. Browse categories and add items to cart');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
