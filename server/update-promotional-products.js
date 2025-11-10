require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const updatePromotionalProducts = async () => {
    try {
        await connectDB();

        console.log('🏷️  Updating products with promotional tags...\n');

        // Get all products
        const allProducts = await Product.find({}).lean();

        if (allProducts.length === 0) {
            console.log('❌ No products found!');
            process.exit(1);
        }

        console.log(`📦 Found ${allProducts.length} products\n`);

        // Randomly assign promotional flags to products
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());

        // Best Saving (20-30 products with good discounts)
        const bestSavingProducts = shuffled.slice(0, 25);
        for (const product of bestSavingProducts) {
            await Product.findByIdAndUpdate(product._id, {
                isBestSaving: true,
                onSale: true,
                salePrice: Math.floor(product.price * 0.85) // 15% off
            });
        }
        console.log(`💰 Updated ${bestSavingProducts.length} products as Best Saving`);

        // New Arrivals (20-30 latest products)
        const newArrivalProducts = shuffled.slice(25, 50);
        for (const product of newArrivalProducts) {
            await Product.findByIdAndUpdate(product._id, {
                isNewArrival: true
            });
        }
        console.log(`✨ Updated ${newArrivalProducts.length} products as New Arrivals`);

        // Buy Get Free (15-20 products)
        const buyGetFreeProducts = shuffled.slice(50, 68);
        for (const product of buyGetFreeProducts) {
            await Product.findByIdAndUpdate(product._id, {
                isBuyGetFree: true,
                buyGetFreeDetails: {
                    buy: Math.floor(Math.random() * 2) + 1, // Buy 1 or 2
                    get: 1 // Get 1 free
                }
            });
        }
        console.log(`🎁 Updated ${buyGetFreeProducts.length} products as Buy Get Free`);

        // On Sale (30-40 products with various discounts)
        const onSaleProducts = shuffled.slice(68, 108);
        for (const product of onSaleProducts) {
            const discountPercent = [5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 6)];
            await Product.findByIdAndUpdate(product._id, {
                onSale: true,
                salePrice: Math.floor(product.price * (1 - discountPercent / 100))
            });
        }
        console.log(`⚡ Updated ${onSaleProducts.length} products as On Sale`);

        // Verify counts
        const counts = {
            featured: await Product.countDocuments({ isFeatured: true }),
            bestSaving: await Product.countDocuments({ isBestSaving: true }),
            newArrivals: await Product.countDocuments({ isNewArrival: true }),
            buyGetFree: await Product.countDocuments({ isBuyGetFree: true }),
            onSale: await Product.countDocuments({ onSale: true })
        };

        console.log('\n📊 Final Counts:');
        console.log(`   ⭐ Featured: ${counts.featured}`);
        console.log(`   💰 Best Saving: ${counts.bestSaving}`);
        console.log(`   ✨ New Arrivals: ${counts.newArrivals}`);
        console.log(`   🎁 Buy Get Free: ${counts.buyGetFree}`);
        console.log(`   ⚡ On Sale: ${counts.onSale}`);

        console.log('\n🎉 Successfully updated promotional products!');
        console.log('🌐 Refresh your homepage to see the changes!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updatePromotionalProducts();
