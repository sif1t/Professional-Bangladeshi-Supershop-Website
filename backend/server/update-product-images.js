require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');

const updateProductImages = async () => {
    try {
        await connectDB();

        console.log('🖼️  Updating product images...\n');

        // Get all products with their categories
        const products = await Product.find({}).populate('category').lean();

        if (products.length === 0) {
            console.log('❌ No products found!');
            process.exit(1);
        }

        console.log(`📦 Found ${products.length} products\n`);

        // Category-specific image pools from Unsplash
        const imageLibrary = {
            vegetables: [
                'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', // tomatoes
                'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500', // cucumber
                'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500', // carrots
                'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500', // onions
                'https://images.unsplash.com/photo-1583663848850-46af23e86e5a?w=500', // green chili
                'https://images.unsplash.com/photo-1568584711271-e21d3fa9005b?w=500', // cauliflower
                'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500', // broccoli
                'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500', // bell peppers
                'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500', // leafy greens
                'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500', // potatoes
                'https://images.unsplash.com/photo-1590320216737-7c0f8b7c6e5f?w=500', // beetroot
                'https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=500', // eggplant
                'https://images.unsplash.com/photo-1566393477948-65e2b1c93b66?w=500', // spring onions
                'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500', // radish
                'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=500', // pumpkin
                'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500', // green peppers
                'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=500', // yellow peppers
                'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500', // english cucumber
                'https://images.unsplash.com/photo-1604093882750-3ed498f3178b?w=500', // green beans
                'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=500', // mint leaves
            ],
            fruits: [
                'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500', // bananas
                'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500', // red apples
                'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500', // green apples
                'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500', // mangoes
                'https://images.unsplash.com/photo-1599819177338-1971d2c03fb1?w=500', // green grapes
                'https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=500', // black grapes
                'https://images.unsplash.com/photo-1547514701-42782101795e?w=500', // oranges
                'https://images.unsplash.com/photo-1587049352846-4a222e784422?w=500', // watermelon
                'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500', // papaya
                'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', // pomegranate
                'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=500', // pineapple
                'https://images.unsplash.com/photo-1527325678964-54921661f888?w=500', // dragon fruit
                'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=500', // kiwi
                'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500', // strawberries
                'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500', // blueberries
                'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=500', // guava
                'https://images.unsplash.com/photo-1501055773068-2d588c83fc0e?w=500', // lychee
                'https://images.unsplash.com/photo-1589928475365-61c6bbc0d076?w=500', // coconut
                'https://images.unsplash.com/photo-1587485138061-8788b5c34641?w=500', // dates
                'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500', // fuji apples
                'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500', // mandarins
                'https://images.unsplash.com/photo-1623428454610-a1f11d94f4ea?w=500', // tender coconut
            ],
            dairy: [
                'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=500', // eggs
                'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500', // milk
                'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500', // butter
                'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500', // yogurt
                'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500', // cheese
                'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500', // ghee
                'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500', // paneer
                'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500', // cheddar
                'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500', // parmesan
                'https://images.unsplash.com/photo-1571212515726-065d38d1268c?w=500', // flavored yogurt
                'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500', // brown eggs
                'https://images.unsplash.com/photo-1576864094814-885a94b96d37?w=500', // sour cream
            ],
            rice: [
                'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', // rice
                'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', // basmati rice
                'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500', // jasmine rice
                'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500', // brown rice
                'https://images.unsplash.com/photo-1600347144554-e1ddb6e89611?w=500', // flour
                'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', // wheat flour
                'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500', // lentils
                'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', // pulses
            ],
            beverages: [
                'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500', // soft drinks
                'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=500', // juice
                'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500', // cola
                'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500', // soda
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500', // energy drink
                'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500', // water bottle
                'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', // orange juice
                'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500', // mango juice
            ],
            spices: [
                'https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=500', // spices
                'https://images.unsplash.com/photo-1596040033229-a0b2b5c8f8d0?w=500', // turmeric
                'https://images.unsplash.com/photo-1599909533554-f6d8e0dcb39d?w=500', // red chili
                'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500', // dried chili
                'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=500', // cinnamon
                'https://images.unsplash.com/photo-1519218040033-c7a6a2652a7f?w=500', // black pepper
                'https://images.unsplash.com/photo-1604135307399-86c6ce0d9d65?w=500', // cumin
                'https://images.unsplash.com/photo-1566127444979-b3d2b654e3b7?w=500', // masala
            ],
            bakery: [
                'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', // bread
                'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500', // buns
                'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500', // biscuits
                'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=500', // cookies
                'https://images.unsplash.com/photo-1600011690778-18b5022939c1?w=500', // chips
                'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500', // snacks
                'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500', // crackers
                'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500', // cake
            ],
            oil: [
                'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', // cooking oil
                'https://images.unsplash.com/photo-1608854328426-4c6fa2a7eee8?w=500', // olive oil
                'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500', // mustard oil
                'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500', // ghee
            ]
        };

        // Function to get random image from pool
        const getRandomImage = (pool) => {
            return pool[Math.floor(Math.random() * pool.length)];
        };

        // Function to determine image pool based on category
        const getImagePool = (categoryName) => {
            const name = categoryName.toLowerCase();

            if (name.includes('vegetable') || name.includes('leafy') || name.includes('root') || name.includes('exotic')) {
                return imageLibrary.vegetables;
            } else if (name.includes('fruit') || name.includes('local') || name.includes('imported') || name.includes('seasonal')) {
                return imageLibrary.fruits;
            } else if (name.includes('dairy') || name.includes('milk') || name.includes('egg') || name.includes('butter') || name.includes('ghee') || name.includes('yogurt') || name.includes('cheese')) {
                return imageLibrary.dairy;
            } else if (name.includes('rice') || name.includes('flour') || name.includes('pulses') || name.includes('lentils')) {
                return imageLibrary.rice;
            } else if (name.includes('beverage') || name.includes('drink') || name.includes('juice') || name.includes('soft')) {
                return imageLibrary.beverages;
            } else if (name.includes('spice') || name.includes('masala') || name.includes('whole') || name.includes('powder')) {
                return imageLibrary.spices;
            } else if (name.includes('bakery') || name.includes('bread') || name.includes('biscuit') || name.includes('cookie') || name.includes('chips') || name.includes('snack')) {
                return imageLibrary.bakery;
            } else if (name.includes('oil') || name.includes('ghee') || name.includes('cooking')) {
                return imageLibrary.oil;
            }

            // Default fallback
            return imageLibrary.vegetables;
        };

        let updatedCount = 0;

        // Update each product with unique images
        for (const product of products) {
            const categoryName = product.category?.name || 'General';
            const imagePool = getImagePool(categoryName);

            // Get 3-5 random unique images for each product
            const numImages = Math.floor(Math.random() * 3) + 3; // 3 to 5 images
            const productImages = [];
            const usedIndices = new Set();

            for (let i = 0; i < numImages; i++) {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * imagePool.length);
                } while (usedIndices.has(randomIndex) && usedIndices.size < imagePool.length);

                usedIndices.add(randomIndex);
                productImages.push(imagePool[randomIndex]);
            }

            await Product.findByIdAndUpdate(product._id, {
                images: productImages
            });

            updatedCount++;
            process.stdout.write(`\r✅ Updated ${updatedCount}/${products.length} products...`);
        }

        console.log('\n\n🎉 Successfully updated all product images!');
        console.log('🌐 Each product now has 3-5 unique images');
        console.log('📸 Images are categorized based on product type');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateProductImages();
