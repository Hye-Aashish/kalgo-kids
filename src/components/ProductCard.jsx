import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
    const { addToCart, settings } = useShop();
    const [added, setAdded] = useState(false);

    const onSale = product.comparePrice && product.comparePrice > product.price;

    const handleAdd = (e) => {
        e.preventDefault();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const tilts = ['tilted-left', 'tilted-right', ''];
    const tilt = tilts[Math.floor(Math.random() * tilts.length)];
    const blobs = ['blob-blue', 'blob-pink', 'blob-yellow'];
    const blob = blobs[Math.floor(Math.random() * blobs.length)];

    return (
        <div className={`product-card glass-card collage-border ${tilt}`}>
            {onSale && (
                <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--clr-orange)', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontWeight: 900, zIndex: 10, fontSize: '0.8rem', boxShadow: '4px 4px 0 var(--clr-blue)' }}>
                    SALE! 🏷️
                </div>
            )}
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                <div className="prod-img-box" style={{ marginBottom: '1.5rem' }}>
                    <div className={`watercolor-blob ${blob}`}></div>
                    <img src={product.image} alt={product.title} className="floating-product" onError={(e) => e.target.style.display='none'} />
                    <div className="masking-tape top-right"></div>
                </div>
                
                <div className="prod-info">
                    <span className="handwritten-tag" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>{product.category}</span>
                    <h3 className="styled-type" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--clr-blue)' }}>{product.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="price-tag styled-type" style={{ fontSize: '1.8rem', color: 'var(--clr-orange)' }}>
                            {settings.currency}{product.price ? product.price.toFixed(2) : "0.00"}
                        </div>
                        {onSale && (
                            <div style={{ textDecoration: 'line-through', color: '#94a3b8', fontWeight: 700, fontSize: '1.1rem' }}>
                                {settings.currency}{product.comparePrice.toFixed(2)}
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button 
                    onClick={handleAdd}
                    className={`btn-primary ${added ? 'success' : ''}`}
                    style={{ flex: 1, padding: '0.8rem' }}
                >
                    {added ? "Added! ✓" : "Add to Cart"}
                </button>
                <Link to={`/product/${product._id}`} className="btn-primary" style={{ background: 'var(--clr-orange)', border: 'none', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.8rem 1rem', borderRadius: '30px', flex: 1 }}>Buy Now</Link>
            </div>
        </div>
    );
}
