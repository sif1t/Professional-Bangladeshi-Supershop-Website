require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

const addMissingProducts = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bangladeshi-supershop');
        console.log('MongoDB Connected');

        console.log('🛒 Adding products for missing categories...\n');

        // Wait a moment for models to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get all categories with their IDs
        const cats = await Category.find().lean();
        const getCat = (name) => cats.find(c => c.name === name)?._id;

        console.log(`Found ${cats.length} categories`);
        console.log('Looking for: Rice, Flour, Pulses & Lentils, Cooking Oil, Ghee, Soft Drinks, etc.\n');

        const riceId = getCat('Rice');
        const flourId = getCat('Flour');
        const pulsesId = getCat('Pulses & Lentils');
        const oilId = getCat('Cooking Oil');
        const gheeId = getCat('Ghee');
        const drinksId = getCat('Soft Drinks');
        const powderedSpicesId = getCat('Powdered Spices');
        const wholeSpicesId = getCat('Whole Spices');
        const masalaId = getCat('Masala Blends');
        const breadId = getCat('Bread & Buns');
        const biscuitsId = getCat('Biscuits & Cookies');
        const snacksId = getCat('Chips & Snacks');
        const soapId = getCat('Soap & Handwash');
        const hairId = getCat('Hair Care');
        const oralId = getCat('Oral Care');

        console.log('Category IDs found:');
        console.log('Rice:', riceId);
        console.log('Flour:', flourId);
        console.log('Pulses & Lentils:', pulsesId);
        console.log('Cooking Oil:', oilId);
        console.log('Ghee:', gheeId);
        console.log('Soft Drinks:', drinksId);
        console.log('Powdered Spices:', powderedSpicesId);
        console.log('Whole Spices:', wholeSpicesId);
        console.log('Masala Blends:', masalaId);
        console.log('Bread & Buns:', breadId);
        console.log('Biscuits & Cookies:', biscuitsId);
        console.log('Chips & Snacks:', snacksId);
        console.log('Soap & Handwash:', soapId);
        console.log('Hair Care:', hairId);
        console.log('Oral Care:', oralId);

        const allProducts = [];

        // Rice products
        if (riceId) {
            allProducts.push(
                {
                    name: 'Miniket Rice Premium (মিনিকেট চাল)',
                    slug: 'miniket-rice-premium',
                    price: 95,
                    stock: 150,
                    unit: 'kg',
                    category: riceId,
                    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80', 'https://images.unsplash.com/photo-1516684810095-065c11e5b555?w=500&q=80'],
                    tags: ['rice', 'miniket', 'premium'],
                    isFeatured: true
                },
                {
                    name: 'Nazirshail Rice (নাজিরশাইল চাল)',
                    slug: 'nazirshail-rice',
                    price: 85,
                    stock: 200,
                    unit: 'kg',
                    category: riceId,
                    images: ['https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&q=80'],
                    tags: ['rice', 'nazirshail']
                },
                {
                    name: 'Basmati Rice Premium',
                    slug: 'basmati-rice-premium',
                    price: 160,
                    stock: 100,
                    unit: 'kg',
                    category: riceId,
                    images: ['https://images.unsplash.com/photo-1612432840765-e30d82f9a3d0?w=500&q=80'],
                    tags: ['rice', 'basmati']
                },
                {
                    name: 'Parboiled Rice (সিদ্ধ চাল)',
                    slug: 'parboiled-rice',
                    price: 78,
                    stock: 180,
                    unit: 'kg',
                    category: riceId,
                    images: ['https://images.unsplash.com/photo-1516684810095-065c11e5b555?w=500&q=80'],
                    tags: ['rice', 'parboiled']
                }
            );
        }

        // Flour products
        if (flourId) {
            allProducts.push(
                {
                    name: 'Teer Atta (Whole Wheat Flour)',
                    slug: 'teer-atta-whole-wheat',
                    price: 62,
                    stock: 200,
                    unit: 'kg',
                    category: flourId,
                    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80'],
                    tags: ['flour', 'atta']
                },
                {
                    name: 'Fresh Maida (All Purpose Flour)',
                    slug: 'fresh-maida-flour',
                    price: 58,
                    stock: 150,
                    unit: 'kg',
                    category: flourId,
                    images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80'],
                    tags: ['flour', 'maida']
                },
                {
                    name: 'Suji (Semolina)',
                    slug: 'suji-semolina',
                    price: 70,
                    stock: 100,
                    unit: 'kg',
                    category: flourId,
                    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80'],
                    tags: ['flour', 'suji']
                }
            );
        }

        // Pulses products
        if (pulsesId) {
            allProducts.push(
                {
                    name: 'Masoor Dal (Red Lentils)',
                    slug: 'masoor-dal-red-lentils',
                    price: 120,
                    stock: 150,
                    unit: 'kg',
                    category: pulsesId,
                    images: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80'],
                    tags: ['dal', 'lentils']
                },
                {
                    name: 'Mug Dal (Green Gram)',
                    slug: 'mug-dal-green-gram',
                    price: 140,
                    stock: 120,
                    unit: 'kg',
                    category: pulsesId,
                    images: ['https://images.unsplash.com/photo-1615485500834-bc10199bc1b4?w=500&q=80'],
                    tags: ['dal', 'mung']
                },
                {
                    name: 'Chana Dal (Chickpea)',
                    slug: 'chana-dal-chickpea',
                    price: 110,
                    stock: 130,
                    unit: 'kg',
                    category: pulsesId,
                    images: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80'],
                    tags: ['dal', 'chickpea']
                }
            );
        }

        // Oil products
        if (oilId) {
            allProducts.push(
                {
                    name: 'Teer Soybean Oil',
                    slug: 'teer-soybean-oil',
                    price: 190,
                    stock: 200,
                    unit: 'liter',
                    category: oilId,
                    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80'],
                    tags: ['oil', 'soybean'],
                    isFeatured: true
                },
                {
                    name: 'Fresh Soybean Oil',
                    slug: 'fresh-soybean-oil',
                    price: 185,
                    stock: 180,
                    unit: 'liter',
                    category: oilId,
                    images: ['https://images.unsplash.com/photo-1608181831042-c6ab37d1c619?w=500&q=80'],
                    tags: ['oil', 'soybean']
                },
                {
                    name: 'Rupchanda Soybean Oil',
                    slug: 'rupchanda-soybean-oil',
                    price: 195,
                    stock: 150,
                    unit: 'liter',
                    category: oilId,
                    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80'],
                    tags: ['oil', 'rupchanda']
                },
                {
                    name: 'Radhuni Mustard Oil',
                    slug: 'radhuni-mustard-oil',
                    price: 220,
                    stock: 100,
                    unit: 'liter',
                    category: oilId,
                    images: ['https://images.unsplash.com/photo-1608181831042-c6ab37d1c619?w=500&q=80'],
                    tags: ['oil', 'mustard']
                }
            );
        }

        // Ghee products
        if (gheeId) {
            allProducts.push(
                {
                    name: 'Pran Pure Ghee',
                    slug: 'pran-pure-ghee',
                    price: 850,
                    stock: 80,
                    unit: 'kg',
                    category: gheeId,
                    images: ['https://images.unsplash.com/photo-1628735718159-fd99c5a9e6f6?w=500&q=80'],
                    tags: ['ghee', 'pran']
                },
                {
                    name: 'Aarong Cow Ghee',
                    slug: 'aarong-cow-ghee',
                    price: 950,
                    stock: 60,
                    unit: 'kg',
                    category: gheeId,
                    images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80'],
                    tags: ['ghee', 'aarong']
                }
            );
        }

        // Soft Drinks
        if (drinksId) {
            allProducts.push(
                {
                    name: 'Coca-Cola 2L',
                    slug: 'coca-cola-2l',
                    price: 110,
                    stock: 200,
                    unit: 'bottle',
                    category: drinksId,
                    images: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80'],
                    tags: ['cola', 'soft drink'],
                    isFeatured: true
                },
                {
                    name: 'Pepsi 2L',
                    slug: 'pepsi-2l',
                    price: 110,
                    stock: 180,
                    unit: 'bottle',
                    category: drinksId,
                    images: ['https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&q=80'],
                    tags: ['cola', 'pepsi']
                },
                {
                    name: 'PRAN Mango Juice 1L',
                    slug: 'pran-mango-juice-1l',
                    price: 95,
                    stock: 150,
                    unit: 'bottle',
                    category: drinksId,
                    images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80'],
                    tags: ['juice', 'mango']
                },
                {
                    name: 'PRAN Litchi Juice 1L',
                    slug: 'pran-litchi-juice-1l',
                    price: 95,
                    stock: 140,
                    unit: 'bottle',
                    category: drinksId,
                    images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80'],
                    tags: ['juice', 'litchi']
                },
                {
                    name: 'Sprite 2L',
                    slug: 'sprite-2l',
                    price: 110,
                    stock: 160,
                    unit: 'bottle',
                    category: drinksId,
                    images: ['https://images.unsplash.com/photo-1625740444976-ba8bb8ff9a9b?w=500&q=80'],
                    tags: ['soft drink', 'sprite']
                },
                {
                    name: 'Fanta Orange 2L',
                    slug: 'fanta-orange-2l',
                    price: 110,
                    stock: 150,
                    unit: 'bottle',
                    category: drinksId,
                    images: ['https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500&q=80'],
                    tags: ['soft drink', 'fanta']
                }
            );
        }

        // Powdered Spices
        if (powderedSpicesId) {
            allProducts.push(
                {
                    name: 'Radhuni Turmeric Powder (হলুদ)',
                    slug: 'radhuni-turmeric-powder',
                    price: 45,
                    stock: 200,
                    unit: '100g',
                    category: powderedSpicesId,
                    images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80'],
                    tags: ['spice', 'turmeric'],
                    isFeatured: true
                },
                {
                    name: 'Radhuni Chili Powder (মরিচ)',
                    slug: 'radhuni-chili-powder',
                    price: 50,
                    stock: 180,
                    unit: '100g',
                    category: powderedSpicesId,
                    images: ['https://images.unsplash.com/photo-1596040033229-a0b3b1d1ca90?w=500&q=80'],
                    tags: ['spice', 'chili']
                },
                {
                    name: 'Radhuni Cumin Powder (জিরা)',
                    slug: 'radhuni-cumin-powder',
                    price: 55,
                    stock: 150,
                    unit: '100g',
                    category: powderedSpicesId,
                    images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80'],
                    tags: ['spice', 'cumin']
                },
                {
                    name: 'Radhuni Coriander Powder (ধনিয়া)',
                    slug: 'radhuni-coriander-powder',
                    price: 48,
                    stock: 160,
                    unit: '100g',
                    category: powderedSpicesId,
                    images: ['https://images.unsplash.com/photo-1596040033229-a0b3b1d1ca90?w=500&q=80'],
                    tags: ['spice', 'coriander']
                }
            );
        }

        // Whole Spices
        if (wholeSpicesId) {
            allProducts.push(
                {
                    name: 'Bay Leaf (তেজপাতা)',
                    slug: 'bay-leaf-tejpata',
                    price: 80,
                    stock: 100,
                    unit: '50g',
                    category: wholeSpicesId,
                    images: ['https://images.unsplash.com/photo-1596040033229-a0b3b1d1ca90?w=500&q=80'],
                    tags: ['spice', 'bay leaf']
                },
                {
                    name: 'Cinnamon Sticks (দারুচিনি)',
                    slug: 'cinnamon-sticks',
                    price: 120,
                    stock: 80,
                    unit: '50g',
                    category: wholeSpicesId,
                    images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80'],
                    tags: ['spice', 'cinnamon']
                },
                {
                    name: 'Cardamom (এলাচ)',
                    slug: 'cardamom-elach',
                    price: 350,
                    stock: 60,
                    unit: '50g',
                    category: wholeSpicesId,
                    images: ['https://images.unsplash.com/photo-1596040033229-a0b3b1d1ca90?w=500&q=80'],
                    tags: ['spice', 'cardamom']
                }
            );
        }

        // Masala Blends
        if (masalaId) {
            allProducts.push(
                {
                    name: 'Radhuni Biryani Masala',
                    slug: 'radhuni-biryani-masala',
                    price: 65,
                    stock: 150,
                    unit: '100g',
                    category: masalaId,
                    images: ['https://images.unsplash.com/photo-1596040033229-a0b3b1d1ca90?w=500&q=80'],
                    tags: ['masala', 'biryani']
                },
                {
                    name: 'Radhuni Meat Curry Masala',
                    slug: 'radhuni-meat-curry-masala',
                    price: 60,
                    stock: 140,
                    unit: '100g',
                    category: masalaId,
                    images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80'],
                    tags: ['masala', 'curry']
                },
                {
                    name: 'Radhuni Garam Masala',
                    slug: 'radhuni-garam-masala',
                    price: 70,
                    stock: 130,
                    unit: '100g',
                    category: masalaId,
                    images: ['https://images.unsplash.com/photo-1596040033229-a0b3b1d1ca90?w=500&q=80'],
                    tags: ['masala', 'garam']
                }
            );
        }

        // Bread & Buns
        if (breadId) {
            allProducts.push(
                {
                    name: 'Fresh Bread Sliced',
                    slug: 'fresh-bread-sliced',
                    price: 45,
                    stock: 200,
                    unit: 'pack',
                    category: breadId,
                    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'],
                    tags: ['bread', 'fresh'],
                    isFeatured: true
                },
                {
                    name: 'Brown Bread Whole Wheat',
                    slug: 'brown-bread-whole-wheat',
                    price: 55,
                    stock: 150,
                    unit: 'pack',
                    category: breadId,
                    images: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc3c?w=500&q=80'],
                    tags: ['bread', 'brown']
                },
                {
                    name: 'Pav Ruti (Burger Bun)',
                    slug: 'pav-ruti-burger-bun',
                    price: 60,
                    stock: 120,
                    unit: 'pack',
                    category: breadId,
                    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'],
                    tags: ['bread', 'bun']
                }
            );
        }

        // Biscuits & Cookies
        if (biscuitsId) {
            allProducts.push(
                {
                    name: 'Olympic Milk Biscuit',
                    slug: 'olympic-milk-biscuit',
                    price: 30,
                    stock: 250,
                    unit: 'pack',
                    category: biscuitsId,
                    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80'],
                    tags: ['biscuit', 'olympic']
                },
                {
                    name: 'Lexus Chocolate Biscuit',
                    slug: 'lexus-chocolate-biscuit',
                    price: 35,
                    stock: 200,
                    unit: 'pack',
                    category: biscuitsId,
                    images: ['https://images.unsplash.com/photo-1606313564559-52bde7d56c26?w=500&q=80'],
                    tags: ['biscuit', 'chocolate']
                },
                {
                    name: 'Danish Butter Cookies',
                    slug: 'danish-butter-cookies',
                    price: 280,
                    stock: 80,
                    unit: 'tin',
                    category: biscuitsId,
                    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80'],
                    tags: ['cookies', 'butter']
                }
            );
        }

        // Chips & Snacks
        if (snacksId) {
            allProducts.push(
                {
                    name: 'Pran Mr. Twist Chips',
                    slug: 'pran-mr-twist-chips',
                    price: 20,
                    stock: 300,
                    unit: 'pack',
                    category: snacksId,
                    images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80'],
                    tags: ['chips', 'pran']
                },
                {
                    name: 'Bombay Sweets Chanachur',
                    slug: 'bombay-sweets-chanachur',
                    price: 25,
                    stock: 250,
                    unit: 'pack',
                    category: snacksId,
                    images: ['https://images.unsplash.com/photo-1600952841320-db92ec8b34fd?w=500&q=80'],
                    tags: ['chanachur', 'snack']
                },
                {
                    name: 'Mojo Potato Crackers',
                    slug: 'mojo-potato-crackers',
                    price: 22,
                    stock: 280,
                    unit: 'pack',
                    category: snacksId,
                    images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80'],
                    tags: ['crackers', 'potato']
                }
            );
        }

        // Soap & Handwash
        if (soapId) {
            allProducts.push(
                {
                    name: 'Lux Velvet Touch Soap',
                    slug: 'lux-velvet-touch-soap',
                    price: 35,
                    stock: 300,
                    unit: 'piece',
                    category: soapId,
                    images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80'],
                    tags: ['soap', 'lux'],
                    isFeatured: true
                },
                {
                    name: 'Sandalina Sandal Soap',
                    slug: 'sandalina-sandal-soap',
                    price: 32,
                    stock: 250,
                    unit: 'piece',
                    category: soapId,
                    images: ['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&q=80'],
                    tags: ['soap', 'sandal']
                },
                {
                    name: 'Lifebuoy Total Soap',
                    slug: 'lifebuoy-total-soap',
                    price: 30,
                    stock: 280,
                    unit: 'piece',
                    category: soapId,
                    images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80'],
                    tags: ['soap', 'lifebuoy']
                }
            );
        }

        // Hair Care
        if (hairId) {
            allProducts.push(
                {
                    name: 'Sunsilk Shampoo 400ml',
                    slug: 'sunsilk-shampoo-400ml',
                    price: 220,
                    stock: 150,
                    unit: 'bottle',
                    category: hairId,
                    images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&q=80'],
                    tags: ['shampoo', 'sunsilk']
                },
                {
                    name: 'Clear Men Shampoo 400ml',
                    slug: 'clear-men-shampoo-400ml',
                    price: 240,
                    stock: 130,
                    unit: 'bottle',
                    category: hairId,
                    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80'],
                    tags: ['shampoo', 'clear']
                },
                {
                    name: 'Pantene Conditioner 350ml',
                    slug: 'pantene-conditioner-350ml',
                    price: 280,
                    stock: 100,
                    unit: 'bottle',
                    category: hairId,
                    images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&q=80'],
                    tags: ['conditioner', 'pantene']
                }
            );
        }

        // Oral Care
        if (oralId) {
            allProducts.push(
                {
                    name: 'Pepsodent Toothpaste 200g',
                    slug: 'pepsodent-toothpaste-200g',
                    price: 95,
                    stock: 200,
                    unit: 'tube',
                    category: oralId,
                    images: ['https://images.unsplash.com/photo-1622786041757-9e08a11d0bf9?w=500&q=80'],
                    tags: ['toothpaste', 'pepsodent']
                },
                {
                    name: 'Sensodyne Toothpaste 100g',
                    slug: 'sensodyne-toothpaste-100g',
                    price: 145,
                    stock: 150,
                    unit: 'tube',
                    category: oralId,
                    images: ['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80'],
                    tags: ['toothpaste', 'sensodyne']
                },
                {
                    name: 'Colgate Toothbrush',
                    slug: 'colgate-toothbrush',
                    price: 45,
                    stock: 180,
                    unit: 'piece',
                    category: oralId,
                    images: ['https://images.unsplash.com/photo-1622786041757-9e08a11d0bf9?w=500&q=80'],
                    tags: ['toothbrush', 'colgate']
                }
            );
        }

        console.log(`\n📦 Prepared ${allProducts.length} products to add\n`);

        // Insert products
        let added = 0;
        for (const product of allProducts) {
            try {
                await Product.create(product);
                added++;
                process.stdout.write(`\r✅ Added ${added}/${allProducts.length} products`);
            } catch (error) {
                console.error(`\n❌ Error adding ${product.name}:`, error.message);
            }
        }

        console.log(`\n\n🎉 Successfully added ${added} products!`);

        const total = await Product.countDocuments();
        console.log(`📊 Total products in database: ${total}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

addMissingProducts();
