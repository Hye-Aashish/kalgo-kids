import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import { useShop } from '../context/ShopContext';

export default function Cart() {
    const { cart, updateQty, removeFromCart, checkout, settings, showNotify, user } = useShop();
    const navigate = useNavigate();

    if (!user) {
        return (
            <>
                <BackgroundElements />
                <Header />
                <section className="cart-auth-notice" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5%' }}>
                    <div className="glass-card collage-border" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px' }}>
                        <div className="avatar" style={{ margin: '0 auto 2rem', width: '80px', height: '80px', background: 'var(--clr-sky)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '3px dashed var(--clr-blue)' }}>🔒</div>
                        <h2 className="styled-type" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Members Only! ✨</h2>
                        <p className="handwritten-style" style={{ fontSize: '1.4rem', marginBottom: '2.5rem', color: 'var(--clr-blue)' }}>
                            Please log in to see your magical cart and continue your journey.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link to="/login" state={{ from: '/cart' }} className="btn btn-pill btn-primary btn-large scribble-shadow">
                                Log In 🏰
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    const subtotal = cart.reduce((tot, item) => tot + (item.price * item.qty), 0);

    const handleCheckout = () => {
        if (cart.length === 0) {
            showNotify('Your cart is empty! Add some products first.', 'error');
            return;
        }
        navigate('/checkout');
    };

    const styles = `
        .cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 4rem; margin-top: 2rem; }
        @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
        .cart-list { background: #fff; border: 3px solid var(--clr-blue); border-radius: 20px; box-shadow: 8px 8px 0 var(--clr-orange); padding: 1rem 2rem; }
        .cart-item { display: flex; align-items: center; gap: 2rem; padding: 2rem 0; border-bottom: 2px dashed var(--clr-sky); position: relative;}
        .cart-item:last-child { border-bottom: none; }
        .cart-thumb { width: 140px; height: 140px; border-radius: 12px; background: #fafafa; border: 2px solid #eee; display: flex; align-items:center; justify-content:center; overflow:hidden;}
        .cart-thumb.multiply img { max-width: 90%; max-height: 90%; object-fit: contain; mix-blend-mode: multiply; }
        .cart-thumb.real-photo img { width: 100%; height: 100%; object-fit: cover; }
        .cart-details { flex: 1; min-width: 0; padding-right: 1rem; }
        .cart-details h4 { font-family: var(--font-heading); font-size: 1.6rem; color: var(--clr-blue); margin-bottom: 0.5rem; word-wrap: break-word; }
        .cart-details .price { font-size: 1.4rem; color: var(--clr-orange); font-weight: 800; }
        .qty-box { display: inline-flex; align-items: center; border: 2px solid var(--clr-blue); border-radius: 25px; overflow: hidden; margin-top: 1rem; }
        .qty-btn { background: transparent; border: none; padding: 0.5rem 1.2rem; cursor: pointer; color: var(--clr-blue); font-weight: 800; font-family: var(--font-heading); font-size: 1.2rem; transition: background 0.2s; }
        .qty-btn:hover { background: var(--clr-sky); }
        .qty-val { padding: 0 1rem; font-weight: 800; color: var(--clr-blue); font-size: 1.2rem; }
        .del-btn { align-self: flex-start; margin-top: 0.5rem; background: transparent; border: none; color: #ff4b4b; font-family: var(--font-hand); font-size: 1.5rem; cursor: pointer; text-decoration: underline; white-space: nowrap; transition: 0.3s; }
        .del-btn:hover { color: #cc0000; }
        .summary-card { position: sticky; top: 120px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; font-family: var(--font-heading); font-size: 1.2rem; color: var(--clr-blue); font-weight: 600; }
        .summary-total { font-size: 1.8rem; font-weight: 900; border-top: 3px solid var(--clr-orange); padding-top: 1.5rem; margin-top: 1.5rem; }
        .promo-box { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
        .promo-box input { flex:1; padding: 0.8rem 1rem; border: 2px solid var(--clr-blue); border-radius: 30px; font-family: var(--font-heading); font-size:1rem; outline: none; }
        .promo-box input:focus { border-color: var(--clr-orange); }
        .promo-btn { padding: 0.8rem 1.5rem; background: var(--clr-blue); color: white; border: none; border-radius: 30px; font-family: var(--font-heading); font-weight: 800; cursor: pointer; }
        @media (max-width: 768px) {
            .cart-item { flex-direction: column; text-align: center; gap: 1rem; padding: 2rem 1rem;}
            .cart-details { padding-right: 0; min-width: 100%; display: flex; flex-direction: column; align-items: center; }
            .cart-thumb { width: 100%; height: 220px; }
            .del-btn { align-self: center; margin-top: 1.5rem; margin-left: 0; }
            .cart-list { padding: 1rem; }
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <BackgroundElements showExtra={true} extraProps={{ blob2: { background: 'var(--clr-sky)', opacity: 0.1, top: '20%', left: '-10%' }, hideBlob3: true, bgOpacity: 0.05 }} />
            <Header />

            <section className="cart-section" style={{ paddingTop: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="hero-title styled-type text-stroke" style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                    Shopping <span className="marker-highlight" style={{ WebkitTextStroke: 0 }}>Cart</span>
                </h1>
                
                <div className="cart-layout">
                    <div className="cart-list">
                        {cart.length === 0 ? (
                            <h3 style={{ textAlign: 'center', padding: '3rem', color: 'var(--clr-blue)', fontFamily: 'var(--font-heading)' }}>
                                Your shopping cart is empty!
                            </h3>
                        ) : (
                            cart.map((item, index) => (
                                <div className="cart-item" key={index}>
                                    <div className={`cart-thumb ${item.isMultiply ? 'multiply' : 'real-photo'}`}>
                                        <img src={item.image} alt={item.title} onError={(e) => e.target.style.display='none'} />
                                    </div>
                                    <div className="cart-details">
                                        <h4>{item.title}</h4>
                                        <p className="price">{settings.currency}{item.price.toFixed(2)}</p>
                                        <div className="qty-box">
                                            <button className="qty-btn" onClick={() => updateQty(index, -1)}>-</button>
                                            <span className="qty-val">{item.qty}</span>
                                            <button className="qty-btn" onClick={() => updateQty(index, 1)}>+</button>
                                        </div>
                                    </div>
                                    <button className="del-btn" onClick={() => removeFromCart(index)}>Remove x</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div className="watercolor-blob blob-mint" style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.3, zIndex: 0 }}></div>
                        <div className="glass-card summary-card collage-border" style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
                            <h3 className="styled-type" style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--clr-blue)' }}>Order Summary</h3>
                            
                            <div className="promo-box">
                                <input type="text" placeholder="Promo Code (Optional)" />
                                <button className="promo-btn">Apply</button>
                            </div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{settings.currency}{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span style={{ color: 'var(--clr-orange)' }}>Free ✨</span>
                            </div>
                            
                            <div className="summary-row summary-total">
                                <span>Total ({settings.currency})</span>
                                <span style={{ color: 'var(--clr-orange)' }}>{settings.currency}{subtotal.toFixed(2)}</span>
                            </div>

                            <button 
                                className="btn btn-pill btn-primary" 
                                style={{ width: '100%', marginTop: '2rem', fontSize: '1.4rem', padding: '1.2rem 0', boxShadow: '6px 6px 0 var(--clr-blue)' }}
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer style={{ marginTop: '8rem' }} />
        </>
    );
}

