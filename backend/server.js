const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const { Product, Collection, Order, Settings, Category, Message, User, HomeSection } = require('./models');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const app = express();
app.use(cors());
app.use(express.json());

// Home Sections
app.get('/api/home-sections', async (req, res) => {
    const sections = await HomeSection.find();
    res.json(sections);
});

app.post('/api/home-sections', async (req, res) => {
    const data = { ...req.body, productIds: req.body.productIds || [] };
    const section = new HomeSection(data);
    await section.save();
    res.json(section);
});

app.put('/api/home-sections/:id', async (req, res) => {
    const updated = await HomeSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete('/api/home-sections/:id', async (req, res) => {
    await HomeSection.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log('Connected to MongoDB 🚀');
    // Seed default data if empty
    const pCount = await Product.countDocuments();
    if (pCount === 0) {
        await Product.insertMany([
            { title: "Well Done Bear Set", price: 45.00, image: "assets/well_done_set.jpg", isMultiply: false, category: "T-Shirts", collection: "Snow Days ❄️" },
            { title: "Pink Flower Denim Set", price: 52.00, image: "assets/pink_flower_set.jpg", isMultiply: false, category: "Jeans", collection: "Summer Vibes ☀️" },
            { title: "Geo Fun Sweater", price: 42.00, image: "assets/product_1.png", isMultiply: true, category: "Shirts", collection: "Summer Vibes ☀️" },
            { title: "Rainbow Stompers", price: 55.00, image: "assets/product_2.png", isMultiply: true, category: "Shoes", collection: "Party Time 🎉" }
        ]);
        console.log('Seeded default products');
    }
    const cCount = await Collection.countDocuments();
    if (cCount === 0) {
        await Collection.insertMany([
            { title: "Snow Days ❄️", image: "assets/winter.png", illust: "assets/illust_winter.png" },
            { title: "Summer Vibes ☀️", image: "assets/summer.png", illust: "assets/illust_summer.png" },
            { title: "Party Time 🎉", image: "assets/party.png", illust: "assets/illust_party.png" }
        ]);
        console.log('Seeded default collections');
    }
    const hCount = await HomeSection.countDocuments();
    if (hCount === 0) {
        const allProds = await Product.find({}, { _id: 1 });
        await HomeSection.create({
            title: "Our Creative Corner",
            highlight: "Creative",
            productIds: allProds.slice(0, 3).map(p => p._id)
        });
        console.log('Seeded default home section');
    }
})
.catch(err => console.log('MongoDB connection error: ', err));

// --- API ROUTES ---

// Products
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

// Collections
app.get('/api/collections', async (req, res) => {
    const colls = await Collection.find();
    res.json(colls);
});

app.post('/api/collections', async (req, res) => {
    const newColl = new Collection(req.body);
    await newColl.save();
    res.json(newColl);
});

app.put('/api/collections/:id', async (req, res) => {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

app.delete('/api/collections/:id', async (req, res) => {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

// Orders
app.get('/api/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

app.post('/api/orders', async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
});

app.patch('/api/orders/:id', async (req, res) => {
    const updated = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
});

// Razorpay Order Creation
app.post('/api/create-razorpay-order', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
});

// Settings
app.get('/api/settings', async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings();
        await settings.save();
    }
    
    const sObj = settings.toObject();
    
    // Explicitly check and add missing fields
    if (!sObj.footerSections) sObj.footerSections = [
        { title: "Shop", type: "links", links: [{ label: "All Products", url: "/products" }] }
    ];
    if (sObj.brandLogo === undefined) sObj.brandLogo = "";
    if (sObj.heroImage === undefined) sObj.heroImage = "assets/hero_kids.png";
    if (sObj.footerTagline === undefined) sObj.footerTagline = "A blend of reality & imagination.";
    if (sObj.footerCopyright === undefined) sObj.footerCopyright = "© 2026 KALGO Kids. Designed with illustrations.";

    res.json(sObj);
});

app.put('/api/settings', async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, { 
            new: true, 
            upsert: true, 
            setDefaultsOnInsert: true 
        });
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating settings' });
    }
});

// Categories
app.get('/api/categories', async (req, res) => {
    const cats = await Category.find();
    res.json(cats.map(c => c.name));
});

app.post('/api/categories', async (req, res) => {
    const newCat = new Category({ name: req.body.name });
    await newCat.save();
    res.json(newCat);
});

app.delete('/api/categories/:name', async (req, res) => {
    await Category.findOneAndDelete({ name: req.params.name });
    res.json({ message: 'Deleted' });
});

// Messages
app.get('/api/messages', async (req, res) => {
    const msgs = await Message.find();
    res.json(msgs);
});

app.post('/api/messages', async (req, res) => {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.json(newMsg);
});

app.delete('/api/messages/:id', async (req, res) => {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

// Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords for safety
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});


// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ success: true, user: { name: newUser.name, email: newUser.email, _id: newUser._id } });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Email already exists' });
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (user) {
        res.json({ success: true, user: { name: user.name, email: user.email, _id: user._id } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
