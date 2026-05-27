import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function BottomNav() {
    const { cart, user } = useShop();
    const location = useLocation();
    const cartCount = cart.reduce((total, item) => total + item.qty, 0);

    const navItems = [
        { label: 'Home', path: '/', icon: '🏠' },
        { label: 'Shop', path: '/products', icon: '🛍️' },
        { label: 'Account', path: user ? '/profile' : '/login', icon: '👤' },
        { label: 'Cart', path: '/cart', icon: '🛒', count: cartCount }
    ];

    const styles = `
        .mobile-bottom-nav {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 450px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(15px);
            border: 3px solid var(--clr-blue);
            border-radius: 40px;
            display: none; /* Hidden by default, show on mobile */
            justify-content: space-around;
            padding: 0.8rem 1rem;
            z-index: 2000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15), 6px 6px 0 var(--clr-orange);
        }

        .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: var(--clr-blue);
            font-weight: 800;
            font-size: 0.75rem;
            position: relative;
            transition: 0.3s;
            padding: 5px 10px;
            border-radius: 20px;
        }

        .bottom-nav-item.active {
            background: var(--clr-sky);
            transform: translateY(-5px);
            color: var(--clr-blue);
        }

        .bottom-nav-icon {
            font-size: 1.5rem;
            margin-bottom: 2px;
        }

        .nav-badge {
            position: absolute;
            top: 2px;
            right: 0px;
            background: var(--clr-orange);
            color: white;
            font-size: 0.7rem;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #fff;
        }

        @media (max-width: 768px) {
            .mobile-bottom-nav { display: flex; }
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <nav className="mobile-bottom-nav">
                {navItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="bottom-nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                        {item.count > 0 && <span className="nav-badge">{item.count}</span>}
                    </Link>
                ))}
            </nav>
        </>
    );
}
