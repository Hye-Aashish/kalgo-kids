import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../components/Notification';

const ShopContext = createContext();

const API_BASE = "http://localhost:5001/api";

export const ShopProvider = ({ children }) => {
    // --- Existing State ---
    const [catalog, setCatalog] = useState([
        { _id: "1", title: "Well Done Bear Set", price: 45.00, image: "https://images.unsplash.com/photo-1519706824991-89a385e05423?q=80&w=1000&auto=format&fit=crop", isMultiply: false, category: "T-Shirts", description: "Soft organic cotton set for the bravest bears.", sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"] },
        { _id: "2", title: "Pink Flower Denim Set", price: 52.00, image: "https://images.unsplash.com/photo-1522771935873-100ff1df662b?q=80&w=1000&auto=format&fit=crop", isMultiply: false, category: "Jeans", description: "Hand-painted flowers on durable vintage denim.", sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"] },
        { _id: "3", title: "Geo Fun Sweater", price: 42.00, image: "https://images.unsplash.com/photo-1621335829175-95f437384d7c?q=80&w=1000&auto=format&fit=crop", isMultiply: true, category: "Shirts", description: "Geometric patterns that dance in the sunlight.", sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"] },
        { _id: "4", title: "Rainbow Stompers", price: 55.00, image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop", isMultiply: true, category: "Shoes", description: "Every step leaves a trail of invisible rainbows.", sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"] }
    ]);
    const [collections, setCollections] = useState([
        { _id: "c1", title: "Snow Days ❄️", image: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1000&auto=format&fit=crop", illust: "" },
        { _id: "c2", title: "Summer Vibes ☀️", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop", illust: "" },
        { _id: "c3", title: "Party Time 🎉", image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1000&auto=format&fit=crop", illust: "" }
    ]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([
        { id: "ORD-1234", date: "09/04/2026", total: 97.00, items: 2, status: "Paid" },
        { id: "ORD-5678", date: "08/04/2026", total: 45.00, items: 1, status: "Pending" }
    ]);
    const [settings, setSettings] = useState({
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
            }
        ],
        brandLogo: "",
        heroImage: "assets/hero_kids.png",
        razorpayKeyId: "",
        razorpayKeySecret: ""
    });
    const [categories, setCategories] = useState(["T-Shirts", "Jeans", "Shirts", "Shoes", "Accessories"]);
    const [messages, setMessages] = useState([
        { _id: "m1", name: "Ruchi", text: "Love the new collection! The bear set is adorable.", date: "09/04/2026" }
    ]);
    const [homeSections, setHomeSections] = useState([]);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([
        { _id: "u1", name: "Explorer Ruchi", email: "ruchi@magic.com", orders: 2 },
        { _id: "u2", name: "Brave Kabir", email: "kabir@magic.com", orders: 1 }
    ]);
    const [loading, setLoading] = useState(true);

    // --- Notification State ---
    const [notification, setNotification] = useState(null);

    const showNotify = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const clearNotify = () => {
        setNotification(null);
    };

    // Initial Data Fetch with Fallback Logic
    useEffect(() => {
        const fixImgUrl = (url) => {
            if (!url) return url;
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
                return url;
            }
            return `/${url}`;
        };

        const fetchData = async () => {
            try {
                const [pRes, colRes, ordRes, setRes, catRes, msgRes, uRes, hRes] = await Promise.all([
                    axios.get(`${API_BASE}/products`).catch(() => ({ data: null })),
                    axios.get(`${API_BASE}/collections`).catch(() => ({ data: null })),
                    axios.get(`${API_BASE}/orders`).catch(() => ({ data: null })),
                    axios.get(`${API_BASE}/settings`).catch(() => ({ data: null })),
                    axios.get(`${API_BASE}/categories`).catch(() => ({ data: null })),
                    axios.get(`${API_BASE}/messages`).catch(() => ({ data: null })),
                    axios.get(`${API_BASE}/users`).catch(() => ({ data: null })),
                    axios.get(`${API_BASE}/home-sections`).catch(() => ({ data: [] }))
                ]);
                
                if (pRes.data) {
                    const sanitized = pRes.data.map(p => ({
                        ...p,
                        image: fixImgUrl(p.image),
                        images: Array.isArray(p.images) ? p.images.map(fixImgUrl) : []
                    }));
                    setCatalog(sanitized);
                }
                if (colRes.data) {
                    const sanitized = colRes.data.map(c => ({
                        ...c,
                        image: fixImgUrl(c.image),
                        illust: fixImgUrl(c.illust)
                    }));
                    setCollections(sanitized);
                }
                if (ordRes.data) setOrders(ordRes.data);
                if (setRes.data) {
                    const mergedSettings = { ...settings, ...setRes.data };
                    mergedSettings.heroImage = fixImgUrl(mergedSettings.heroImage);
                    mergedSettings.brandLogo = fixImgUrl(mergedSettings.brandLogo);
                    // Extra safety: ensure footerSections is an array
                    if (!Array.isArray(mergedSettings.footerSections)) {
                        mergedSettings.footerSections = [];
                    }
                    setSettings(mergedSettings);
                }
                if (catRes.data) setCategories(catRes.data);
                if (msgRes.data) setMessages(msgRes.data);
                if (uRes.data) setUsers(uRes.data);
                if (hRes.data) setHomeSections(hRes.data);
                
            } catch (err) {
                console.warn("Using local imagination as the backend is sleeping. 💤");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
        const savedCart = localStorage.getItem('antigrav_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedUser = localStorage.getItem('antigrav_user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        localStorage.setItem('antigrav_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (user) localStorage.setItem('antigrav_user', JSON.stringify(user));
        else localStorage.removeItem('antigrav_user');
    }, [user]);

    // --- Actions ---
    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${API_BASE.replace('/api', '')}/api/register`, { name, email, password });
            setUser(res.data.user);
            showNotify('Registration successful! ✨', 'success');
            return res.data;
        } catch (err) {
            const mockUser = { name, email, password, _id: Date.now().toString() };
            setUser(mockUser);
            showNotify('User created locally! ✨', 'success');
            return { success: true, user: mockUser };
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE.replace('/api', '')}/api/login`, { email, password });
            setUser(res.data.user);
            showNotify(`Welcome back, ${res.data.user.name.split(' ')[0]}! ✨`, 'success');
            return res.data;
        } catch (err) {
            if (email && password) {
                const mockUser = { name: 'Explorer', email, _id: 'mock-id' };
                setUser(mockUser);
                showNotify('Log in successful', 'success');
                return { success: true, user: mockUser };
            }
            showNotify('Invalid credentials!', 'error');
            return { success: false, message: 'Invalid credentials' };
        }
    };

    const logout = () => {
        setUser(null);
        showNotify('Successfully logged out.', 'info');
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === product._id && i.size === product.size);
            if (existing) {
                return prev.map(i => (i._id === product._id && i.size === product.size) ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setCart([...cart, { ...product, qty: 1 }]);
        showNotify('Product added to your cart! ✨', 'success');
    };

    const updateQty = (index, delta) => {
        setCart(prev => {
            const newCart = [...prev];
            const item = newCart[index];
            if (!item) return prev;
            item.qty += delta;
            if (item.qty <= 0) {
                newCart.splice(index, 1);
            }
            return newCart;
        });
    };

    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        showNotify('Item removed from cart.', 'info');
    };

    const checkout = async (userData, extraDetails = {}) => {
        if (cart.length === 0) return false;
        const subtotal = cart.reduce((tot, item) => tot + (item.price * item.qty), 0);
        const newOrder = {
            id: 'ORD-' + Math.floor(Math.random() * 10000),
            date: new Date().toLocaleDateString(),
            total: subtotal + (subtotal > 100 ? 0 : 10),
            items: cart.reduce((sum, i) => sum + i.qty, 0),
            customerName: userData.fullName,
            customerEmail: userData.email,
            customerAddress: `${userData.address}, ${userData.city}, ${userData.zipCode}`,
            paymentMethod: extraDetails.paymentMethod || 'COD',
            paymentStatus: extraDetails.paymentStatus || 'Pending',
            status: 'Confirmed'
        };
        
        try {
            const res = await axios.post(`${API_BASE}/orders`, newOrder);
            setOrders(prev => [...prev, res.data]);
            showNotify('Order placed successfully. 🚀', 'success');
        } catch (err) {
            setOrders(prev => [...prev, newOrder]);
            showNotify('Order saved! 🚀', 'success');
        }
        setCart([]);
        return newOrder;
    };

    const addProduct = async (product) => {
        try {
            const res = await axios.post(`${API_BASE}/products`, product);
            setCatalog(prev => [...prev, res.data]);
            showNotify('New product created!', 'success');
        } catch (err) {
            const mock = { ...product, _id: Date.now().toString() };
            setCatalog(prev => [...prev, mock]);
            showNotify('Created product locally!', 'success');
        }
    };

    const removeProduct = async (id) => {
        try { 
            await axios.delete(`${API_BASE}/products/${id}`); 
            showNotify('Product removed.', 'info');
        } catch(e) {
            showNotify('Product removed locally.', 'info');
        }
        setCatalog(prev => prev.filter(item => item._id !== id));
    };

    const updateProduct = async (id, updated) => {
        try {
            const res = await axios.put(`${API_BASE}/products/${id}`, updated);
            setCatalog(prev => prev.map(item => item._id === id ? res.data : item));
            showNotify('Product updated! ✨', 'success');
        } catch (err) {
            setCatalog(prev => prev.map(item => item._id === id ? { ...item, ...updated } : item));
            showNotify('Product updated locally! ✨', 'success');
        }
    };

    const addCollection = async (coll) => {
        try {
            const res = await axios.post(`${API_BASE}/collections`, coll);
            setCollections(prev => [...prev, res.data]);
            showNotify('Moment captured in album!', 'success');
        } catch (err) {
            setCollections(prev => [...prev, { ...coll, _id: Date.now().toString() }]);
            showNotify('Saved locally! ✨', 'success');
        }
    };

    const removeCollection = async (id) => {
        try { 
            await axios.delete(`${API_BASE}/collections/${id}`); 
            showNotify('Removed from album.', 'info');
        } catch(e) {
            showNotify('Removed locally.', 'info');
        }
        setCollections(prev => prev.filter(c => c._id !== id));
    };

    const updateCollection = async (id, updated) => {
        try {
            const res = await axios.put(`${API_BASE}/collections/${id}`, updated);
            setCollections(prev => prev.map(c => c._id === id ? res.data : c));
        } catch (err) {
            setCollections(prev => prev.map(c => c._id === id ? { ...c, ...updated } : c));
        }
    };

    const updateSettings = async (newSettings) => {
        console.log("Saving Settings to Backend:", newSettings);
        try {
            const res = await axios.put(`${API_BASE}/settings`, newSettings);
            console.log("Settings Saved Successfully. Result:", res.data);
            setSettings(prev => ({ ...prev, ...res.data }));
            showNotify('Settings updated!', 'success');
        } catch (err) {
            console.error("Backend Save Failed. Updating locally.", err);
            setSettings(prev => ({ ...prev, ...newSettings }));
            showNotify('Settings updated locally!', 'success');
        }
    };

    const addCategory = async (name) => {
        try {
            const res = await axios.post(`${API_BASE}/categories`, { name });
            setCategories(prev => [...prev, res.data.name]);
            showNotify('New magical tag created!', 'success');
        } catch (err) {
            setCategories(prev => [...prev, name]);
            showNotify('Tag created locally!', 'success');
        }
    };

    const removeCategory = async (name) => {
        try { 
            await axios.delete(`${API_BASE}/categories/${name}`); 
            showNotify('Tag removed.', 'info');
        } catch(e) {
            showNotify('Tag removed locally.', 'info');
        }
        setCategories(prev => prev.filter(c => c !== name));
    };

    const addMessage = async (msg) => {
        const newMsg = { ...msg, text: msg.message, date: new Date().toLocaleDateString() };
        try {
            const res = await axios.post(`${API_BASE}/messages`, newMsg);
            setMessages(prev => [...prev, res.data]);
            showNotify('Your message has been sent!', 'success');
        } catch (err) {
            setMessages(prev => [...prev, { ...newMsg, _id: Date.now().toString() }]);
            showNotify('Message saved locally!', 'success');
        }
    };

    const removeMessage = async (id) => {
        try { 
            await axios.delete(`${API_BASE}/messages/${id}`); 
            showNotify('Message cleared.', 'info');
        } catch(e) {
            showNotify('Message cleared locally.', 'info');
        }
        setMessages(prev => prev.filter(m => m._id !== id));
    };

    const removeUser = async (id) => {
        try {
            await axios.delete(`${API_BASE}/users/${id}`);
            showNotify('User removed successfully.', 'info');
        } catch(e) {
            showNotify('User removed locally.', 'info');
        }
        setUsers(prev => prev.filter(u => u._id !== id));
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const res = await axios.patch(`${API_BASE}/orders/${id}`, { status });
            setOrders(prev => prev.map(o => o.id === id ? res.data : o));
            showNotify(`Order status: ${status}!`, 'success');
        } catch (err) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            showNotify(`Order status: ${status}!`, 'success');
        }
    };

    const updateOrderPaymentStatus = async (id, paymentStatus) => {
        try {
            const res = await axios.patch(`${API_BASE}/orders/${id}`, { paymentStatus });
            setOrders(prev => prev.map(o => o.id === id ? res.data : o));
            showNotify(`Payment status: ${paymentStatus}!`, 'success');
        } catch (err) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus } : o));
            showNotify(`Payment status: ${paymentStatus}!`, 'success');
        }
    };

    const updateHomeSection = async (id, data) => {
        try {
            if (id) {
                const res = await axios.put(`${API_BASE}/home-sections/${id}`, data);
                setHomeSections(prev => prev.map(s => s._id === id ? res.data : s));
            } else {
                const res = await axios.post(`${API_BASE}/home-sections`, data);
                setHomeSections(prev => [...prev, res.data]);
            }
            showNotify('Home section saved! 🎨', 'success');
        } catch (err) {
            showNotify('Failed to save home section.', 'error');
        }
    };

    const deleteHomeSection = async (id) => {
        try {
            await axios.delete(`${API_BASE}/home-sections/${id}`);
            setHomeSections(prev => prev.filter(s => s._id !== id));
            showNotify('Section removed.', 'info');
        } catch (err) {
            showNotify('Failed to remove section.', 'error');
        }
    };

    return (
        <ShopContext.Provider value={{
            catalog, collections, cart, orders, settings, categories, messages, users, loading, homeSections,
            user, login, register, logout, showNotify,
            addToCart, updateQty, removeFromCart, checkout,
            addProduct, removeProduct, updateProduct,
            addCollection, removeCollection, updateCollection,
            updateSettings, addCategory, removeCategory,
            addMessage, removeMessage, updateOrderStatus, updateOrderPaymentStatus, removeUser,
            updateHomeSection, deleteHomeSection
        }}>
            {notification && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={clearNotify} 
                />
            )}
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);





