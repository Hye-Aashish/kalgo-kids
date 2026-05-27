import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Header() {
    const { cart, settings, user } = useShop();
    const location = useLocation();
    
    const cartCount = cart.reduce((total, item) => total + item.qty, 0);

    return (
        <header className="glass-header" style={{ position: 'sticky', top: '20px' }}>
            <div className="logo">
                <Link to="/" className="logo-text" style={{ textDecoration: 'none' }}>
                    {settings.brandLogo ? (
                        <img src={settings.brandLogo} alt={settings.brandName} style={{ height: '40px', objectFit: 'contain' }} />
                    ) : (
                        settings.brandName || "KALGO Kids"
                    )}
                </Link>
            </div>
            <nav className="nav-links">
                <Link to="/" style={{ color: location.pathname === '/' ? 'var(--clr-orange)' : '' }}>Home</Link>
                <Link to="/about" style={{ color: location.pathname === '/about' ? 'var(--clr-orange)' : '' }}>About</Link>
                <Link to="/products" style={{ color: location.pathname === '/products' ? 'var(--clr-orange)' : '' }}>Shop</Link>
                <Link to="/contact" style={{ color: location.pathname === '/contact' ? 'var(--clr-orange)' : '' }}>Contact Us</Link>
            </nav>
            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {user ? (
                    <Link to="/profile" className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <span className="handwritten-style" style={{ fontSize: '1.2rem', color: 'var(--clr-blue)' }}>Hi, {user.name.split(' ')[0]}!</span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--clr-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 900 }}>{user.name.charAt(0).toUpperCase()}</div>
                    </Link>
                ) : (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-pill btn-white" style={{ border: '2px solid var(--clr-blue)' }}>Login</button>
                    </Link>
                )}
                
                <Link to="/cart" style={{ textDecoration: 'none' }}>
                    <button className="btn btn-pill btn-black cart-counter" style={{ transition: 'transform 0.2s ease', cursor: 'pointer', background: location.pathname.includes('/cart') ? 'var(--clr-orange)' : '', color: location.pathname.includes('/cart') ? '#fff' : '', borderColor: location.pathname.includes('/cart') ? 'var(--clr-orange)' : '' }}>
                        Cart ({cartCount})
                    </button>
                </Link>
            </div>
        </header>
    );
}


