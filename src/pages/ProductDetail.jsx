import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

export default function ProductDetail() {
    const { id } = useParams();
    const { catalog, addToCart, settings } = useShop();
    const [product, setProduct] = useState(null);
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const found = catalog.find(p => p._id === id);
        if (found) {
            setProduct(found);
            setMainImage(found.image);
            
            const sizesArr = found.sizes && found.sizes.length > 0 ? found.sizes : [];
            if(!selectedSize && sizesArr.length > 0) setSelectedSize(sizesArr[0]);
            
            const colorsArr = found.colors && found.colors.length > 0 ? found.colors : [];
            if(!selectedColor && colorsArr.length > 0) setSelectedColor(colorsArr[0]);

            // SEO
            document.title = found.seoTitle || `${found.title} - ${settings.brandName}`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', found.seoDescription || found.description || '');

            window.scrollTo(0, 0);
        }
    }, [id, catalog]);

    if (!product) {
        return (
            <div style={{ padding: '10rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
                <h1>Product Not Found 🔍</h1>
                <Link to="/products" className="btn btn-pill btn-primary" style={{ marginTop: '2rem' }}>Back to Shop</Link>
            </div>
        );
    }

    const displaySizes = product.sizes && product.sizes.length > 0 ? product.sizes : [];
    const displayColors = product.colors && product.colors.length > 0 ? product.colors : [];
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const related = catalog.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);

    const handleAdd = () => {
        addToCart({ ...product, size: selectedSize, color: selectedColor });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const styles = `
        .product-detail-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 5rem; align-items: start; padding-top: 4rem; }
        @media (max-width: 900px) { .product-detail-hero { grid-template-columns: 1fr; gap: 3rem; } }
        
        .gallery-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .product-gallery { position: relative; width: 100%; border-radius: 40px; overflow: hidden; background: #fff; padding: 2rem; border: 4px solid var(--clr-blue); box-shadow: 12px 12px 0 var(--clr-sky); display: flex; align-items: center; justify-content: center; min-height: 400px; }
        .product-gallery.multiply { mix-blend-mode: multiply; }
        .product-gallery img { width: 100%; max-height: 600px; object-fit: contain; z-index: 2; position: relative; transition: 0.3s; }
        
        .thumbnail-grid { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: thin; }
        .thumbnail-item { flex: 0 0 80px; height: 80px; border-radius: 12px; border: 3px solid var(--clr-blue); cursor: pointer; overflow: hidden; transition: 0.2s; background: #fff; }
        .thumbnail-item:hover { transform: translateY(-3px); }
        .thumbnail-item.active { border-color: var(--clr-orange); box-shadow: 4px 4px 0 var(--clr-sky); }
        .thumbnail-item img { width: 100%; height: 100%; object-fit: cover; }

        .detail-info { padding: 1rem; }
        .detail-cat { font-family: var(--font-hand); font-size: 1.8rem; color: var(--clr-orange); margin-bottom: 0.5rem; }
        .detail-title { font-size: 4rem; margin-bottom: 1rem; line-height: 1.1; }
        .price-container { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
        .detail-price { font-size: 2.5rem; color: var(--clr-blue); font-weight: 900; }
        .compare-price { font-size: 1.5rem; color: #94a3b8; text-decoration: line-through; font-weight: 700; }
        
        .variant-header { font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; color: var(--clr-blue); font-family: var(--font-heading); text-transform: uppercase; letter-spacing: 1px; }
        .size-picker, .color-picker { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        
        .size-btn { width: 55px; height: 55px; border-radius: 15px; border: 3px solid var(--clr-blue); background: #fff; color: var(--clr-blue); font-weight: 800; cursor: pointer; transition: 0.3s; font-family: var(--font-heading); display: flex; align-items: center; justify-content: center; }
        .size-btn.active { background: var(--clr-yellow); box-shadow: 4px 4px 0 var(--clr-blue); transform: scale(1.05); }
        
        .color-btn { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--clr-blue); cursor: pointer; transition: 0.3s; position: relative; }
        .color-btn.active { transform: scale(1.2); box-shadow: 4px 4px 0 var(--clr-sky); border-color: var(--clr-orange); }
        .color-btn:hover::after { content: attr(title); position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); background: var(--clr-blue); color: #fff; padding: 2px 8px; border-radius: 5px; font-size: 0.7rem; white-space: nowrap; z-index: 10; }

        .magic-desc { background: var(--clr-mint); padding: 2.5rem; border-radius: 30px; border: 3px dashed var(--clr-blue); margin: 2.5rem 0; font-family: var(--font-hand); font-size: 1.6rem; color: var(--clr-blue); position: relative; }
        .magic-desc::before { content: "The Magic:"; display: block; position: absolute; top: -15px; left: 20px; background: var(--clr-blue); color: #fff; padding: 2px 15px; border-radius: 20px; font-weight: 800; font-family: var(--font-heading); font-size: 0.9rem; }
        
        .inventory-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 900; font-size: 0.8rem; margin-bottom: 2rem; border: 2px solid currentColor; }
    `;

    return (
        <>
            <style>{styles}</style>
            <BackgroundElements showExtra={true} extraProps={{ bgOpacity: 0.05 }} />
            <Header />

            <section className="product-detail-hero">
                <div className="gallery-container">
                    <div className="product-gallery-wrapper" style={{ position: 'relative' }}>
                        <div className="watercolor-blob blob-mint" style={{ position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%', opacity: 0.4 }}></div>
                        <div className={`product-gallery ${product.isMultiply ? 'multiply' : ''} floating-med`}>
                            <img src={mainImage} alt={product.title} />
                        </div>
                    </div>
                    {images.length > 1 && (
                        <div className="thumbnail-grid">
                            {images.map((img, idx) => (
                                <div key={idx} className={`thumbnail-item ${mainImage === img ? 'active' : ''}`} onClick={() => setMainImage(img)}>
                                    <img src={img} alt="" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="detail-info">
                    <p className="detail-cat">{product.category}</p>
                    <h1 className="detail-title styled-type">{product.title}</h1>
                    
                    <div className="price-container">
                        <span className="detail-price">{settings.currency}{product.price.toFixed(2)}</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                            <span className="compare-price">{settings.currency}{product.comparePrice.toFixed(2)}</span>
                        )}
                    </div>

                    {product.inventory !== undefined && (
                        <div className="inventory-badge" style={{ color: product.inventory <= 0 ? '#ef4444' : (product.inventory < 10 ? 'var(--clr-orange)' : 'var(--clr-mint)') }}>
                            {product.inventory <= 0 ? '🚫 Out of Stock' : (product.inventory < 10 ? `⚠️ Only ${product.inventory} left!` : '✨ In Stock')}
                        </div>
                    )}
                    
                    {displayColors.length > 0 && (
                        <div>
                            <h4 className="variant-header">Select Color: {selectedColor}</h4>
                            <div className="color-picker">
                                {displayColors.map(c => (
                                    <button 
                                        key={c} 
                                        title={c}
                                        className={`color-btn ${selectedColor === c ? 'active' : ''}`} 
                                        style={{ backgroundColor: c.toLowerCase() }}
                                        onClick={() => setSelectedColor(c)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {displaySizes.length > 0 && (
                        <div>
                            <h4 className="variant-header">Select Size: {selectedSize}</h4>
                            <div className="size-picker">
                                {displaySizes.map(s => (
                                    <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="magic-desc">
                        {product.description || "Every stitch is spun from dreams and stitched with stardust."}
                    </div>

                    <button 
                        className="btn btn-pill btn-primary btn-large scribble-shadow" 
                        style={{ 
                            width: '100%', 
                            padding: '1.5rem', 
                            fontSize: '1.4rem',
                            background: product.inventory <= 0 ? '#cbd5e1' : (added ? 'var(--clr-mint)' : 'var(--clr-orange)'), 
                            color: added || product.inventory <= 0 ? 'var(--clr-blue)' : '#fff',
                            cursor: product.inventory <= 0 ? 'not-allowed' : 'pointer',
                            opacity: product.inventory <= 0 ? 0.7 : 1
                        }}
                        onClick={product.inventory <= 0 ? null : handleAdd}
                        disabled={product.inventory <= 0}
                    >
                        {product.inventory <= 0 ? "Out of Stock" : (added ? "Added to Cart! ✓" : "Add to Cart")}
                    </button>

                    <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 800, color: 'var(--clr-blue)', background: '#fff', padding: '1rem', borderRadius: '20px', border: '2px solid var(--clr-sky)' }}>
                            🚀 <span>Fast Ship</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 800, color: 'var(--clr-blue)', background: '#fff', padding: '1rem', borderRadius: '20px', border: '2px solid var(--clr-sky)' }}>
                            🛡️ <span>Best Quality</span>
                        </div>
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="related-section">
                    <h2 className="related-title styled-type">More <span className="marker-highlight text-yellow">Sweet</span> Stuff</h2>
                    <div className="products-grid">
                        {related.map((p, idx) => (
                            <ProductCard key={p._id} product={p} index={idx} />
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </>
    );
}
