const mongoose = require('mongoose');
const MONGO_URI = "mongodb://127.0.0.1:27017/kalgo_kids";

async function clearDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for database maintenance");

        // Clear products, collections, and home sections so they can re-seed cleanly
        await mongoose.connection.collection('products').drop().catch(() => console.log('Products collection did not exist or already dropped'));
        await mongoose.connection.collection('collections').drop().catch(() => console.log('Collections collection did not exist or already dropped'));
        await mongoose.connection.collection('homesections').drop().catch(() => console.log('HomeSections collection did not exist or already dropped'));

        console.log("Database cleared successfully for fresh seeding!");
        process.exit(0);
    } catch (err) {
        console.error("Error clearing database:", err);
        process.exit(1);
    }
}

clearDB();
