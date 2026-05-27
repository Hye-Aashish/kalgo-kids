import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

export default function Orders() {
    const { user, orders, settings } = useShop();

    if (!user) {
        return (
            <>
                <BackgroundElements />
                <Header />
                <section className="orders-auth-notice" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5%' }}>
                    <div className="glass-card collage-border" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px' }}>
                        <div className="avatar" style={{ margin: '0 auto 2rem', width: '80px', height: '80px', background: 'var(--clr-yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '3px dashed var(--clr-blue)' }}>📦</div>
                        <h2 className="styled-type" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Where's My Magic? 🔎</h2>
                        <p className="handwritten-style" style={{ fontSize: '1.4rem', marginBottom: '2.5rem', color: 'var(--clr-blue)' }}>
                            Log in to track your orders and see your adventure history!
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link to="/login" state={{ from: '/orders' }} className="btn btn-pill btn-primary btn-large scribble-shadow">
                                Log In 🏰
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    return (
        <>
            <BackgroundElements />
            <Header />
            
            <section className="orders-page" style={{ minHeight: '80vh' }}>
                <h1 className="hero-title styled-type text-stroke">My <span className="marker-highlight text-sky">Orders</span></h1>
                <p className="handwritten-style" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>Track your magic deliveries here!</p>

                <div className="orders-list">
                    {orders.length === 0 ? (
                        <div className="glass-card text-center" style={{ padding: '5rem' }}>
                            <h3 className="handwritten-style" style={{ fontSize: '2rem' }}>No orders found...</h3>
                            <Link to="/products" className="btn btn-pill btn-primary" style={{ marginTop: '2rem' }}>Start Shopping</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            {orders.map(order => (
                                <div key={order.id} className="polaroid-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <p className="handwritten-style" style={{ color: 'var(--clr-orange)', fontSize: '1.2rem' }}>{order.date}</p>
                                        <h3 style={{ fontSize: '1.8rem', color: 'var(--clr-blue)' }}>Order #{order.id}</h3>
                                        <p style={{ fontWeight: 800, marginTop: '0.5rem' }}>{order.items} Items • {settings.currency}{order.total.toFixed(2)}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`badge ${order.status === 'Paid' ? 'badge-success' : order.status === 'Shipped' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '1rem', padding: '0.8rem 1.5rem' }}>
                                            {order.status}
                                        </span>
                                        <p className="handwritten-style" style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
                                            {order.status === 'Paid' ? 'Processing...' : order.status === 'Shipped' ? 'In Transit! 🚀' : 'Delivered! 🏰'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .orders-list { max-width: 900px; margin: 0 auto; }
                .badge-success { color: var(--clr-mint); background: #f0fff4; border: 2px solid var(--clr-mint); }
                .badge-warning { color: var(--clr-orange); background: #fffaf0; border: 2px solid var(--clr-orange); }
            `}</style>
        </>
    );
}
