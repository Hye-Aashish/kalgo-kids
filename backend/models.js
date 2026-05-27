const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: Number,
    image: String,
    images: [String],
    isMultiply: { type: Boolean, default: false },
    category: String,
    collection: String,
    description: String,
    sku: String,
    barcode: String,
    inventory: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    sizes: [String],
    colors: [String],
    tags: [String],
    weight: Number,
    status: { type: String, default: 'active' }, // active, draft, archived
    seoTitle: String,
    seoDescription: String,
    handle: { type: String, unique: true, sparse: true }
}, { timestamps: true });

const CollectionSchema = new mongoose.Schema({
    title: String,
    image: String,
    illust: String
});

const OrderSchema = new mongoose.Schema({
    id: String,
    date: { type: String, default: () => new Date().toLocaleDateString() },
    total: Number,
    items: Number,
    customerName: String,
    customerEmail: String,
    customerAddress: String,
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    status: { type: String, default: 'Confirmed' } // Confirmed, Shipped, Delivered
});

const SettingsSchema = new mongoose.Schema({
    heroTitle: { type: String, default: "Real Fun, Illustrated Magic" },
    heroSubtitle: { type: String, default: "Imagine. Play. Wear." },
    heroDescription: { type: String, default: "Where premium kids' fashion collides with a whimsical storybook aesthetic." },
    brandName: { type: String, default: "KALGO Kids" },
    contactEmail: { type: String, default: "hello@kalgokids.com" },
    currency: { type: String, default: "$" },
    socialLinks: {
        instagram: { type: String, default: "@kalgokids" },
        twitter: { type: String, default: "@kalgokids" }
    },
    footerTagline: { type: String, default: "A blend of reality & imagination." },
    footerCopyright: { type: String, default: "© 2026 KALGO Kids. Designed with illustrations." },
    footerSections: [
        {
            title: { type: String },
            type: { type: String, enum: ['links', 'text', 'socials'], default: 'links' },
            links: [{ label: { type: String }, url: { type: String } }],
            content: { type: String }
        }
    ],
    brandLogo: { type: String, default: "" },
    heroImage: { type: String, default: "assets/hero_kids.png" },
    razorpayKeyId: { type: String, default: "" },
    razorpayKeySecret: { type: String, default: "" }
}, { minimize: false });

SettingsSchema.path('footerSections').default([
    {
        title: "Shop",
        links: [
            { label: "New Drops", url: "/products" },
            { label: "Collections", url: "/products" },
            { label: "Sale items", url: "/products" }
        ]
    },
    {
        title: "Support",
        links: [
            { label: "Contact Us", url: "/contact" },
            { label: "Shipping Info", url: "/shipping" },
            { label: "Returns", url: "/returns" }
        ]
    }
]);

const CategorySchema = new mongoose.Schema({
    name: { type: String, unique: true }
});

const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    text: String,
    date: String
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    orders: Array
});

module.exports = {
    Product: mongoose.model('Product', ProductSchema),
    Collection: mongoose.model('Collection', CollectionSchema),
    Order: mongoose.model('Order', OrderSchema),
    Settings: mongoose.model('Settings', SettingsSchema),
    Category: mongoose.model('Category', CategorySchema),
    Message: mongoose.model('Message', MessageSchema),
    User: mongoose.model('User', UserSchema),
    HomeSection: mongoose.model('HomeSection', new mongoose.Schema({
        title: String,
        highlight: String,
        productIds: [String]
    }))
};
