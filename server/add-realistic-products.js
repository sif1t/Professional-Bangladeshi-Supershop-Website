require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');

const addRealisticProducts = async () => {
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

        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        console.log('✨ Adding realistic products...\n');

        const allProducts = [];

        // ========== FRESH VEGETABLES ==========
        const vegetables = [
            { name: 'Fresh Tomatoes (Local)', price: 80, stock: 200, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea'], tags: ['fresh', 'vegetables', 'tomatoes', 'local'], category: categoryMap['Leafy Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Cherry Tomatoes (Imported)', price: 180, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1592841200221-4e11b4b68da9'], tags: ['fresh', 'vegetables', 'cherry tomatoes', 'imported'], category: categoryMap['Exotic Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Green Cucumber', price: 50, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1604719312566-8912e9227c6a'], tags: ['fresh', 'vegetables', 'cucumber'], category: categoryMap['Fresh Vegetables'] },
            { name: 'English Cucumber', price: 120, stock: 60, unit: 'kg', images: ['https://images.unsplash.com/photo-1449300079323-02e209d9d3a6'], tags: ['fresh', 'vegetables', 'cucumber', 'imported'], category: categoryMap['Exotic Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Fresh Carrots (Deshi)', price: 70, stock: 180, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'], tags: ['fresh', 'vegetables', 'carrots', 'local'], category: categoryMap['Root Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Baby Carrots (Premium)', price: 200, stock: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1582515073490-39981397c445'], tags: ['fresh', 'vegetables', 'carrots', 'premium'], category: categoryMap['Exotic Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Red Onions (Peyaj)', price: 60, stock: 300, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb'], tags: ['fresh', 'vegetables', 'onions', 'essential'], category: categoryMap['Fresh Vegetables'] },
            { name: 'White Onions', price: 75, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1508747703725-719777637510'], tags: ['fresh', 'vegetables', 'onions'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Spring Onions (Peyajkoli)', price: 40, stock: 120, unit: 'bundle', images: ['https://images.unsplash.com/photo-1566393477948-65e2b1c93b66'], tags: ['fresh', 'vegetables', 'spring onions'], category: categoryMap['Leafy Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Green Chilli Hot (Kacha Morich)', price: 120, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1583663848850-46af23e86e5a'], tags: ['fresh', 'vegetables', 'chilli', 'spicy'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Red Chilli Fresh', price: 150, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba'], tags: ['fresh', 'vegetables', 'chilli', 'red'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Potato Premium (Alu)', price: 50, stock: 500, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655'], tags: ['fresh', 'vegetables', 'potato', 'staple'], category: categoryMap['Root Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Sweet Potato (Misti Alu)', price: 85, stock: 200, unit: 'kg', images: ['https://images.unsplash.com/photo-1603569283847-aa295f0d016a'], tags: ['fresh', 'vegetables', 'sweet potato'], category: categoryMap['Root Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Cauliflower (Fulkopi)', price: 90, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1568584711271-e21d3fa9005b'], tags: ['fresh', 'vegetables', 'cauliflower'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Broccoli (Imported)', price: 180, stock: 70, unit: 'kg', images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'], tags: ['fresh', 'vegetables', 'broccoli', 'imported'], category: categoryMap['Exotic Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Red Bell Pepper (Capsicum)', price: 250, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83'], tags: ['fresh', 'vegetables', 'bell pepper', 'red'], category: categoryMap['Exotic Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Yellow Bell Pepper', price: 270, stock: 70, unit: 'kg', images: ['https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba'], tags: ['fresh', 'vegetables', 'bell pepper', 'yellow'], category: categoryMap['Exotic Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Green Bell Pepper', price: 220, stock: 90, unit: 'kg', images: ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716'], tags: ['fresh', 'vegetables', 'bell pepper', 'green'], category: categoryMap['Exotic Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Spinach (Palong Shak)', price: 40, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb'], tags: ['fresh', 'vegetables', 'leafy', 'spinach'], category: categoryMap['Leafy Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Red Amaranth (Lal Shak)', price: 35, stock: 140, unit: 'kg', images: ['https://images.unsplash.com/photo-1622450748230-8754d62fd80a'], tags: ['fresh', 'vegetables', 'leafy', 'amaranth'], category: categoryMap['Leafy Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Coriander Leaves (Dhoniya Pata)', price: 30, stock: 120, unit: 'bundle', images: ['https://images.unsplash.com/photo-1525427574498-de9b93db09da'], tags: ['fresh', 'herbs', 'coriander'], category: categoryMap['Leafy Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Mint Leaves (Pudina Pata)', price: 40, stock: 100, unit: 'bundle', images: ['https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1'], tags: ['fresh', 'herbs', 'mint'], category: categoryMap['Leafy Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Eggplant Purple (Begun)', price: 65, stock: 180, unit: 'kg', images: ['https://images.unsplash.com/photo-1659261200833-ec8761558af7'], tags: ['fresh', 'vegetables', 'eggplant'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Green Beans (Sheem)', price: 75, stock: 140, unit: 'kg', images: ['https://images.unsplash.com/photo-1604093882750-3ed498f3178b'], tags: ['fresh', 'vegetables', 'beans'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Pumpkin (Misti Kumra)', price: 45, stock: 200, unit: 'kg', images: ['https://images.unsplash.com/photo-1570586437263-ab629fccc818'], tags: ['fresh', 'vegetables', 'pumpkin'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Bottle Gourd (Lau)', price: 40, stock: 180, unit: 'kg', images: ['https://images.unsplash.com/photo-1609685776954-1c16d9e3e31f'], tags: ['fresh', 'vegetables', 'gourd'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Bitter Gourd (Korola)', price: 85, stock: 120, unit: 'kg', images: ['https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1'], tags: ['fresh', 'vegetables', 'bitter gourd'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Ridge Gourd (Jhinga)', price: 65, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1600009258896-a15a196f75f4'], tags: ['fresh', 'vegetables', 'ridge gourd'], category: categoryMap['Fresh Vegetables'] },
            { name: 'Radish White (Mula)', price: 50, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1598867962329-05a87d8f62f2'], tags: ['fresh', 'vegetables', 'radish'], category: categoryMap['Root Vegetables'] || categoryMap['Fresh Vegetables'] },
            { name: 'Beetroot Fresh', price: 95, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1590320216737-7c0f8b7c6e5f'], tags: ['fresh', 'vegetables', 'beetroot'], category: categoryMap['Root Vegetables'] || categoryMap['Fresh Vegetables'] },
        ];

        // ========== FRESH FRUITS ==========
        const fruits = [
            { name: 'Bananas Ripe (Kola)', price: 60, stock: 200, unit: 'dozen', isFeatured: true, images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'], tags: ['fresh', 'fruits', 'bananas', 'local'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Sabri Bananas Premium', price: 90, stock: 150, unit: 'dozen', images: ['https://images.unsplash.com/photo-1603833665858-e61d17a86224'], tags: ['fresh', 'fruits', 'bananas', 'premium'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Red Apples (Washington)', price: 220, stock: 120, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'], tags: ['fresh', 'fruits', 'apples', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Green Apples (Granny Smith)', price: 240, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1619546813926-a78fa6372cd2'], tags: ['fresh', 'fruits', 'apples', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Fuji Apples Premium', price: 280, stock: 80, unit: 'kg', images: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb'], tags: ['fresh', 'fruits', 'apples', 'premium'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Mangoes Himsagar', price: 220, stock: 100, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1553279768-865429fa0078'], tags: ['fresh', 'fruits', 'mangoes', 'seasonal'], category: categoryMap['Seasonal Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Mangoes Langra', price: 200, stock: 120, unit: 'kg', images: ['https://images.unsplash.com/photo-1605664515997-f82f2a3c7089'], tags: ['fresh', 'fruits', 'mangoes', 'seasonal'], category: categoryMap['Seasonal Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Mangoes Fazli', price: 180, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1591206369811-4eeb2f18e915'], tags: ['fresh', 'fruits', 'mangoes', 'seasonal'], category: categoryMap['Seasonal Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Green Grapes (Seedless)', price: 280, stock: 90, unit: 'kg', images: ['https://images.unsplash.com/photo-1599819177338-1971d2c03fb1'], tags: ['fresh', 'fruits', 'grapes', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Black Grapes Premium', price: 320, stock: 70, unit: 'kg', images: ['https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d'], tags: ['fresh', 'fruits', 'grapes', 'premium'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Oranges Malta', price: 180, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1547514701-42782101795e'], tags: ['fresh', 'fruits', 'oranges', 'local'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Mandarins (Imported)', price: 220, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b'], tags: ['fresh', 'fruits', 'mandarins', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Watermelon Local', price: 45, stock: 300, unit: 'kg', images: ['https://images.unsplash.com/photo-1587049352846-4a222e784422'], tags: ['fresh', 'fruits', 'watermelon', 'seasonal'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Watermelon Seedless', price: 70, stock: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1589984662646-e7b2e4962f18'], tags: ['fresh', 'fruits', 'watermelon', 'premium'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Papaya Ripe (Pepe)', price: 85, stock: 140, unit: 'kg', images: ['https://images.unsplash.com/photo-1517282009859-f000ec3b26fe'], tags: ['fresh', 'fruits', 'papaya', 'local'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Red Lady Papaya', price: 110, stock: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1623558265481-604ab739c9ad'], tags: ['fresh', 'fruits', 'papaya', 'premium'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Pomegranate (Dalim)', price: 320, stock: 60, unit: 'kg', images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5'], tags: ['fresh', 'fruits', 'pomegranate', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Pineapple Fresh (Anaras)', price: 80, stock: 120, unit: 'piece', images: ['https://images.unsplash.com/photo-1550828520-4cb496926fc9'], tags: ['fresh', 'fruits', 'pineapple', 'local'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Dragon Fruit Red', price: 350, stock: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1527325678964-54921661f888'], tags: ['fresh', 'fruits', 'dragonfruit', 'exotic'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Dragon Fruit White', price: 320, stock: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5'], tags: ['fresh', 'fruits', 'dragonfruit', 'exotic'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Kiwi Fruit (Zespri)', price: 450, stock: 40, unit: 'kg', images: ['https://images.unsplash.com/photo-1585059895524-72359e06133a'], tags: ['fresh', 'fruits', 'kiwi', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Strawberries Fresh', price: 550, stock: 30, unit: 'kg', images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6'], tags: ['fresh', 'fruits', 'strawberries', 'premium'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Blueberries Premium', price: 650, stock: 25, unit: 'kg', images: ['https://images.unsplash.com/photo-1498557850523-fd3d118b962e'], tags: ['fresh', 'fruits', 'blueberries', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Guava Deshi (Peyara)', price: 85, stock: 140, unit: 'kg', images: ['https://images.unsplash.com/photo-1536511132770-e5058c7e8c46'], tags: ['fresh', 'fruits', 'guava', 'local'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Thai Guava', price: 140, stock: 90, unit: 'kg', images: ['https://images.unsplash.com/photo-1609360011831-e1e93f2e9769'], tags: ['fresh', 'fruits', 'guava', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Lychee Fresh (Lichu)', price: 220, stock: 70, unit: 'kg', images: ['https://images.unsplash.com/photo-1501055773068-2d588c83fc0e'], tags: ['fresh', 'fruits', 'lychee', 'seasonal'], category: categoryMap['Seasonal Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Coconut Whole (Narikel)', price: 50, stock: 200, unit: 'piece', images: ['https://images.unsplash.com/photo-1589928475365-61c6bbc0d076'], tags: ['fresh', 'fruits', 'coconut', 'local'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Tender Coconut (Daab)', price: 70, stock: 150, unit: 'piece', images: ['https://images.unsplash.com/photo-1623428454610-a1f11d94f4ea'], tags: ['fresh', 'fruits', 'coconut', 'tender'], category: categoryMap['Local Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Dates Ajwa (Premium)', price: 650, stock: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1587485138061-8788b5c34641'], tags: ['fresh', 'fruits', 'dates', 'premium'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
            { name: 'Medjool Dates', price: 550, stock: 60, unit: 'kg', images: ['https://images.unsplash.com/photo-1609710509096-07f5f638f0bc'], tags: ['fresh', 'fruits', 'dates', 'imported'], category: categoryMap['Imported Fruits'] || categoryMap['Fresh Fruits'] },
        ];

        // ========== DAIRY & EGGS ==========
        const dairy = [
            { name: 'Farm Fresh Eggs White (12 pcs)', price: 140, stock: 300, unit: 'dozen', isFeatured: true, images: ['https://images.unsplash.com/photo-1518569656558-1f25e69d93d7'], tags: ['dairy', 'eggs', 'fresh', 'protein'], category: categoryMap['Eggs'] || categoryMap['Dairy & Eggs'] },
            { name: 'Brown Eggs Organic (12 pcs)', price: 170, stock: 200, unit: 'dozen', images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f'], tags: ['dairy', 'eggs', 'brown', 'organic'], category: categoryMap['Eggs'] || categoryMap['Dairy & Eggs'] },
            { name: 'Omega-3 Enriched Eggs (12 pcs)', price: 220, stock: 120, unit: 'dozen', images: ['https://images.unsplash.com/photo-1506976785307-8732e854ad03'], tags: ['dairy', 'eggs', 'omega3', 'healthy'], category: categoryMap['Eggs'] || categoryMap['Dairy & Eggs'] },
            { name: 'Quail Eggs Fresh (18 pcs)', price: 180, stock: 80, unit: 'packet', images: ['https://images.unsplash.com/photo-1599876303809-7a0488ea6deb'], tags: ['dairy', 'eggs', 'quail', 'premium'], category: categoryMap['Eggs'] || categoryMap['Dairy & Eggs'] },
            { name: 'Aarong Fresh Milk Full Cream 1L', price: 95, stock: 180, unit: 'liter', isFeatured: true, images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b'], tags: ['dairy', 'milk', 'aarong', 'full-cream'], category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] },
            { name: 'PRAN Milk Fresh 1 Liter', price: 90, stock: 200, unit: 'liter', images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150'], tags: ['dairy', 'milk', 'pran', 'fresh'], category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] },
            { name: 'Milk Vita Full Cream 1L', price: 92, stock: 170, unit: 'liter', images: ['https://images.unsplash.com/photo-1606312617935-f0fcf86f6c94'], tags: ['dairy', 'milk', 'milk-vita', 'full-cream'], category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] },
            { name: 'Low Fat Milk 1 Liter', price: 88, stock: 150, unit: 'liter', images: ['https://images.unsplash.com/photo-1559598467-f8b76c8d589e'], tags: ['dairy', 'milk', 'low-fat', 'healthy'], category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] },
            { name: 'Aarong Pure Butter 200g', price: 380, stock: 100, unit: 'packet', images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d'], tags: ['dairy', 'butter', 'aarong', 'premium'], category: categoryMap['Butter & Ghee'] || categoryMap['Dairy & Eggs'] },
            { name: 'Danish Butter Salted 200g', price: 420, stock: 80, unit: 'packet', images: ['https://images.unsplash.com/photo-1517418883479-449f93bda85e'], tags: ['dairy', 'butter', 'danish', 'imported'], category: categoryMap['Butter & Ghee'] || categoryMap['Dairy & Eggs'] },
            { name: 'Unsalted Butter 200g', price: 380, stock: 90, unit: 'packet', images: ['https://images.unsplash.com/photo-1611070024209-b3b07b60ba3f'], tags: ['dairy', 'butter', 'unsalted'], category: categoryMap['Butter & Ghee'] || categoryMap['Dairy & Eggs'] },
            { name: 'Aarong Fresh Doi 500g', price: 95, stock: 150, unit: 'piece', images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777'], tags: ['dairy', 'yogurt', 'doi', 'aarong'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Greek Yogurt Plain 400g', price: 220, stock: 70, unit: 'piece', images: ['https://images.unsplash.com/photo-1571212515726-065d38d1268c'], tags: ['dairy', 'yogurt', 'greek', 'premium'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Flavored Yogurt Mixed Fruit 80g', price: 45, stock: 200, unit: 'cup', images: ['https://images.unsplash.com/photo-1589509430091-e6c12b59395c'], tags: ['dairy', 'yogurt', 'flavored', 'fruit'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Kraft Cheese Slices 200g', price: 320, stock: 100, unit: 'packet', images: ['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d'], tags: ['dairy', 'cheese', 'kraft', 'slices'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Cheddar Cheese Block 200g', price: 420, stock: 80, unit: 'packet', images: ['https://images.unsplash.com/photo-1552767059-ce182ead6c1b'], tags: ['dairy', 'cheese', 'cheddar', 'imported'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Mozzarella Cheese 200g', price: 480, stock: 60, unit: 'packet', images: ['https://images.unsplash.com/photo-1626200286226-c9d0439a129a'], tags: ['dairy', 'cheese', 'mozzarella', 'pizza'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Parmesan Cheese Grated 100g', price: 550, stock: 50, unit: 'packet', images: ['https://images.unsplash.com/photo-1452195100486-9cc805987862'], tags: ['dairy', 'cheese', 'parmesan', 'italian'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Aarong Pure Ghee 500g', price: 680, stock: 80, unit: 'bottle', isFeatured: true, images: ['https://images.unsplash.com/photo-1628088062854-d1870b4553da'], tags: ['dairy', 'ghee', 'aarong', 'pure'], category: categoryMap['Butter & Ghee'] || categoryMap['Dairy & Eggs'] },
            { name: 'Organic Ghee 500g', price: 850, stock: 50, unit: 'bottle', images: ['https://images.unsplash.com/photo-1638187058825-e6f6e6f8bafc'], tags: ['dairy', 'ghee', 'organic', 'premium'], category: categoryMap['Butter & Ghee'] || categoryMap['Dairy & Eggs'] },
            { name: 'Condensed Milk 400g', price: 200, stock: 140, unit: 'can', images: ['https://images.unsplash.com/photo-1556799691-8775c804b0f9'], tags: ['dairy', 'milk', 'condensed', 'sweet'], category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] },
            { name: 'Evaporated Milk 400g', price: 180, stock: 130, unit: 'can', images: ['https://images.unsplash.com/photo-1590594477301-37eb53b23ea4'], tags: ['dairy', 'milk', 'evaporated'], category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] },
            { name: 'Cream Cheese Spread 200g', price: 380, stock: 60, unit: 'packet', images: ['https://images.unsplash.com/photo-1589881133595-c7354a2e821e'], tags: ['dairy', 'cheese', 'cream', 'spread'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Paneer (Cottage Cheese) 200g', price: 220, stock: 100, unit: 'packet', images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7'], tags: ['dairy', 'paneer', 'cheese', 'indian'], category: categoryMap['Yogurt & Cheese'] || categoryMap['Dairy & Eggs'] },
            { name: 'Sour Cream 200ml', price: 320, stock: 60, unit: 'bottle', images: ['https://images.unsplash.com/photo-1576864094814-885a94b96d37'], tags: ['dairy', 'cream', 'sour'], category: categoryMap['Milk'] || categoryMap['Dairy & Eggs'] },
        ];

        // Continue with more categories...
        allProducts.push(...vegetables, ...fruits, ...dairy);

        console.log(`📦 Total products to add: ${allProducts.length}`);

        let addedCount = 0;
        for (const productData of allProducts) {
            try {
                await Product.create(productData);
                addedCount++;
                process.stdout.write(`\r✅ Added ${addedCount}/${allProducts.length} products...`);
            } catch (error) {
                console.log(`\n❌ Error adding product:`, error.message);
            }
        }

        console.log('\n\n🎉 Successfully added realistic products!');
        console.log(`📊 Total products: ${addedCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

addRealisticProducts();
