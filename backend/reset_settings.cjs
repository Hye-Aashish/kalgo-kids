const mongoose = require('mongoose');
const { Settings } = require('./models');

const MONGO_URI = "mongodb://127.0.0.1:27017/kalgo_kids";

async function resetSettings() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        await Settings.deleteMany({});
        const defaultSettings = new Settings({
            heroTitle: "Real Fun, Illustrated Magic",
            heroSubtitle: "Imagine. Play. Wear.",
            heroDescription: "Where premium kids' fashion collides with a whimsical storybook aesthetic.",
            brandName: "KALGO Kids",
            contactEmail: "hello@kalgokids.com",
            currency: "$",
            socialLinks: { instagram: "@kalgokids", twitter: "@kalgokids" },
            footerTagline: "A blend of reality & imagination.",
            footerCopyright: "© 2026 KALGO Kids. Designed with illustrations.",
            footerSections: [
                {
                    title: "Shop",
                    type: "links",
                    links: [
                        { label: "New Drops", url: "/products" },
                        { label: "Collections", url: "/products" },
                        { label: "Sale items", url: "/products" }
                    ]
                },
                {
                    title: "Support",
                    type: "links",
                    links: [
                        { label: "Contact Us", url: "/contact" },
                        { label: "Shipping Info", url: "/shipping" },
                        { label: "Returns", url: "/returns" }
                    ]
                }
            ],
            brandLogo: "",
            heroImage: "assets/hero_kids.png",
            razorpayKeyId: "",
            razorpayKeySecret: ""
        });

        await defaultSettings.save();
        console.log("Settings reset to defaults successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error resetting settings:", err);
        process.exit(1);
    }
}

resetSettings();
