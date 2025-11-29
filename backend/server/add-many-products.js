require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');

const addManyProducts = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});

        console.log('📦 Fetching categories...');
        const categories = await Category.find();

        if (categories.length === 0) {
            console.log('❌ No categories found. Run: npm run seed:pro');
            process.exit(1);
        }

        // Create a category map for easy lookup
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        console.log('✨ Adding products to database...\n');

        // FRESH VEGETABLES
        const vegetables = [
            { name: 'Fresh Tomatoes', price: 80, stock: 200, unit: 'kg', featured: true, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea'], tags: ['fresh', 'vegetables', 'tomatoes'] },
            { name: 'Green Cucumber', price: 50, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1604977042946-1eecc30f269e'], tags: ['fresh', 'vegetables', 'cucumber'] },
            { name: 'Fresh Carrots', price: 70, stock: 180, unit: 'kg', images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'], tags: ['fresh', 'vegetables', 'carrots'] },
            { name: 'Red Onions', price: 60, stock: 250, unit: 'kg', featured: true, images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb'], tags: ['fresh', 'vegetables', 'onions'] },
            { name: 'Green Chilli', price: 120, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1583663848850-46af23e86e5a'], tags: ['fresh', 'vegetables', 'chilli', 'spicy'] },
            { name: 'Fresh Cauliflower', price: 90, stock: 120, unit: 'kg', images: ['https://images.unsplash.com/photo-1568584711271-e21d3fa9005b'], tags: ['fresh', 'vegetables', 'cauliflower'] },
            { name: 'Broccoli', price: 150, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'], tags: ['fresh', 'vegetables', 'broccoli', 'exotic'] },
            { name: 'Bell Peppers Mix', price: 200, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83'], tags: ['fresh', 'vegetables', 'peppers'] },
            { name: 'Fresh Spinach (Palong Shak)', price: 40, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb'], tags: ['fresh', 'vegetables', 'leafy', 'spinach'] },
            { name: 'Potato (Alu)', price: 50, stock: 500, unit: 'kg', featured: true, images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655'], tags: ['fresh', 'vegetables', 'potato', 'staple'] },
        ];

        // FRESH FRUITS
        const fruits = [
            { name: 'Bananas (Kola)', price: 60, stock: 200, unit: 'dozen', featured: true, images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'], tags: ['fresh', 'fruits', 'bananas', 'local'] },
            { name: 'Apples (Red Delicious)', price: 180, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'], tags: ['fresh', 'fruits', 'apples', 'imported'] },
            { name: 'Fresh Mangoes (Aam)', price: 150, stock: 120, unit: 'kg', featured: true, images: ['https://images.unsplash.com/photo-1553279768-865429fa0078'], tags: ['fresh', 'fruits', 'mangoes', 'seasonal'] },
            { name: 'Green Grapes', price: 220, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1599819177338-1971d2c03fb1'], tags: ['fresh', 'fruits', 'grapes', 'imported'] },
            { name: 'Oranges (Malta)', price: 160, stock: 180, unit: 'kg', images: ['https://images.unsplash.com/photo-1547514701-42782101795e'], tags: ['fresh', 'fruits', 'oranges', 'citrus'] },
            { name: 'Fresh Watermelon', price: 40, stock: 200, unit: 'kg', images: ['https://images.unsplash.com/photo-1587049352846-4a222e784422'], tags: ['fresh', 'fruits', 'watermelon', 'summer'] },
            { name: 'Papaya (Pepe)', price: 80, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1517282009859-f000ec3b26fe'], tags: ['fresh', 'fruits', 'papaya', 'local'] },
            { name: 'Pomegranate (Dalim)', price: 250, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5'], tags: ['fresh', 'fruits', 'pomegranate', 'premium'] },
            { name: 'Pineapple (Anaras)', price: 70, stock: 120, unit: 'piece', images: ['https://images.unsplash.com/photo-1550828520-4cb496926fc9'], tags: ['fresh', 'fruits', 'pineapple'] },
            { name: 'Dragon Fruit', price: 300, stock: 60, unit: 'kg', images: ['https://images.unsplash.com/photo-1527325678964-54921661f888'], tags: ['fresh', 'fruits', 'dragonfruit', 'exotic'] },
        ];

        // DAIRY & EGGS
        const dairy = [
            { name: 'Farm Fresh Eggs (12 pcs)', price: 120, stock: 300, unit: 'dozen', featured: true, images: ['https://images.unsplash.com/photo-1518569656558-1f25e69d93d7'], tags: ['dairy', 'eggs', 'fresh', 'protein'] },
            { name: 'Fresh Milk 1 Liter', price: 80, stock: 200, unit: 'liter', featured: true, images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b'], tags: ['dairy', 'milk', 'fresh'] },
            { name: 'Pure Butter (Aarong)', price: 350, stock: 100, unit: 'packet', images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d'], tags: ['dairy', 'butter', 'premium'] },
            { name: 'Fresh Yogurt (Doi) 500g', price: 80, stock: 150, unit: 'piece', images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777'], tags: ['dairy', 'yogurt', 'fresh'] },
            { name: 'Cheese Slices (200g)', price: 250, stock: 120, unit: 'packet', images: ['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d'], tags: ['dairy', 'cheese', 'imported'] },
            { name: 'Pure Ghee (500g)', price: 600, stock: 80, unit: 'bottle', images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da'], tags: ['dairy', 'ghee', 'cooking'] },
            { name: 'Condensed Milk', price: 180, stock: 150, unit: 'can', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b'], tags: ['dairy', 'milk', 'sweet'] },
            { name: 'Cream Cheese (200g)', price: 320, stock: 60, unit: 'packet', images: ['https://images.unsplash.com/photo-1452195100486-9cc805987862'], tags: ['dairy', 'cheese', 'premium'] },
        ];

        // RICE, FLOUR & PULSES
        const grains = [
            { name: 'Miniket Rice (5kg)', price: 400, stock: 500, unit: 'packet', featured: true, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c'], tags: ['rice', 'miniket', 'staple'] },
            { name: 'Basmati Rice Premium (5kg)', price: 600, stock: 300, unit: 'packet', featured: true, images: ['https://images.unsplash.com/photo-1536304929831-aaa645f8b565'], tags: ['rice', 'basmati', 'premium'] },
            { name: 'Atta Wheat Flour (2kg)', price: 120, stock: 400, unit: 'packet', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff'], tags: ['flour', 'wheat', 'atta'] },
            { name: 'Maida Flour (1kg)', price: 60, stock: 350, unit: 'packet', images: ['https://images.unsplash.com/photo-1628273876255-d34c95e3f87f'], tags: ['flour', 'maida', 'baking'] },
            { name: 'Red Lentils (Masoor Dal) 1kg', price: 140, stock: 250, unit: 'kg', images: ['https://images.unsplash.com/photo-1596040033229-a0b73b7f6f3f'], tags: ['pulses', 'lentils', 'dal'] },
            { name: 'Yellow Lentils (Mug Dal) 1kg', price: 160, stock: 220, unit: 'kg', images: ['https://images.unsplash.com/photo-1596040033229-a0b73b7f6f3f'], tags: ['pulses', 'lentils', 'dal'] },
            { name: 'Chickpeas (Chola) 1kg', price: 120, stock: 200, unit: 'kg', images: ['https://images.unsplash.com/photo-1626200419199-391ae4be7a41'], tags: ['pulses', 'chickpeas'] },
            { name: 'Brown Rice Organic (1kg)', price: 180, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1516684732162-798a0062be99'], tags: ['rice', 'organic', 'healthy'] },
        ];

        // COOKING OIL & GHEE
        const oils = [
            { name: 'Soybean Oil (5 liter)', price: 650, stock: 200, unit: 'bottle', featured: true, images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'], tags: ['oil', 'soybean', 'cooking'] },
            { name: 'Mustard Oil (1 liter)', price: 180, stock: 180, unit: 'bottle', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'], tags: ['oil', 'mustard', 'cooking'] },
            { name: 'Olive Oil Extra Virgin (500ml)', price: 850, stock: 80, unit: 'bottle', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'], tags: ['oil', 'olive', 'premium', 'healthy'] },
            { name: 'Sunflower Oil (5 liter)', price: 700, stock: 150, unit: 'bottle', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5'], tags: ['oil', 'sunflower', 'cooking'] },
            { name: 'Pure Ghee Premium (1kg)', price: 1200, stock: 100, unit: 'jar', featured: true, images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da'], tags: ['ghee', 'premium', 'pure'] },
        ];

        // BEVERAGES
        const beverages = [
            { name: 'Coca Cola 250ml (12 pack)', price: 300, stock: 200, unit: 'packet', featured: true, images: ['https://images.unsplash.com/photo-1554866585-cd94860890b7'], tags: ['drinks', 'cola', 'soft-drink'] },
            { name: 'Sprite 2 Liter', price: 110, stock: 180, unit: 'bottle', images: ['https://images.unsplash.com/photo-1625772299848-391b6a87d7b3'], tags: ['drinks', 'sprite', 'soft-drink'] },
            { name: 'Mango Juice 1 Liter (Pran)', price: 150, stock: 150, unit: 'bottle', images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba'], tags: ['drinks', 'juice', 'mango'] },
            { name: 'Orange Juice Fresh (1 liter)', price: 200, stock: 120, unit: 'bottle', images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba'], tags: ['drinks', 'juice', 'orange', 'fresh'] },
            { name: 'Green Tea Bags (25 pcs)', price: 180, stock: 200, unit: 'box', images: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9'], tags: ['drinks', 'tea', 'green-tea', 'healthy'] },
            { name: 'Coffee Powder Nescafe (200g)', price: 450, stock: 150, unit: 'jar', images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e'], tags: ['drinks', 'coffee', 'instant'] },
            { name: 'Energy Drink Red Bull', price: 200, stock: 100, unit: 'can', images: ['https://images.unsplash.com/photo-1622543925917-763c34f5a006'], tags: ['drinks', 'energy', 'redbull'] },
            { name: 'Mineral Water 1 Liter (Mum)', price: 20, stock: 500, unit: 'bottle', images: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d'], tags: ['drinks', 'water', 'mineral'] },
        ];

        // MEAT & FISH
        const meat = [
            { name: 'Chicken Broiler (1kg)', price: 180, stock: 150, unit: 'kg', featured: true, images: ['https://images.unsplash.com/photo-1587593810167-a84920ea0781'], tags: ['meat', 'chicken', 'fresh', 'halal'] },
            { name: 'Beef Curry Cut (1kg)', price: 650, stock: 100, unit: 'kg', featured: true, images: ['https://images.unsplash.com/photo-1602470520998-f4a52199a3d6'], tags: ['meat', 'beef', 'fresh', 'halal'] },
            { name: 'Mutton (Khasi) 1kg', price: 850, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1602470520998-f4a52199a3d6'], tags: ['meat', 'mutton', 'fresh', 'halal', 'premium'] },
            { name: 'Rui Fish (Whole)', price: 350, stock: 120, unit: 'kg', images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da'], tags: ['fish', 'rui', 'fresh'] },
            { name: 'Hilsa Fish (Ilish)', price: 1200, stock: 50, unit: 'kg', featured: true, images: ['https://images.unsplash.com/photo-1534483509719-3feaee7c30da'], tags: ['fish', 'hilsa', 'premium', 'fresh'] },
            { name: 'Prawn Large (Chingri)', price: 800, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47'], tags: ['fish', 'prawn', 'seafood', 'fresh'] },
        ];

        // SPICES & MASALA
        const spices = [
            { name: 'Turmeric Powder (Holud) 200g', price: 80, stock: 250, unit: 'packet', images: ['https://images.unsplash.com/photo-1615485500834-bc10199bc356'], tags: ['spices', 'turmeric', 'powder'] },
            { name: 'Red Chilli Powder 200g', price: 120, stock: 200, unit: 'packet', featured: true, images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398'], tags: ['spices', 'chilli', 'powder', 'hot'] },
            { name: 'Cumin Seeds (Jeera) 100g', price: 100, stock: 180, unit: 'packet', images: ['https://images.unsplash.com/photo-1596040033229-a0b73b7f6f3f'], tags: ['spices', 'cumin', 'seeds'] },
            { name: 'Coriander Powder (Dhoniya) 200g', price: 90, stock: 200, unit: 'packet', images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398'], tags: ['spices', 'coriander', 'powder'] },
            { name: 'Garam Masala 100g', price: 150, stock: 150, unit: 'packet', images: ['https://images.unsplash.com/photo-1596040033229-a0b73b7f6f3f'], tags: ['spices', 'masala', 'garam'] },
            { name: 'Biryani Masala 50g', price: 80, stock: 180, unit: 'packet', images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398'], tags: ['spices', 'masala', 'biryani'] },
            { name: 'Black Pepper Whole 100g', price: 180, stock: 120, unit: 'packet', images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398'], tags: ['spices', 'pepper', 'black'] },
            { name: 'Cinnamon Sticks (Daruchini) 50g', price: 120, stock: 100, unit: 'packet', images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398'], tags: ['spices', 'cinnamon'] },
        ];

        // BAKERY & SNACKS
        const bakery = [
            { name: 'Sliced Bread (400g)', price: 50, stock: 200, unit: 'packet', featured: true, images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff'], tags: ['bakery', 'bread', 'fresh'] },
            { name: 'Butter Biscuits (400g)', price: 120, stock: 250, unit: 'packet', images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35'], tags: ['snacks', 'biscuits', 'butter'] },
            { name: 'Potato Chips (100g)', price: 30, stock: 300, unit: 'packet', featured: true, images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b'], tags: ['snacks', 'chips', 'potato'] },
            { name: 'Chocolate Cookies (200g)', price: 150, stock: 180, unit: 'packet', images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e'], tags: ['snacks', 'cookies', 'chocolate'] },
            { name: 'Cake Rusk (400g)', price: 80, stock: 200, unit: 'packet', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff'], tags: ['bakery', 'rusk', 'tea-snack'] },
            { name: 'Chanachur Mix (200g)', price: 60, stock: 220, unit: 'packet', images: ['https://images.unsplash.com/photo-1599490659213-e2b9527bd087'], tags: ['snacks', 'chanachur', 'spicy'] },
            { name: 'Noodles Instant (400g)', price: 40, stock: 350, unit: 'packet', images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624'], tags: ['snacks', 'noodles', 'instant'] },
            { name: 'Popcorn (200g)', price: 80, stock: 150, unit: 'packet', images: ['https://images.unsplash.com/photo-1578849278619-e73505e9610f'], tags: ['snacks', 'popcorn'] },
        ];

        // Combine all products
        const allProducts = [
            ...vegetables.map(p => ({ ...p, category: categoryMap['Leafy Vegetables'] || categoryMap['Fresh Vegetables'] })),
            ...fruits.map(p => ({ ...p, category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] })),
            ...dairy.map(p => ({ ...p, category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] })),
            ...grains.map(p => ({ ...p, category: categoryMap['Rice'] || categoryMap['Rice, Flour & Pulses'] })),
            ...oils.map(p => ({ ...p, category: categoryMap['Cooking Oil & Ghee'] })),
            ...beverages.map(p => ({ ...p, category: categoryMap['Soft Drinks'] || categoryMap['Beverages'] })),
            ...meat.map(p => ({ ...p, category: categoryMap['Chicken & Poultry'] || categoryMap['Meat & Fish'] })),
            ...spices.map(p => ({ ...p, category: categoryMap['Powdered Spices'] || categoryMap['Spices & Masala'] })),
            ...bakery.map(p => ({ ...p, category: categoryMap['Bread'] || categoryMap['Bakery & Snacks'] })),
        ];

        // Add products in batches
        let addedCount = 0;
        for (const productData of allProducts) {
            try {
                await Product.create(productData);
                addedCount++;
                process.stdout.write(`\r✅ Added ${addedCount}/${allProducts.length} products...`);
            } catch (error) {
                console.log(`\n❌ Error adding ${productData.name}:`, error.message);
            }
        }

        console.log('\n\n🎉 Successfully added products!');
        console.log(`📊 Total products: ${addedCount}`);
        console.log('\n📋 Summary:');
        console.log(`   - Fresh Vegetables: ${vegetables.length}`);
        console.log(`   - Fresh Fruits: ${fruits.length}`);
        console.log(`   - Dairy & Eggs: ${dairy.length}`);
        console.log(`   - Rice, Flour & Pulses: ${grains.length}`);
        console.log(`   - Cooking Oil & Ghee: ${oils.length}`);
        console.log(`   - Beverages: ${beverages.length}`);
        console.log(`   - Meat & Fish: ${meat.length}`);
        console.log(`   - Spices & Masala: ${spices.length}`);
        console.log(`   - Bakery & Snacks: ${bakery.length}`);

        console.log('\n🌐 View your products at:');
        console.log('   - Homepage: http://localhost:3000');
        console.log('   - Admin Panel: http://localhost:3000/admin/products');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

addManyProducts();
