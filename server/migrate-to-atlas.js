require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const migrateToAtlas = async () => {
    try {
        console.log('🔄 Migrating data from local MongoDB to Atlas...\n');

        // Connect to local MongoDB
        console.log('📡 Connecting to local MongoDB...');
        const localConn = mongoose.createConnection('mongodb://localhost:27017/bangladeshi-supershop');
        await localConn.asPromise();
        console.log('✅ Connected to local MongoDB\n');

        // Connect to Atlas
        console.log('📡 Connecting to MongoDB Atlas...');
        const atlasUri = process.env.MONGODB_URI;
        console.log('   URI:', atlasUri ? atlasUri.replace(/:[^:]*@/, ':****@') : 'NOT FOUND');
        const atlasConn = mongoose.createConnection(atlasUri);
        await atlasConn.asPromise();
        console.log('✅ Connected to MongoDB Atlas');
        console.log('   Database:', atlasConn.name, '\n');

        // Get all collections
        const collections = await localConn.db.listCollections().toArray();
        console.log(`📦 Found ${collections.length} collections to migrate\n`);

        let totalDocs = 0;

        for (const coll of collections) {
            const collName = coll.name;
            console.log(`📋 ${collName}:`);

            const localColl = localConn.db.collection(collName);
            const docs = await localColl.find({}).toArray();

            if (docs.length > 0) {
                const atlasColl = atlasConn.db.collection(collName);

                // Clear existing data in Atlas
                await atlasColl.deleteMany({});

                // Insert all documents
                await atlasColl.insertMany(docs);

                console.log(`   ✅ Migrated ${docs.length} documents`);
                totalDocs += docs.length;
            } else {
                console.log(`   ⚠️  Empty, skipped`);
            }
        }

        console.log(`\n🎉 Migration completed!`);
        console.log(`📊 Total documents migrated: ${totalDocs}\n`);

        await localConn.close();
        await atlasConn.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.log('\n🚨 IP ADDRESS NOT WHITELISTED!');
            console.log('\n📌 Fix: Add your IP to MongoDB Atlas:');
            console.log('   1. Go to https://cloud.mongodb.com/');
            console.log('   2. Click "Network Access"');
            console.log('   3. Click "Add IP Address"');
            console.log('   4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
            console.log('   5. Click "Confirm"\n');
        }

        process.exit(1);
    }
};

migrateToAtlas();
