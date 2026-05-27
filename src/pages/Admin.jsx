import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import BackgroundElements from '../components/BackgroundElements';

export default function Admin() {
    const { 
        catalog, orders, settings, categories, messages, collections, users,
        addProduct, removeProduct, updateProduct, 
        addCollection, removeCollection, updateCollection,
        updateSettings, addCategory, removeCategory,
        removeMessage, updateOrderStatus, updateOrderPaymentStatus, removeUser,
        homeSections, updateHomeSection, deleteHomeSection
    } = useShop();

    const [activeTab, setActiveTabState] = useState(() => sessionStorage.getItem('adminActiveTab') || 'dashboard');
    const setActiveTab = (tab) => { setActiveTabState(tab); sessionStorage.setItem('adminActiveTab', tab); };
    const [showProductForm, setShowProductForm] = useState(false);
    const [isAuthorized, setIsAuthorizedState] = useState(() => sessionStorage.getItem('adminAuthorized') === 'true');
    const setIsAuthorized = (val) => { setIsAuthorizedState(val); if (val) sessionStorage.setItem('adminAuthorized', 'true'); else sessionStorage.removeItem('adminAuthorized'); };
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleAdminLogin = (e) => {
        e.preventDefault();
        // Custom login logic
        if (adminUsername === 'admin' && adminPassword === 'admin123') {
            setIsAuthorized(true);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials! Check your transmission. 🛰️');
        }
    };
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Product Form States
    const [pTitle, setPTitle] = useState('');
    const [pPrice, setPPrice] = useState('');
    const [pComparePrice, setPComparePrice] = useState('');
    const [pImage, setPImage] = useState('');
    const [pImages, setPImages] = useState([]);
    const [pStyle, setPStyle] = useState('false');
    const [pCategory, setPCategory] = useState(categories[0] || '');
    const [pCollection, setPCollection] = useState('');
    const [pDesc, setPDesc] = useState('');
    const [pInStock, setPInStock] = useState('true');
    const [pSizes, setPSizes] = useState('');
    const [pColors, setPColors] = useState('');
    const [pSKU, setPSKU] = useState('');
    const [pBarcode, setPBarcode] = useState('');
    const [pInventory, setPInventory] = useState('0');
    const [pWeight, setPWeight] = useState('');
    const [pTags, setPTags] = useState('');
    const [pStatus, setPStatus] = useState('active');
    const [pSeoTitle, setPSeoTitle] = useState('');
    const [pSeoDesc, setPSeoDesc] = useState('');

    // Collection Form States
    const [showCollForm, setShowCollForm] = useState(false);
    const [editingColl, setEditingColl] = useState(null);
    const [cTitle, setCTitle] = useState('');
    const [cImage, setCImage] = useState('');
    const [cIllust, setCIllust] = useState('');

    // Site Settings Form States
    const [sHeroTitle, setSHeroTitle] = useState(settings.heroTitle);
    const [sHeroSubtitle, setSHeroSubtitle] = useState(settings.heroSubtitle);
    const [sHeroDesc, setSHeroDesc] = useState(settings.heroDescription);
    const [sBrandName, setSBrandName] = useState(settings.brandName);
    const [sFooterTagline, setSFooterTagline] = useState(settings.footerTagline);
    const [sFooterCopyright, setSFooterCopyright] = useState(settings.footerCopyright);
    const [sFooterSections, setSFooterSections] = useState(settings.footerSections || []);
    const [sRazorpayKeyId, setSRazorpayKeyId] = useState(settings.razorpayKeyId || '');
    const [sRazorpayKeySecret, setSRazorpayKeySecret] = useState(settings.razorpayKeySecret || '');
    const [sInstagram, setSInstagram] = useState(settings.socialLinks?.instagram || '');
    const [sTwitter, setSTwitter] = useState(settings.socialLinks?.twitter || '');
    const [sContactEmail, setSContactEmail] = useState(settings.contactEmail || '');
    const [sCurrency, setSCurrency] = useState(settings.currency || '$');
    const [sBrandLogo, setSBrandLogo] = useState(settings.brandLogo || '');
    const [sHeroImage, setSHeroImage] = useState(settings.heroImage || '');

    const handleAddFooterSection = () => {
        if (sFooterSections.length >= 4) {
            showNotify('Maximum 4 footer sections allowed!', 'error');
            return;
        }
        setSFooterSections([...sFooterSections, { title: 'New Section', type: 'links', links: [], content: '' }]);
    };

    const handleFooterSectionTypeChange = (idx, type) => {
        const updated = [...sFooterSections];
        updated[idx].type = type;
        setSFooterSections(updated);
    };

    const handleFooterSectionContentChange = (idx, val) => {
        const updated = [...sFooterSections];
        updated[idx].content = val;
        setSFooterSections(updated);
    };

    const handleRemoveFooterSection = (idx) => {
        const updated = [...sFooterSections];
        updated.splice(idx, 1);
        setSFooterSections(updated);
    };

    const handleFooterSectionTitleChange = (idx, val) => {
        const updated = [...sFooterSections];
        updated[idx].title = val;
        setSFooterSections(updated);
    };

    const handleAddLinkToSection = (sIdx) => {
        const updated = [...sFooterSections];
        updated[sIdx].links.push({ label: '', url: '' });
        setSFooterSections(updated);
    };

    const handleRemoveLinkFromSection = (sIdx, lIdx) => {
        const updated = [...sFooterSections];
        updated[sIdx].links.splice(lIdx, 1);
        setSFooterSections(updated);
    };

    const handleLinkChangeInSection = (sIdx, lIdx, key, val) => {
        const updated = [...sFooterSections];
        updated[sIdx].links[lIdx][key] = val;
        setSFooterSections(updated);
    };

    // Category Form State
    const [newCat, setNewCat] = useState('');

    // Home Section Form States
    const [showSecForm, setShowSecForm] = useState(false);
    const [editingSec, setEditingSec] = useState(null);
    const [secTitle, setSecTitle] = useState('');
    const [secHighlight, setSecHighlight] = useState('');
    const [secProducts, setSecProducts] = useState([]);

    const totalRev = orders.reduce((sum, ord) => sum + ord.total, 0);

    const handleFileUpload = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMultipleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        Promise.all(files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        })).then(results => {
            setPImages(prev => [...prev, ...results]);
            if (!pImage) setPImage(results[0]); 
        });
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        const productData = {
            title: pTitle,
            price: parseFloat(pPrice),
            comparePrice: pComparePrice ? parseFloat(pComparePrice) : null,
            image: pImages.length > 0 ? pImages[0] : pImage,
            images: pImages.length > 0 ? pImages : (pImage ? [pImage] : []),
            isMultiply: pStyle === 'true',
            category: pCategory,
            collection: pCollection,
            description: pDesc,
            sku: pSKU,
            barcode: pBarcode,
            inventory: parseInt(pInventory),
            weight: pWeight ? parseFloat(pWeight) : null,
            tags: pTags ? pTags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            inStock: pInStock === 'true',
            status: pStatus,
            seoTitle: pSeoTitle,
            seoDescription: pSeoDesc,
            sizes: pSizes ? pSizes.split(',').map(s => s.trim()).filter(Boolean) : [],
            colors: pColors ? pColors.split(',').map(c => c.trim()).filter(Boolean) : []
        };

        if (editingProduct) {
            updateProduct(editingProduct._id, productData);
            setEditingProduct(null);
        } else {
            addProduct(productData);
        }

        resetProductForm();
    };

    const resetProductForm = () => {
        setPTitle('');
        setPPrice('');
        setPComparePrice('');
        setPImage('');
        setPImages([]);
        setPStyle('false');
        setPCategory(categories[0] || '');
        setPCollection('');
        setPDesc('');
        setPInStock('true');
        setPSizes('');
        setPColors('');
        setPSKU('');
        setPBarcode('');
        setPInventory('0');
        setPWeight('');
        setPTags('');
        setPStatus('active');
        setPSeoTitle('');
        setPSeoDesc('');
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const startEditProduct = (product) => {
        setEditingProduct(product);
        setPTitle(product.title);
        setPPrice(product.price);
        setPComparePrice(product.comparePrice || '');
        setPImage(product.image);
        setPImages(product.images || (product.image ? [product.image] : []));
        setPStyle(product.isMultiply.toString());
        setPCategory(product.category);
        setPCollection(product.collection || '');
        setPDesc(product.description || '');
        setPInStock((product.inStock !== false).toString());
        setPSizes(product.sizes ? product.sizes.join(', ') : '');
        setPColors(product.colors ? product.colors.join(', ') : '');
        setPSKU(product.sku || '');
        setPBarcode(product.barcode || '');
        setPInventory(product.inventory ? product.inventory.toString() : '0');
        setPWeight(product.weight ? product.weight.toString() : '');
        setPTags(product.tags ? product.tags.join(', ') : '');
        setPStatus(product.status || 'active');
        setPSeoTitle(product.seoTitle || '');
        setPSeoDesc(product.seoDescription || '');
        setShowProductForm(true);
    };

    const handleCollSubmit = (e) => {
        e.preventDefault();
        const collData = { title: cTitle, image: cImage, illust: cIllust };
        if (editingColl) {
            updateCollection(editingColl._id, collData);
        } else {
            addCollection(collData);
        }
        resetCollForm();
    };

    const resetCollForm = () => {
        setCTitle(''); setCImage(''); setCIllust('');
        setShowCollForm(false); setEditingColl(null);
    };

    const startEditColl = (coll) => {
        setEditingColl(coll); setCTitle(coll.title); setCImage(coll.image); setCIllust(coll.illust);
        setShowCollForm(true);
    };

    const handleSettingsUpdate = (e) => {
        e.preventDefault();
        updateSettings({
            heroTitle: sHeroTitle,
            heroSubtitle: sHeroSubtitle,
            heroDescription: sHeroDesc,
            brandName: sBrandName,
            footerTagline: sFooterTagline,
            footerCopyright: sFooterCopyright,
            footerSections: sFooterSections,
            razorpayKeyId: sRazorpayKeyId,
            razorpayKeySecret: sRazorpayKeySecret,
            socialLinks: { instagram: sInstagram, twitter: sTwitter },
            contactEmail: sContactEmail,
            currency: sCurrency,
            brandLogo: sBrandLogo,
            heroImage: sHeroImage
        });
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCat && !categories.includes(newCat)) {
            addCategory(newCat);
            setNewCat('');
        }
    };

    const handleSecSubmit = (e) => {
        e.preventDefault();
        const secData = { title: secTitle, highlight: secHighlight, productIds: secProducts };
        updateHomeSection(editingSec?._id, secData);
        resetSecForm();
    };

    const resetSecForm = () => {
        setSecTitle(''); setSecHighlight(''); setSecProducts([]);
        setShowSecForm(false); setEditingSec(null);
    };

    const startEditSec = (sec) => {
        setEditingSec(sec); setSecTitle(sec.title); setSecHighlight(sec.highlight || ''); setSecProducts(sec.productIds || []);
        setShowSecForm(true);
    };

    const styles = `
        .admin-layout { display: flex; min-height: 100vh; font-family: 'Outfit', sans-serif; background: #fff; position: relative; overflow-x: hidden; }
        .admin-sidebar { width: 300px; background: var(--clr-blue); color: #fff; padding: 1.5rem 1.5rem; display: flex; flex-direction: column; position: fixed; height: 100vh; z-index: 100; border-radius: 0 40px 40px 0; box-shadow: 10px 0 30px rgba(0,0,0,0.1); border-right: 8px solid var(--clr-orange); overflow-y: auto; }
        .admin-sidebar h2 { font-size: 1.6rem; font-weight: 900; margin-bottom: 1.5rem; color: #fff; text-shadow: 3px 3px 0 var(--clr-orange); }
        .admin-sidebar button { background: none; border: none; color: rgba(255,255,255,0.7); text-align: left; font-size: 1rem; font-weight: 700; padding: 0.8rem 1rem; border-radius: 20px; transition: 0.3s; margin-bottom: 0.3rem; cursor: pointer; width: 100%; display: flex; align-items: center; gap: 1rem; }
        .admin-sidebar button:hover { background: rgba(255,255,255,0.1); color: var(--clr-sky); transform: translateX(10px); }
        .admin-sidebar button.active { background: var(--clr-sky); color: var(--clr-blue); box-shadow: 4px 4px 0 var(--clr-yellow); }
        
        .admin-main { flex: 1; margin-left: 300px; padding: 4rem; position: relative; z-index: 1; }
        
        .card { background: #fff; border-radius: 30px; border: 4px solid var(--clr-blue); box-shadow: 10px 10px 0 var(--clr-sky); padding: 2.5rem; margin-bottom: 3rem; position: relative; overflow: hidden; }
        .card::before { content: ""; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: var(--clr-mint); opacity: 0.1; border-radius: 50%; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; margin-bottom: 3rem; }
        .stat-item { background: #fff; padding: 2rem; border-radius: 30px; border: 4px solid var(--clr-blue); box-shadow: 8px 8px 0 var(--clr-orange); text-align: center; }
        .stat-label { color: var(--clr-blue); font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 2.5rem; font-weight: 900; color: var(--clr-orange); line-height: 1; }
        
        .admin-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
        .admin-table th { text-align: left; padding: 1.2rem; background: var(--clr-sky); color: var(--clr-blue); font-size: 1rem; font-weight: 900; text-transform: uppercase; border-radius: 12px; }
        .admin-table td { padding: 1.2rem; background: #fff; border-top: 2px solid var(--clr-blue); border-bottom: 2px solid var(--clr-blue); color: var(--clr-blue); font-weight: 700; }
        .admin-table td:first-child { border-left: 2px solid var(--clr-blue); border-radius: 12px 0 0 12px; }
        .admin-table td:last-child { border-right: 2px solid var(--clr-blue); border-radius: 0 12px 12px 0; }
        .admin-table tr:hover td { background: #fdf8f0; }
        
        .badge { padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; border: 2px solid currentColor; }
        .badge-success { color: var(--clr-mint); background: #f0fff4; }
        .badge-warning { color: var(--clr-orange); background: #fffaf0; }
        
        .form-input { width: 100%; padding: 1rem; border: 3px solid var(--clr-blue); border-radius: 20px; margin-top: 0.5rem; font-family: inherit; font-size: 1rem; font-weight: 600; outline: none; }
        .form-input:focus { border-color: var(--clr-orange); box-shadow: 4px 4px 0 var(--clr-sky); }
        .form-label { display: block; font-size: 1.1rem; font-weight: 800; color: var(--clr-blue); font-family: var(--font-heading); }
        .form-group { margin-bottom: 2rem; }
        
        .btn { padding: 1rem 2rem; border-radius: 40px; font-weight: 800; cursor: pointer; border: 4px solid var(--clr-blue); transition: 0.3s; font-family: var(--font-heading); text-transform: uppercase; }
        .btn-primary { background: var(--clr-yellow); color: var(--clr-blue); box-shadow: 5px 5px 0 var(--clr-orange); }
        .btn-primary:hover { transform: scale(1.05); box-shadow: 8px 8px 0 var(--clr-orange); }
        .btn-danger { background: #ff4b4b!important; color: #fff!important; box-shadow: 5px 5px 0 var(--clr-blue)!important; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(59, 130, 246, 0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #fff; border-radius: 40px; width: 600px; padding: 3rem; border: 6px solid var(--clr-blue); box-shadow: 20px 20px 0 var(--clr-orange); max-height: 90vh; overflow-y: auto; position: relative; }
        
        .cloud-label { position: absolute; background: var(--clr-sky); color: var(--clr-blue); padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 900; top: -10px; left: 20px; border: 2px solid var(--clr-blue); }
        
        .tab-fade { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .product-admin-card { transition: 0.3s; }
        .product-admin-card:hover { transform: scale(1.02); box-shadow: 12px 12px 0 var(--clr-sky); }
        
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .bouncy { animation: bounce 2s infinite ease-in-out; }

        .product-form-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start; }
        .form-section { background: #fff; border-radius: 30px; border: 4px solid var(--clr-blue); box-shadow: 10px 10px 0 var(--clr-sky); padding: 2.5rem; margin-bottom: 2rem; }
        .form-section-header { font-size: 1.5rem; font-weight: 900; margin-bottom: 1.5rem; color: var(--clr-blue); display: flex; align-items: center; gap: 0.5rem; border-bottom: 3px dashed var(--clr-sky); padding-bottom: 1rem; }
        .image-upload-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; }
        .image-preview-card { position: relative; border-radius: 12px; overflow: hidden; border: 3px solid var(--clr-blue); aspect-ratio: 1; }
        .image-preview-card img { width: 100%; height: 100%; object-fit: cover; }
        .image-remove-btn { position: absolute; top: 2px; right: 2px; background: var(--clr-blue); color: #fff; border: none; cursor: pointer; padding: 2px 6px; border-radius: 50%; font-size: 0.8rem; }
        .add-image-card { border: 3px dashed var(--clr-sky); display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; border-radius: 12px; aspect-ratio: 1; transition: 0.3s; color: var(--clr-sky); }
        .add-image-card:hover { border-color: var(--clr-orange); color: var(--clr-orange); }

            @media (max-width: 1024px) {
                .admin-sidebar { width: 100px; padding: 2rem 0.5rem; }
                .admin-sidebar span { display: none; }
                .admin-sidebar h2 { font-size: 1.2rem; text-align: center; }
                .admin-main { margin-left: 100px; padding: 2rem; }
            }

            .admin-login-overlay { 
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: #fff; display: flex; align-items: center; justify-content: center; z-index: 5000;
            }
            .login-card {
                width: 100%; max-width: 450px; padding: 3.5rem; border-radius: 40px;
                border: 6px solid var(--clr-blue); box-shadow: 20px 20px 0 var(--clr-orange);
                background: #fff; position: relative; text-align: center;
            }
            .login-card h1 { font-size: 2.5rem; color: var(--clr-blue); margin-bottom: 1rem; }
            .login-card p { color: var(--clr-blue); font-weight: 700; margin-bottom: 2rem; }
            .error-msg { color: #ff4b4b; font-weight: 800; margin-top: 1rem; font-size: 0.9rem; }
        `;

    if (!isAuthorized) {
        return (
            <div className="admin-login-overlay">
                <style>{styles}</style>
                <BackgroundElements showExtra={true} />
                <div className="login-card bouncy">
                    <div className="cloud-label">🔒 ADMIN ACCESS</div>
                    <h1 className="styled-type">Ground <span className="marker-highlight">Control</span></h1>
                    <p className="handwritten-style">Identity verification required. Please enter your terminal credentials.</p>
                    
                    <form onSubmit={handleAdminLogin}>
                        <div className="form-group">
                            <label className="form-label" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Username</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Admin ID" 
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Password</label>
                            <input 
                                type="password" 
                                className="form-input" 
                                placeholder="••••••••" 
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', marginTop: '1rem' }}>
                            Access Command Center 🛰️
                        </button>
                        {loginError && <div className="error-msg">{loginError}</div>}
                    </form>
                    
                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/" style={{ color: 'var(--clr-blue)', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                            ← Return to Safety
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <style>{styles}</style>
            <BackgroundElements showExtra={true} extraProps={{ bgOpacity: 0.03 }} />
            
            <aside className="admin-sidebar">
                <h2 className="styled-type bouncy">
                    ☁️ <span>Cloud Admin</span>
                </h2>
                <nav>
                    <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 <span>Dashboard</span></button>
                    <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>🛍️ <span>Products</span></button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📜 <span>Orders</span></button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>👥 <span>Customers</span></button>
                    <button className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>🖼️ <span>Collections</span></button>
                    <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>💬 <span>Messages</span></button>
                    <button className={activeTab === 'home-sections' ? 'active' : ''} onClick={() => setActiveTab('home-sections')}>🏠 <span>Home Sections</span></button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙️ <span>Site Settings</span></button>
                </nav>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '15px' }}>
                        🏰 View Website
                    </Link>
                    <button onClick={() => { setIsAuthorized(false); sessionStorage.removeItem('adminActiveTab'); }} style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,75,75,0.3)', padding: '1rem', borderRadius: '15px', border: 'none', cursor: 'pointer', width: '100%' }}>
                        🚪 <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                {/* DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                    <div className="tab-fade">
                        <h1 className="styled-type" style={{ fontSize: '3.5rem', marginBottom: '3rem', color: 'var(--clr-blue)' }}>
                            Admin <span className="marker-highlight">Dashboard</span>
                        </h1>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-label">Total Sales</div>
                                <div className="stat-value">{settings.currency}{totalRev.toFixed(0)}</div>
                            </div>
                            <div className="stat-item" style={{ borderColor: 'var(--clr-sky)', boxShadow: '8px 8px 0 var(--clr-mint)' }}>
                                <div className="stat-label">Total Orders</div>
                                <div className="stat-value" style={{ color: 'var(--clr-mint)' }}>{orders.length}</div>
                            </div>
                            <div className="stat-item" style={{ borderColor: 'var(--clr-yellow)', boxShadow: '8px 8px 0 var(--clr-yellow)' }}>
                                <div className="stat-label">Customers</div>
                                <div className="stat-value" style={{ color: 'var(--clr-blue)' }}>{users.length}</div>
                            </div>
                            <div className="stat-item" style={{ borderColor: 'var(--clr-orange)', boxShadow: '8px 8px 0 var(--clr-sky)' }}>
                                <div className="stat-label">Messages</div>
                                <div className="stat-value" style={{ color: 'var(--clr-blue)' }}>{messages.length}</div>
                            </div>
                        </div>

                        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                            <div className="card">
                                <h3 className="styled-type" style={{ marginBottom: '1.5rem' }}>Recent Orders</h3>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Gold</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).reverse().map(ord => (
                                            <tr key={ord.id}>
                                                <td>#{ord.id}</td>
                                                <td>{settings.currency}{ord.total.toFixed(2)}</td>
                                                <td><span className={`badge ${ord.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{ord.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card">
                                <h3 className="styled-type" style={{ marginBottom: '1.5rem' }}>Recent Messages</h3>
                                {messages.slice(0, 3).reverse().map(m => (
                                     <div key={m._id} style={{ padding: '1rem', borderBottom: '2px dashed var(--clr-sky)' }}>
                                         <strong style={{ display: 'block' }}>{m.name}</strong>
                                         <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{m.text.substring(0, 60)}...</p>
                                     </div>
                                ))}
                                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }} onClick={() => setActiveTab('messages')}>View All Messages</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div className="tab-fade">
                        {showProductForm ? (
                            <div className="product-form-full">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                    <h1 className="styled-type" style={{ fontSize: '3rem' }}>
                                        {editingProduct ? 'Edit' : 'Add'} <span className="marker-highlight">Product</span>
                                    </h1>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn btn-danger" onClick={resetProductForm}>Discard</button>
                                        <button className="btn btn-primary" onClick={handleProductSubmit}>Save Product</button>
                                    </div>
                                </div>

                                <div className="product-form-layout">
                                    <div className="form-main">
                                        <div className="form-section">
                                            <div className="form-section-header">🎈 General Information</div>
                                            <div className="form-group">
                                                <label className="form-label">Title</label>
                                                <input className="form-input" required value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="e.g. Magic Cotton Hoodie" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Description</label>
                                                <textarea className="form-input" rows="6" value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Tell the product's story..." />
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <div className="form-section-header">🖼️ Media</div>
                                            <div className="image-upload-grid">
                                                {pImages.map((img, idx) => (
                                                    <div key={idx} className="image-preview-card">
                                                        <img src={img} alt="Product" />
                                                        <button className="image-remove-btn" onClick={() => setPImages(pImages.filter((_, i) => i !== idx))}>&times;</button>
                                                    </div>
                                                ))}
                                                <label className="add-image-card">
                                                    +
                                                    <input type="file" multiple accept="image/*" hidden onChange={handleMultipleFileUpload} />
                                                </label>
                                            </div>
                                            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--clr-blue)', opacity: 0.7 }}>Tip: First image will be used as the primary thumbnail.</p>
                                        </div>

                                        <div className="form-section">
                                            <div className="form-section-header">💰 Pricing</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="form-group">
                                                    <label className="form-label">Price ({settings.currency})</label>
                                                    <input className="form-input" type="number" step="0.01" value={pPrice} onChange={e => setPPrice(e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Compare-at Price</label>
                                                    <input className="form-input" type="number" step="0.01" value={pComparePrice} onChange={e => setPComparePrice(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <div className="form-section-header">📦 Inventory & Shipping</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="form-group">
                                                    <label className="form-label">SKU</label>
                                                    <input className="form-input" value={pSKU} onChange={e => setPSKU(e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Barcode (ISBN, UPC, GTIN)</label>
                                                    <input className="form-input" value={pBarcode} onChange={e => setPBarcode(e.target.value)} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="form-group">
                                                    <label className="form-label">Inventory Quantity</label>
                                                    <input className="form-input" type="number" value={pInventory} onChange={e => setPInventory(e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Weight (kg)</label>
                                                    <input className="form-input" type="number" step="0.1" value={pWeight} onChange={e => setPWeight(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <div className="form-section-header">🔍 SEO Booster</div>
                                            <div className="form-group">
                                                <label className="form-label">Page Title</label>
                                                <input className="form-input" value={pSeoTitle} onChange={e => setPSeoTitle(e.target.value)} placeholder="Meta title for Google" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Meta Description</label>
                                                <textarea className="form-input" rows="3" value={pSeoDesc} onChange={e => setPSeoDesc(e.target.value)} placeholder="Brief summary for search results" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-side">
                                        <div className="form-section">
                                            <div className="form-section-header">✨ Status</div>
                                            <select className="form-input" value={pStatus} onChange={e => setPStatus(e.target.value)}>
                                                <option value="active">Active</option>
                                                <option value="draft">Draft</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>

                                        <div className="form-section">
                                            <div className="form-section-header">🎨 Organization</div>
                                            <div className="form-group">
                                                <label className="form-label">Collection</label>
                                                <select className="form-input" value={pCollection} onChange={e => setPCollection(e.target.value)}>
                                                    <option value="">No Collection</option>
                                                    {collections.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Tags (comma separated)</label>
                                                <input className="form-input" value={pTags} onChange={e => setPTags(e.target.value)} placeholder="New, Sale, Winter..." />
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <div className="form-section-header">📐 Variations</div>
                                            <div className="form-group">
                                                <label className="form-label">Sizes</label>
                                                <input className="form-input" value={pSizes} onChange={e => setPSizes(e.target.value)} placeholder="S, M, L, XL or 2Y, 4Y..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Colors</label>
                                                <input className="form-input" value={pColors} onChange={e => setPColors(e.target.value)} placeholder="Red, Blue, Green..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Overlay Style</label>
                                                <select className="form-input" value={pStyle} onChange={e => setPStyle(e.target.value)}>
                                                    <option value="false">Standard Look</option>
                                                    <option value="true">Art Overlay (Multiply)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                    <h1 className="styled-type" style={{ fontSize: '3rem' }}>Product <span className="marker-highlight">Catalog</span></h1>
                                    <button className="btn btn-primary" onClick={() => setShowProductForm(true)}>+ Add New Product</button>
                                </div>
                                
                                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                                    {catalog.map(item => (
                                        <div key={item._id} className="card product-admin-card" style={{ padding: '1rem' }}>
                                            <div style={{ position: 'relative' }}>
                                                <img src={item.image} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px', border: '3px solid var(--clr-blue)' }} alt="" />
                                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                                    <span className={`badge ${item.status === 'draft' ? 'badge-warning' : 'badge-success'}`} style={{ background: '#fff' }}>
                                                        {item.status || 'active'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h3 className="styled-type">{item.title}</h3>
                                                    <span style={{ color: item.inventory <= 0 ? 'red' : 'green', fontWeight: 900, fontSize: '0.8rem' }}>
                                                        {item.inventory <= 0 ? 'OUT OF STOCK' : `${item.inventory} IN STOCK`}
                                                    </span>
                                                </div>
                                                <p className="handwritten-style" style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{item.category}</p>
                                                <p style={{ color: 'var(--clr-orange)', fontSize: '1.3rem', fontWeight: 900 }}>{settings.currency}{item.price.toFixed(2)}</p>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                                    <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => startEditProduct(item)}>Edit</button>
                                                    <button className="btn btn-danger" style={{ flex: 1, padding: '0.5rem' }} onClick={() => { if(window.confirm('Are you sure you want to delete this product?')) removeProduct(item._id); }}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div className="tab-fade">
                        <h1 className="styled-type" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Customer <span className="marker-highlight">Orders</span></h1>
                        <div className="card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(ord => (
                                        <tr key={ord.id}>
                                            <td style={{ fontWeight: 900 }}>#{ord.id}</td>
                                            <td>{ord.date}</td>
                                            <td style={{ fontWeight: 900, color: 'var(--clr-orange)' }}>{settings.currency}{ord.total.toFixed(2)}</td>
                                            <td>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 900 }}>{ord.paymentMethod}</div>
                                                <span className={`badge ${ord.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>{ord.paymentStatus}</span>
                                            </td>
                                            <td><span className={`badge ${ord.status === 'Confirmed' ? 'badge-success' : ord.status === 'Shipped' ? 'badge-warning' : ''}`} style={{ borderColor: ord.status === 'Delivered' ? 'green' : '' }}>{ord.status}</span></td>
                                            <td>
                                                <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setSelectedOrder(ord)}>View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {selectedOrder && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3 className="styled-type" style={{ fontSize: '2rem' }}>Order Details #{selectedOrder.id}</h3>
                                    <div style={{ marginTop: '2rem' }}>
                                        <div className="card" style={{ boxShadow: 'none', background: 'var(--clr-sky)', padding: '1.5rem' }}>
                                            <p><strong>Customer Name:</strong> {selectedOrder.customerName || 'Explorer'}</p>
                                            <p><strong>Customer Email:</strong> {selectedOrder.customerEmail || 'N/A'}</p>
                                            <p><strong>Total Items:</strong> {selectedOrder.items}</p>
                                            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                                            <div className="form-group">
                                                <label className="form-label">Order Status</label>
                                                <select className="form-input" value={selectedOrder.status} onChange={(e) => {
                                                    updateOrderStatus(selectedOrder.id, e.target.value);
                                                    setSelectedOrder({...selectedOrder, status: e.target.value});
                                                }}>
                                                    <option value="Confirmed">Confirmed ✅</option>
                                                    <option value="Shipped">Dispatched 🚀</option>
                                                    <option value="Delivered">Delivered 🏰</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Payment Status</label>
                                                <select className="form-input" value={selectedOrder.paymentStatus || 'Pending'} onChange={(e) => {
                                                    updateOrderPaymentStatus(selectedOrder.id, e.target.value);
                                                    setSelectedOrder({...selectedOrder, paymentStatus: e.target.value});
                                                }} style={{ borderColor: selectedOrder.paymentStatus === 'Paid' ? 'var(--clr-mint)' : selectedOrder.paymentStatus === 'Refunded' ? '#ef4444' : 'var(--clr-orange)' }}>
                                                    <option value="Pending">Pending ⏳</option>
                                                    <option value="Paid">Paid 💰</option>
                                                    <option value="Refunded">Refunded 🔄</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button className="btn btn-danger" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setSelectedOrder(null)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="tab-fade">
                        <h1 className="styled-type" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Customer <span className="marker-highlight">Directory</span></h1>
                        <div className="card">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Avatar</th>
                                        <th>Full Name</th>
                                        <th>Email Address</th>
                                        <th>Total Orders</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td><div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--clr-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{u.name.charAt(0)}</div></td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.orders || 0}</td>
                                            <td>
                                                <button onClick={() => { if(window.confirm('Are you sure you want to delete this user account?')) removeUser(u._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'categories' && (
                    <div>
                        <h1 className="styled-type" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Product <span className="marker-highlight">Categories</span></h1>
                        <div className="card" style={{ maxWidth: 600 }}>
                            <div className="cloud-label">Add Category</div>
                            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                                <input className="form-input" placeholder="Category name..." value={newCat} onChange={e => setNewCat(e.target.value)} />
                                <button className="btn btn-primary" style={{ minWidth: '150px' }}>Add Category</button>
                            </form>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {categories.map(cat => (
                                    <div key={cat} className="bouncy" style={{ background: 'var(--clr-sky)', color: 'var(--clr-blue)', border: '4px solid var(--clr-blue)', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1.5rem', fontWeight: 900, boxShadow: '4px 4px 0 var(--clr-yellow)' }}>
                                        {cat}
                                        <button onClick={() => { if(window.confirm(`Are you sure you want to delete the category '${cat}'?`)) removeCategory(cat); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1.2rem', color: 'var(--clr-orange)' }}>&times;</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* COLLECTIONS TAB */}
                {activeTab === 'collections' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h1 className="styled-type" style={{ fontSize: '3rem' }}>Product <span className="marker-highlight">Collections</span></h1>
                            <button className="btn btn-primary" onClick={() => setShowCollForm(true)}>+ Add New Collection</button>
                        </div>
                        
                        <div className="stats-grid">
                            {collections.map(coll => (
                                <div key={coll._id} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                    <div className="cloud-label">{coll.title}</div>
                                    <img src={coll.image} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '20px', border: '3px solid var(--clr-blue)', marginBottom: '1rem' }} alt="" />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn btn-primary" style={{ padding: '0.5rem', flex: 1 }} onClick={() => startEditColl(coll)}>✏️ Edit</button>
                                        <button className="btn btn-danger" style={{ padding: '0.5rem', flex: 1 }} onClick={() => { if(window.confirm('Are you sure you want to delete this collection?')) removeCollection(coll._id); }}>🗑️ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showCollForm && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3 className="styled-type" style={{ fontSize: '2rem' }}>{editingColl ? 'Update Collection' : 'New Collection'}</h3>
                                    <form onSubmit={handleCollSubmit} style={{ marginTop: '2rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Collection Name</label>
                                            <input className="form-input" required value={cTitle} onChange={e => setCTitle(e.target.value)} placeholder="e.g. Summer Outfits" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Upload Main Image</label>
                                            <input type="file" accept="image/*" className="form-input" style={{ padding: '0.7rem' }} onChange={e => handleFileUpload(e, setCImage)} />
                                            {cImage && <img src={cImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '1rem', borderRadius: '15px', border: '3px solid var(--clr-blue)' }} />}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Upload Illustration Overlay (Optional)</label>
                                            <input type="file" accept="image/*" className="form-input" style={{ padding: '0.7rem' }} onChange={e => handleFileUpload(e, setCIllust)} />
                                            {cIllust && <img src={cIllust} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', marginTop: '1rem', borderRadius: '15px', border: '3px dashed var(--clr-blue)' }} />}
                                        </div>
                                        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
                                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                            <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={resetCollForm}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* MESSAGES TAB */}
                {activeTab === 'messages' && (
                    <div>
                        <h1 className="styled-type" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Customer <span className="marker-highlight">Messages</span></h1>
                        <div className="card">
                            {messages.length === 0 ? (
                                <p style={{ color: 'var(--clr-blue)', textAlign: 'center', padding: '5rem', fontSize: '1.5rem' }} className="handwritten-style">No messages yet. 🎐</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {messages.map(m => (
                                        <div key={m._id} style={{ border: '4px solid var(--clr-blue)', padding: '2rem', borderRadius: '30px', background: 'var(--clr-sky)', position: 'relative' }}>
                                            <div className="cloud-label">{m.date}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div>
                                                    <strong style={{ fontSize: '1.5rem', color: 'var(--clr-blue)' }}>{m.name || 'Anonymous Rebel'}</strong>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--clr-orange)', fontWeight: 800 }}>{m.email}</p>
                                                </div>
                                            </div>
                                            <p style={{ margin: '1rem 0', color: 'var(--clr-blue)', fontSize: '1.2rem', fontWeight: 700 }}>"{m.text}"</p>
                                            <button onClick={() => { if(window.confirm('Are you sure you want to delete this message?')) removeMessage(m._id); }} className="btn btn-danger" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>Delete Message</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div className="tab-fade">
                        <h1 className="styled-type" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Site <span className="marker-highlight">Settings</span></h1>
                        <form onSubmit={handleSettingsUpdate}>
                            <div className="product-form-layout">
                                <div className="form-main">
                                    <div className="form-section">
                                        <div className="form-section-header">🌍 General Information</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="form-group">
                                                <label className="form-label">Contact Email</label>
                                                <input className="form-input" value={sContactEmail} onChange={e => setSContactEmail(e.target.value)} placeholder="hello@example.com" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Currency Symbol</label>
                                                <input className="form-input" value={sCurrency} onChange={e => setSCurrency(e.target.value)} placeholder="$" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <div className="form-section-header">✨ Branding & Hero</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <div className="form-group">
                                                <label className="form-label">Brand Name</label>
                                                <input className="form-input" value={sBrandName} onChange={e => setSBrandName(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Upload Brand Logo (Optional)</label>
                                                <input type="file" className="form-input" onChange={e => handleFileUpload(e, setSBrandLogo)} />
                                                {sBrandLogo && <img src={sBrandLogo} style={{ height: '50px', objectFit: 'contain', marginTop: '1rem' }} alt="" />}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hero Image (The kids cutout)</label>
                                            <input type="file" className="form-input" onChange={e => handleFileUpload(e, setSHeroImage)} />
                                            {sHeroImage && <img src={sHeroImage} style={{ height: '100px', objectFit: 'contain', marginTop: '1rem' }} alt="" />}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hero Title (Use , for line breaks)</label>
                                            <input className="form-input" value={sHeroTitle} onChange={e => setSHeroTitle(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hero Subtitle</label>
                                            <input className="form-input" value={sHeroSubtitle} onChange={e => setSHeroSubtitle(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hero Description</label>
                                            <textarea className="form-input" style={{ borderRadius: '30px' }} rows="3" value={sHeroDesc} onChange={e => setSHeroDesc(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <div className="form-section-header">🎐 Footer Details</div>
                                        <div className="form-group">
                                            <label className="form-label">Footer Tagline</label>
                                            <input className="form-input" value={sFooterTagline} onChange={e => setSFooterTagline(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Footer Copyright</label>
                                            <input className="form-input" value={sFooterCopyright} onChange={e => setSFooterCopyright(e.target.value)} />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label" style={{ marginBottom: '1rem' }}>Footer Sections (Max 4)</label>
                                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                                {sFooterSections.map((section, sIdx) => (
                                                    <div key={sIdx} style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '25px', border: '3px solid var(--clr-sky)' }}>
                                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                                                            <input 
                                                                className="form-input" 
                                                                style={{ fontWeight: 900, flex: 1 }} 
                                                                value={section.title} 
                                                                onChange={e => handleFooterSectionTitleChange(sIdx, e.target.value)} 
                                                                placeholder="Section Title" 
                                                            />
                                                            <select 
                                                                className="form-input" 
                                                                style={{ width: '120px', padding: '0.4rem' }}
                                                                value={section.type}
                                                                onChange={e => handleFooterSectionTypeChange(sIdx, e.target.value)}
                                                            >
                                                                <option value="links">Links</option>
                                                                <option value="text">Text</option>
                                                                <option value="socials">Socials</option>
                                                            </select>
                                                            <button type="button" className="btn btn-danger" style={{ padding: '0.6rem 1rem' }} onClick={() => handleRemoveFooterSection(sIdx)}>Remove</button>
                                                        </div>
                                                        
                                                        {section.type === 'links' && (
                                                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                                                {section.links.map((link, lIdx) => (
                                                                    <div key={lIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.8rem' }}>
                                                                        <input className="form-input" style={{ fontSize: '0.8rem' }} value={link.label} onChange={e => handleLinkChangeInSection(sIdx, lIdx, 'label', e.target.value)} placeholder="Label" />
                                                                        <input className="form-input" style={{ fontSize: '0.8rem' }} value={link.url} onChange={e => handleLinkChangeInSection(sIdx, lIdx, 'url', e.target.value)} placeholder="URL" />
                                                                        <button type="button" onClick={() => handleRemoveLinkFromSection(sIdx, lIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                                                                    </div>
                                                                ))}
                                                                <button type="button" className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'var(--clr-sky)', color: 'var(--clr-blue)' }} onClick={() => handleAddLinkToSection(sIdx)}>+ Add Link</button>
                                                            </div>
                                                        )}

                                                        {section.type === 'text' && (
                                                            <textarea 
                                                                className="form-input" 
                                                                style={{ borderRadius: '15px', fontSize: '0.9rem' }} 
                                                                rows="3" 
                                                                value={section.content} 
                                                                onChange={e => handleFooterSectionContentChange(sIdx, e.target.value)}
                                                                placeholder="Enter custom text for this section..."
                                                            />
                                                        )}

                                                        {section.type === 'socials' && (
                                                            <p style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--clr-blue)', fontWeight: 700 }}>This section will display the social handles from your Site Settings.</p>
                                                        )}
                                                    </div>
                                                ))}
                                                {sFooterSections.length < 4 && (
                                                    <button type="button" className="btn btn-primary" style={{ padding: '1rem' }} onClick={handleAddFooterSection}>+ Create New Section</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-side">
                                    <div className="form-section">
                                        <div className="form-section-header">📱 Social Handles</div>
                                        <div className="form-group">
                                            <label className="form-label">Instagram</label>
                                            <input className="form-input" value={sInstagram} onChange={e => setSInstagram(e.target.value)} placeholder="@handle" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Twitter</label>
                                            <input className="form-input" value={sTwitter} onChange={e => setSTwitter(e.target.value)} placeholder="@handle" />
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <div className="form-section-header">💳 Payment Gateway (Razorpay)</div>
                                        <div className="form-group">
                                            <label className="form-label">Key ID</label>
                                            <input className="form-input" value={sRazorpayKeyId} onChange={e => setSRazorpayKeyId(e.target.value)} placeholder="rzp_test_..." />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Key Secret</label>
                                            <input className="form-input" type="password" value={sRazorpayKeySecret} onChange={e => setSRazorpayKeySecret(e.target.value)} placeholder="••••••••" />
                                        </div>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--clr-blue)' }}>Make sure to use test keys for development.</p>
                                    </div>

                                    <div className="card" style={{ background: 'var(--clr-orange)', border: 'none', color: '#fff' }}>
                                        <h3 className="styled-type" style={{ color: '#fff', marginBottom: '1rem' }}>Ready to Launch?</h3>
                                        <p style={{ fontWeight: 800, marginBottom: '2rem' }}>All changes will be applied instantly to your store.</p>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%', border: '4px solid #fff' }}>Apply All Settings</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
