require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const slugify = require('slugify');

// Professional Category Structure with Main Categories and Subcategories
const categoryStructure = [
    {
        name: 'Fresh Vegetables',
        description: 'Farm fresh vegetables delivered daily',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
        featured: true,
        order: 1,
        subcategories: [
            { name: 'Leafy Vegetables', description: 'Spinach, lettuce, and greens', order: 1 },
            { name: 'Root Vegetables', description: 'Potatoes, carrots, radish', order: 2 },
            { name: 'Exotic Vegetables', description: 'Broccoli, capsicum, zucchini', order: 3 },
        ]
    },
    {
        name: 'Fresh Fruits',
        description: 'Seasonal fresh fruits',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
        featured: true,
        order: 2,
        subcategories: [
            { name: 'Local Fruits', description: 'Bananas, mangoes, jackfruit', order: 1 },
            { name: 'Imported Fruits', description: 'Apples, grapes, oranges', order: 2 },
            { name: 'Seasonal Fruits', description: 'Limited availability fruits', order: 3 },
        ]
    },
    {
        name: 'Dairy & Eggs',
        description: 'Fresh milk, eggs, and dairy products',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800',
        featured: true,
        order: 3,
        subcategories: [
            { name: 'Milk', description: 'Fresh and packaged milk', order: 1 },
            { name: 'Eggs', description: 'Farm fresh eggs', order: 2 },
            { name: 'Butter & Ghee', description: 'Pure butter and ghee', order: 3 },
            { name: 'Yogurt & Cheese', description: 'Fresh yogurt and cheese', order: 4 },
        ]
    },
    {
        name: 'Rice, Flour & Pulses',
        description: 'Premium quality staples',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
        featured: true,
        order: 4,
        subcategories: [
            { name: 'Rice', description: 'All varieties of rice', order: 1 },
            { name: 'Flour', description: 'Wheat, corn, and rice flour', order: 2 },
            { name: 'Pulses & Lentils', description: 'Dal and legumes', order: 3 },
        ]
    },
    {
        name: 'Cooking Oil & Ghee',
        description: 'Pure cooking oils and ghee',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800',
        featured: false,
        order: 5,
        subcategories: [
            { name: 'Cooking Oil', description: 'Soybean, sunflower, mustard oil', order: 1 },
            { name: 'Ghee', description: 'Pure cow and vegetable ghee', order: 2 },
        ]
    },
    {
        name: 'Beverages',
        description: 'Soft drinks, juices, and beverages',
        image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800',
        featured: false,
        order: 6,
        subcategories: [
            { name: 'Soft Drinks', description: 'Cola and carbonated drinks', order: 1 },
            { name: 'Juices', description: 'Fruit and vegetable juices', order: 2 },
            { name: 'Tea & Coffee', description: 'Tea leaves and coffee', order: 3 },
        ]
    },
    {
        name: 'Meat & Fish',
        description: 'Fresh meat and seafood',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800',
        featured: true,
        order: 7,
        subcategories: [
            { name: 'Chicken', description: 'Fresh chicken and poultry', order: 1 },
            { name: 'Beef & Mutton', description: 'Premium quality meat', order: 2 },
            { name: 'Fish', description: 'Fresh river and sea fish', order: 3 },
        ]
    },
    {
        name: 'Spices & Masala',
        description: 'Premium quality spices and masalas',
        image: 'https://images.unsplash.com/photo-1596040033229-a0b34b36f3bd?w=800',
        featured: false,
        order: 8,
        subcategories: [
            { name: 'Whole Spices', description: 'Cardamom, cinnamon, cloves', order: 1 },
            { name: 'Powdered Spices', description: 'Turmeric, chili, coriander powder', order: 2 },
            { name: 'Masala Blends', description: 'Ready-made spice mixes', order: 3 },
        ]
    },
    {
        name: 'Bakery & Snacks',
        description: 'Bread, biscuits, and snacks',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
        featured: false,
        order: 9,
        subcategories: [
            { name: 'Bread & Buns', description: 'Fresh bread and buns', order: 1 },
            { name: 'Biscuits & Cookies', description: 'All varieties of biscuits', order: 2 },
            { name: 'Chips & Snacks', description: 'Chips and namkeen', order: 3 },
        ]
    },
    {
        name: 'Personal Care',
        description: 'Health and hygiene products',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
        featured: false,
        order: 10,
        subcategories: [
            { name: 'Soap & Handwash', description: 'Bathing and hand soaps', order: 1 },
            { name: 'Hair Care', description: 'Shampoo and hair oil', order: 2 },
            { name: 'Oral Care', description: 'Toothpaste and mouthwash', order: 3 },
        ]
    },
];

// Professional Product Catalog
const productCatalog = {
    'Fresh Vegetables': {
        'Leafy Vegetables': [
            { name: 'Spinach (Palong Shak)', price: 30, stock: 50, unit: 'kg', featured: false },
            { name: 'Red Amaranth (Lal Shak)', price: 35, stock: 40, unit: 'kg', featured: false },
            { name: 'Lettuce', price: 80, stock: 25, unit: 'kg', featured: false },
        ],
        'Root Vegetables': [
            { name: 'Potatoes', price: 35, stock: 300, unit: 'kg', featured: true, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800' },
            { name: 'Onions (Red)', price: 50, stock: 250, unit: 'kg', featured: true, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800' },
            { name: 'Carrots', price: 60, stock: 100, unit: 'kg', featured: false },
            { name: 'Radish (Mula)', price: 40, stock: 80, unit: 'kg', featured: false },
        ],
        'Exotic Vegetables': [
            { name: 'Broccoli', price: 150, stock: 30, unit: 'kg', featured: true },
            { name: 'Capsicum (Green)', price: 120, stock: 50, unit: 'kg', featured: false },
            { name: 'Zucchini', price: 180, stock: 20, unit: 'kg', featured: false },
        ],
    },
    'Fresh Fruits': {
        'Local Fruits': [
            { name: 'Bananas (Ripe)', price: 60, stock: 150, unit: 'dozen', featured: true, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800' },
            { name: 'Mangoes (Fazli)', price: 150, stock: 80, unit: 'kg', featured: true, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800' },
            { name: 'Papaya', price: 40, stock: 100, unit: 'kg', featured: false },
            { name: 'Guava', price: 80, stock: 70, unit: 'kg', featured: false },
        ],
        'Imported Fruits': [
            { name: 'Red Apples (Kashmir)', price: 280, stock: 100, unit: 'kg', featured: true, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800' },
            { name: 'Green Grapes', price: 350, stock: 50, unit: 'kg', featured: true },
            { name: 'Oranges (Malta)', price: 120, stock: 90, unit: 'kg', featured: false, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=800' },
            { name: 'Kiwi', price: 450, stock: 30, unit: 'kg', featured: false },
        ],
        'Seasonal Fruits': [
            { name: 'Watermelon', price: 35, stock: 60, unit: 'kg', featured: false },
            { name: 'Lychee', price: 200, stock: 40, unit: 'kg', featured: false },
        ],
    },
    'Dairy & Eggs': {
        'Milk': [
            { name: 'Fresh Cow Milk', price: 70, stock: 100, unit: 'liter', featured: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800' },
            { name: 'Aarong Milk (Full Cream)', price: 85, stock: 80, unit: 'liter', featured: true },
            { name: 'Milk Vita (Powder)', price: 650, stock: 50, unit: 'kg', featured: false },
        ],
        'Eggs': [
            { name: 'Farm Eggs (White)', price: 140, stock: 200, unit: 'dozen', featured: true },
            { name: 'Farm Eggs (Brown)', price: 160, stock: 150, unit: 'dozen', featured: false },
            { name: 'Duck Eggs', price: 180, stock: 80, unit: 'dozen', featured: false },
        ],
        'Butter & Ghee': [
            { name: 'Pure Cow Butter', price: 500, stock: 40, unit: 'kg', featured: false, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800' },
            { name: 'Aarong Pure Ghee', price: 850, stock: 30, unit: 'kg', featured: true },
        ],
        'Yogurt & Cheese': [
            { name: 'Fresh Yogurt (Doi)', price: 90, stock: 60, unit: 'kg', featured: false, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800' },
            { name: 'Cheddar Cheese', price: 650, stock: 25, unit: 'kg', featured: false },
        ],
    },
    'Rice, Flour & Pulses': {
        'Rice': [
            { name: 'Miniket Rice (Premium)', price: 70, stock: 500, unit: 'kg', featured: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800' },
            { name: 'Basmati Rice (Indian)', price: 120, stock: 300, unit: 'kg', featured: true },
            { name: 'Atap Rice (Parboiled)', price: 55, stock: 400, unit: 'kg', featured: false },
            { name: 'Brown Rice (Organic)', price: 95, stock: 150, unit: 'kg', featured: false },
        ],
        'Flour': [
            { name: 'Wheat Flour/Atta', price: 52, stock: 400, unit: 'kg', featured: true, image: 'https://images.unsplash.com/photo-1608197449339-7a80b9a8f7c1?w=800' },
            { name: 'Maida (All Purpose)', price: 48, stock: 300, unit: 'kg', featured: false },
            { name: 'Corn Flour', price: 85, stock: 100, unit: 'kg', featured: false },
        ],
        'Pulses & Lentils': [
            { name: 'Masoor Dal (Red Lentils)', price: 110, stock: 200, unit: 'kg', featured: false },
            { name: 'Mung Dal (Yellow)', price: 130, stock: 180, unit: 'kg', featured: true },
            { name: 'Chickpeas (Boot)', price: 95, stock: 150, unit: 'kg', featured: false },
        ],
    },
    'Cooking Oil & Ghee': {
        'Cooking Oil': [
            { name: 'Soybean Oil (Fresh)', price: 185, stock: 300, unit: 'liter', featured: true, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800' },
            { name: 'Mustard Oil (Pure)', price: 220, stock: 200, unit: 'liter', featured: true, image: 'https://images.unsplash.com/photo-1608418078698-90b62b658b43?w=800' },
            { name: 'Sunflower Oil', price: 195, stock: 150, unit: 'liter', featured: false },
            { name: 'Olive Oil (Extra Virgin)', price: 850, stock: 50, unit: 'liter', featured: false },
        ],
        'Ghee': [
            { name: 'Pure Cow Ghee', price: 900, stock: 80, unit: 'kg', featured: true },
            { name: 'Vegetable Ghee (Dalda)', price: 280, stock: 120, unit: 'kg', featured: false },
        ],
    },
    'Beverages': {
        'Soft Drinks': [
            { name: 'Coca Cola (2L)', price: 90, stock: 150, unit: 'bottle', featured: false, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800' },
            { name: 'Sprite (2L)', price: 90, stock: 120, unit: 'bottle', featured: false },
            { name: 'Pepsi (2L)', price: 90, stock: 100, unit: 'bottle', featured: false },
        ],
        'Juices': [
            { name: 'Pran Orange Juice (1L)', price: 120, stock: 80, unit: 'bottle', featured: false, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800' },
            { name: 'Pran Mango Juice (1L)', price: 120, stock: 90, unit: 'bottle', featured: false },
            { name: 'Fresh Coconut Water', price: 50, stock: 100, unit: 'piece', featured: false },
        ],
        'Tea & Coffee': [
            { name: 'Ispahani Tea (Premium)', price: 450, stock: 100, unit: 'kg', featured: true },
            { name: 'Finlay Tea', price: 380, stock: 120, unit: 'kg', featured: false },
            { name: 'Nescafe Classic Coffee', price: 850, stock: 60, unit: 'kg', featured: false },
        ],
    },
    'Meat & Fish': {
        'Chicken': [
            { name: 'Broiler Chicken (Whole)', price: 180, stock: 100, unit: 'kg', featured: true },
            { name: 'Chicken Breast (Boneless)', price: 350, stock: 50, unit: 'kg', featured: true },
            { name: 'Chicken Leg Quarter', price: 190, stock: 80, unit: 'kg', featured: false },
        ],
        'Beef & Mutton': [
            { name: 'Beef (Premium Cut)', price: 650, stock: 80, unit: 'kg', featured: true },
            { name: 'Mutton (Goat)', price: 950, stock: 50, unit: 'kg', featured: true },
            { name: 'Beef Bone (for soup)', price: 280, stock: 60, unit: 'kg', featured: false },
        ],
        'Fish': [
            { name: 'Rohu Fish (Rui)', price: 380, stock: 70, unit: 'kg', featured: true },
            { name: 'Hilsa Fish (Ilish)', price: 1200, stock: 30, unit: 'kg', featured: true },
            { name: 'Pangas Fish', price: 220, stock: 90, unit: 'kg', featured: false },
        ],
    },
};

const seedProfessionalData = async () => {
    try {
        await connectDB();
        console.log('🚀 Starting professional database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Category.deleteMany();
        await Product.deleteMany();

        // Create categories with subcategories
        console.log('📁 Creating categories and subcategories...');
        const categoryMap = new Map();
        let totalProducts = 0;

        for (const catData of categoryStructure) {
            // Create main category
            const mainCategory = await Category.create({
                name: catData.name,
                slug: slugify(catData.name, { lower: true, strict: true }),
                description: catData.description,
                image: catData.image,
                featured: catData.featured,
                order: catData.order,
                level: 1,
            });

            categoryMap.set(catData.name, { main: mainCategory, subs: {} });
            console.log(`  ✓ ${catData.name}`);

            // Create subcategories
            if (catData.subcategories) {
                for (const subCat of catData.subcategories) {
                    const subCategory = await Category.create({
                        name: subCat.name,
                        slug: slugify(subCat.name, { lower: true, strict: true }),
                        description: subCat.description,
                        parentCategory: mainCategory._id,
                        order: subCat.order,
                        level: 2,
                    });
                    categoryMap.get(catData.name).subs[subCat.name] = subCategory;
                    console.log(`    └─ ${subCat.name}`);
                }
            }
        }

        console.log('\n📦 Creating products...');

        // Create products organized by categories
        for (const [mainCatName, subCategories] of Object.entries(productCatalog)) {
            const catInfo = categoryMap.get(mainCatName);

            for (const [subCatName, products] of Object.entries(subCategories)) {
                const subCategory = catInfo.subs[subCatName];

                for (const productData of products) {
                    const product = await Product.create({
                        name: productData.name,
                        slug: slugify(productData.name, { lower: true, strict: true }),
                        description: productData.description || `High quality ${productData.name.toLowerCase()} from trusted suppliers`,
                        price: productData.price,
                        category: subCategory._id,
                        images: productData.image ? [productData.image] : ['https://images.unsplash.com/photo-1543168256-418811576931?w=800'],
                        stock: productData.stock,
                        unit: productData.unit,
                        featured: productData.featured || false,
                        tags: [mainCatName.toLowerCase(), subCatName.toLowerCase()],
                    });
                    totalProducts++;
                }
                console.log(`  ✓ ${subCatName}: ${products.length} products`);
            }
        }

        console.log('\n✅ Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   • Main Categories: ${categoryStructure.length}`);
        console.log(`   • Subcategories: ${Array.from(categoryMap.values()).reduce((sum, cat) => sum + Object.keys(cat.subs).length, 0)}`);
        console.log(`   • Total Products: ${totalProducts}`);
        console.log('\n🌐 Your website is ready at: http://localhost:3000');
        console.log('🛍️  Start shopping now!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedProfessionalData();
