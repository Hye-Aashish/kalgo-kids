import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import { useShop } from '../context/ShopContext';

export default function Profile() {
    const { user, orders, settings, logout, showNotify, cart } = useShop();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    // If not logged in, redirect
    if (!user) {
        return (
            <>
                <BackgroundElements />
                <Header />
                <section className="profile-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card collage-border" style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px' }}>
                        <h2 className="styled-type" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Who are you? 🤔</h2>
                        <p className="handwritten-style" style={{ fontSize: '1.3rem', marginBottom: '2rem', color: 'var(--clr-blue)' }}>
                            Log in to see your magical profile!
                        </p>
                        <Link to="/login" className="btn btn-pill btn-primary btn-large scribble-shadow">
                            Log In 🏰
                        </Link>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalItems = orders.reduce((sum, o) => sum + (o.items || 0), 0);
    const memberSince = '2026';

    const handleEditSave = () => {
        if (isEditing) {
            showNotify('Profile updated! ✨', 'success');
            setIsEditing(false);
        } else {
            setEditName(user.name);
            setEditEmail(user.email);
            setIsEditing(true);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '🏠' },
        { id: 'orders', label: 'My Orders', icon: '📦' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <>
            <BackgroundElements />
            <Header />

            <section className="profile-page">
                {/* Profile Header Card */}
                <div className="profile-hero">
                    <div className="profile-hero-card polaroid-card">
                        <div className="masking-tape tape-1"></div>
                        <div className="profile-hero-content">
                            <div className="avatar-wrapper">
                                <div className="avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="avatar-ring"></div>
                            </div>
                            <div className="profile-info">
                                <h1 className="styled-type">{user.name}</h1>
                                <p className="handwritten-style profile-email">{user.email}</p>
                                <div className="profile-badges">
                                    <span className="profile-badge">✨ Explorer</span>
                                    <span className="profile-badge gold">👑 Since {memberSince}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="quick-stats">
                            <div className="stat-bubble">
                                <span className="stat-num">{orders.length}</span>
                                <span className="stat-label">Orders</span>
                            </div>
                            <div className="stat-bubble orange">
                                <span className="stat-num">{settings.currency}{totalSpent.toFixed(0)}</span>
                                <span className="stat-label">Spent</span>
                            </div>
                            <div className="stat-bubble mint">
                                <span className="stat-num">{totalItems}</span>
                                <span className="stat-label">Items</span>
                            </div>
                            <div className="stat-bubble yellow">
                                <span className="stat-num">{cart.length}</span>
                                <span className="stat-label">In Cart</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="profile-content">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="tab-panel">
                            <div className="overview-grid">
                                {/* Recent Orders */}
                                <div className="glass-card collage-border" style={{ padding: '2rem' }}>
                                    <h3 className="styled-type" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                                        Recent <span className="marker-highlight">Orders</span>
                                    </h3>
                                    {orders.length === 0 ? (
                                        <p className="handwritten-style" style={{ textAlign: 'center', padding: '2rem', color: 'var(--clr-blue)' }}>
                                            No orders yet! 🗺️
                                        </p>
                                    ) : (
                                        orders.slice(-3).reverse().map(order => (
                                            <div key={order.id} className="mini-order">
                                                <div>
                                                    <strong>#{order.id}</strong>
                                                    <span className="order-date">{order.date}</span>
                                                </div>
                                                <div className="mini-order-right">
                                                    <span className="order-amount">{settings.currency}{order.total.toFixed(2)}</span>
                                                    <span className={`mini-badge ${order.status === 'Paid' ? 'paid' : 'shipped'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <Link to="/orders" className="view-all-link">View All Orders →</Link>
                                </div>

                                {/* Quick Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <Link to="/products" className="quick-action-card" style={{ textDecoration: 'none' }}>
                                        <div className="qa-icon">🛍️</div>
                                        <div>
                                            <h4>Continue Shopping</h4>
                                            <p>Explore new products</p>
                                        </div>
                                    </Link>
                                    <Link to="/cart" className="quick-action-card" style={{ textDecoration: 'none' }}>
                                        <div className="qa-icon">🛒</div>
                                        <div>
                                            <h4>My Cart ({cart.length})</h4>
                                            <p>View your shopping cart</p>
                                        </div>
                                    </Link>
                                    <Link to="/contact" className="quick-action-card" style={{ textDecoration: 'none' }}>
                                        <div className="qa-icon">💬</div>
                                        <div>
                                            <h4>Need Help?</h4>
                                            <p>Send us a message</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="tab-panel">
                            <h3 className="styled-type" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                                All <span className="marker-highlight">Orders</span>
                            </h3>
                            {orders.length === 0 ? (
                                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                                    <p className="handwritten-style" style={{ fontSize: '1.5rem' }}>No orders yet... 📭</p>
                                    <Link to="/products" className="btn btn-pill btn-primary" style={{ marginTop: '1.5rem' }}>Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="orders-timeline">
                                    {[...orders].reverse().map((order, idx) => (
                                        <div key={order.id} className="timeline-item">
                                            <div className="timeline-dot"></div>
                                            <div className="timeline-card glass-card">
                                                <div className="timeline-header">
                                                    <div>
                                                        <h4 className="styled-type">Order #{order.id}</h4>
                                                        <p className="handwritten-style">{order.date}</p>
                                                    </div>
                                                    <span className={`mini-badge ${order.status === 'Paid' ? 'paid' : order.status === 'Shipped' ? 'shipped' : 'delivered'}`}>
                                                        {order.status === 'Paid' ? '💰 Paid' : order.status === 'Shipped' ? '🚀 Shipped' : '🏰 Delivered'}
                                                    </span>
                                                </div>
                                                <div className="timeline-details">
                                                    <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
                                                    <span className="timeline-total">{settings.currency}{order.total.toFixed(2)}</span>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="order-progress">
                                                    <div className={`progress-step done`}>
                                                        <div className="step-dot"></div>
                                                        <span>Ordered</span>
                                                    </div>
                                                    <div className={`progress-line ${order.status !== 'Paid' ? 'done' : ''}`}></div>
                                                    <div className={`progress-step ${order.status !== 'Paid' ? 'done' : ''}`}>
                                                        <div className="step-dot"></div>
                                                        <span>Shipped</span>
                                                    </div>
                                                    <div className={`progress-line ${order.status === 'Delivered' ? 'done' : ''}`}></div>
                                                    <div className={`progress-step ${order.status === 'Delivered' ? 'done' : ''}`}>
                                                        <div className="step-dot"></div>
                                                        <span>Delivered</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="tab-panel">
                            <h3 className="styled-type" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                                Account <span className="marker-highlight">Settings</span>
                            </h3>

                            <div className="settings-grid">
                                <div className="glass-card collage-border" style={{ padding: '2rem' }}>
                                    <h4 className="styled-type" style={{ marginBottom: '1.5rem' }}>Personal Info</h4>
                                    <div className="setting-field">
                                        <label>Name</label>
                                        {isEditing ? (
                                            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                                        ) : (
                                            <p>{user.name}</p>
                                        )}
                                    </div>
                                    <div className="setting-field">
                                        <label>Email</label>
                                        {isEditing ? (
                                            <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                        ) : (
                                            <p>{user.email}</p>
                                        )}
                                    </div>
                                    <button className="btn btn-pill btn-primary" onClick={handleEditSave} style={{ marginTop: '1rem' }}>
                                        {isEditing ? 'Save Changes ✨' : 'Edit Profile ✏️'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="glass-card" style={{ padding: '2rem' }}>
                                        <h4 className="styled-type" style={{ marginBottom: '1rem' }}>Preferences</h4>
                                        <div className="pref-item">
                                            <span>Email Notifications</span>
                                            <label className="toggle-switch">
                                                <input type="checkbox" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div className="pref-item">
                                            <span>Order Updates</span>
                                            <label className="toggle-switch">
                                                <input type="checkbox" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <div className="pref-item">
                                            <span>New Arrivals Alert</span>
                                            <label className="toggle-switch">
                                                <input type="checkbox" />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <button className="danger-btn" onClick={handleLogout}>
                                        🚪 Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <style>{`
                .profile-page { min-height: 85vh; padding-top: 3rem; }

                /* Hero */
                .profile-hero { max-width: 900px; margin: 0 auto 2rem; }
                .profile-hero-card { padding: 2.5rem; position: relative; }
                .profile-hero-content { display: flex; align-items: center; gap: 2rem; }
                .avatar-wrapper { position: relative; flex-shrink: 0; }
                .avatar {
                    width: 90px; height: 90px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--clr-orange), var(--clr-yellow));
                    color: #fff;
                    font-family: var(--font-heading);
                    font-size: 2.5rem;
                    font-weight: 900;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 4px solid #fff;
                    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
                }
                .avatar-ring {
                    position: absolute;
                    top: -4px; left: -4px;
                    width: calc(100% + 8px); height: calc(100% + 8px);
                    border-radius: 50%;
                    border: 3px dashed var(--clr-blue);
                    animation: spin 12s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .profile-info h1 { font-size: 2rem; margin-bottom: 0.2rem; }
                .profile-email { font-size: 1.2rem; color: var(--clr-blue); opacity: 0.7; }
                .profile-badges { display: flex; gap: 0.8rem; margin-top: 0.8rem; flex-wrap: wrap; }
                .profile-badge {
                    background: var(--clr-sky);
                    color: var(--clr-blue);
                    padding: 0.3rem 1rem;
                    border-radius: 20px;
                    font-weight: 800;
                    font-size: 0.8rem;
                    border: 2px solid var(--clr-blue);
                    font-family: var(--font-heading);
                }
                .profile-badge.gold { background: var(--clr-yellow); border-color: var(--clr-orange); }

                /* Quick Stats */
                .quick-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .stat-bubble {
                    background: var(--clr-sky);
                    border: 3px solid var(--clr-blue);
                    border-radius: 20px;
                    padding: 1rem;
                    text-align: center;
                    transition: transform 0.3s;
                }
                .stat-bubble:hover { transform: translateY(-4px); }
                .stat-bubble.orange { background: #fff3e8; border-color: var(--clr-orange); }
                .stat-bubble.mint { background: #e8fff4; border-color: var(--clr-mint); }
                .stat-bubble.yellow { background: #fffde8; border-color: var(--clr-yellow); }
                .stat-num { display: block; font-size: 1.6rem; font-weight: 900; color: var(--clr-blue); font-family: var(--font-heading); }
                .stat-label { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--clr-blue); opacity: 0.6; font-family: var(--font-heading); }

                /* Tabs */
                .profile-tabs {
                    display: flex;
                    gap: 0.5rem;
                    max-width: 900px;
                    margin: 0 auto 2rem;
                    background: #fff;
                    border: 3px solid var(--clr-blue);
                    border-radius: 20px;
                    padding: 6px;
                    box-shadow: 6px 6px 0 var(--clr-sky);
                }
                .profile-tab {
                    flex: 1;
                    padding: 0.8rem 1rem;
                    border: none;
                    background: none;
                    font-family: var(--font-heading);
                    font-weight: 800;
                    font-size: 1rem;
                    color: var(--clr-blue);
                    cursor: pointer;
                    border-radius: 16px;
                    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .profile-tab:hover { background: var(--clr-sky); }
                .profile-tab.active {
                    background: var(--clr-orange);
                    color: #fff;
                    box-shadow: 4px 4px 0 var(--clr-blue);
                }
                .tab-icon { font-size: 1.2rem; }

                /* Content */
                .profile-content { max-width: 900px; margin: 0 auto; }
                .tab-panel { animation: fadeUp 0.4s ease; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Overview Grid */
                .overview-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 2rem; }
                .mini-order {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 2px dashed #e2e8f0;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    color: var(--clr-blue);
                }
                .mini-order:last-of-type { border-bottom: none; }
                .order-date { margin-left: 0.8rem; font-size: 0.85rem; color: #94a3b8; }
                .mini-order-right { display: flex; align-items: center; gap: 1rem; }
                .order-amount { font-weight: 900; color: var(--clr-orange); }
                .mini-badge {
                    padding: 0.3rem 0.8rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    font-family: var(--font-heading);
                }
                .mini-badge.paid { background: #fffbeb; color: var(--clr-orange); border: 2px solid var(--clr-orange); }
                .mini-badge.shipped { background: #eff6ff; color: var(--clr-blue); border: 2px solid var(--clr-blue); }
                .mini-badge.delivered { background: #f0fdf4; color: #22c55e; border: 2px solid #22c55e; }
                .view-all-link {
                    display: block;
                    text-align: center;
                    margin-top: 1.5rem;
                    color: var(--clr-orange);
                    font-weight: 800;
                    font-family: var(--font-heading);
                    text-decoration: none;
                    transition: 0.2s;
                }
                .view-all-link:hover { color: var(--clr-blue); }

                /* Quick Action Cards */
                .quick-action-card {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    padding: 1.2rem 1.5rem;
                    background: #fff;
                    border: 3px solid #e2e8f0;
                    border-radius: 20px;
                    color: var(--clr-blue);
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .quick-action-card:hover {
                    border-color: var(--clr-orange);
                    box-shadow: 6px 6px 0 var(--clr-sky);
                    transform: translateY(-3px);
                }
                .qa-icon { font-size: 2rem; }
                .quick-action-card h4 { font-family: var(--font-heading); font-weight: 900; font-size: 1.1rem; }
                .quick-action-card p { font-size: 0.85rem; color: #94a3b8; font-weight: 600; margin-top: 2px; }

                /* Timeline */
                .orders-timeline { position: relative; padding-left: 2rem; }
                .orders-timeline::before {
                    content: '';
                    position: absolute;
                    left: 8px; top: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, var(--clr-orange), var(--clr-blue), var(--clr-mint));
                    border-radius: 3px;
                }
                .timeline-item { position: relative; margin-bottom: 2rem; }
                .timeline-dot {
                    position: absolute;
                    left: -2rem; top: 1.5rem;
                    width: 18px; height: 18px;
                    border-radius: 50%;
                    background: var(--clr-orange);
                    border: 3px solid #fff;
                    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4);
                    z-index: 2;
                }
                .timeline-card { padding: 1.5rem; }
                .timeline-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
                .timeline-header h4 { font-size: 1.2rem; }
                .timeline-details {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    color: var(--clr-blue);
                    padding: 0.8rem 0;
                    border-top: 2px dashed #e2e8f0;
                    margin-top: 0.5rem;
                }
                .timeline-total { font-weight: 900; color: var(--clr-orange); font-size: 1.2rem; }

                /* Order Progress */
                .order-progress {
                    display: flex;
                    align-items: center;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 2px dashed #e2e8f0;
                }
                .progress-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #cbd5e1;
                    font-family: var(--font-heading);
                }
                .progress-step.done { color: var(--clr-orange); }
                .step-dot {
                    width: 14px; height: 14px;
                    border-radius: 50%;
                    background: #e2e8f0;
                    border: 2px solid #cbd5e1;
                }
                .progress-step.done .step-dot {
                    background: var(--clr-orange);
                    border-color: var(--clr-orange);
                    box-shadow: 0 0 8px rgba(255, 107, 53, 0.4);
                }
                .progress-line {
                    flex: 1;
                    height: 3px;
                    background: #e2e8f0;
                    margin: 0 0.3rem;
                }
                .progress-line.done { background: var(--clr-orange); }

                /* Settings */
                .settings-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; }
                .setting-field { margin-bottom: 1.5rem; }
                .setting-field label {
                    display: block;
                    font-family: var(--font-heading);
                    font-weight: 900;
                    font-size: 0.85rem;
                    color: var(--clr-blue);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 0.4rem;
                }
                .setting-field p {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--clr-blue);
                    padding: 0.8rem 1rem;
                    background: #f8fafc;
                    border-radius: 14px;
                    border: 2px solid #e2e8f0;
                }
                .setting-field input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border: 3px solid var(--clr-blue);
                    border-radius: 14px;
                    font-family: var(--font-body);
                    font-weight: 700;
                    font-size: 1.05rem;
                    outline: none;
                    color: var(--clr-blue);
                    transition: 0.25s;
                }
                .setting-field input:focus { border-color: var(--clr-orange); box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.1); }

                .pref-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem 0;
                    border-bottom: 2px dashed #e2e8f0;
                    font-weight: 700;
                    color: var(--clr-blue);
                    font-family: var(--font-heading);
                }
                .pref-item:last-child { border-bottom: none; }

                /* Toggle Switch */
                .toggle-switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: #e2e8f0;
                    border-radius: 28px;
                    transition: 0.3s;
                }
                .toggle-slider::before {
                    content: '';
                    position: absolute;
                    height: 22px; width: 22px;
                    left: 3px; bottom: 3px;
                    background: #fff;
                    border-radius: 50%;
                    transition: 0.3s;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                .toggle-switch input:checked + .toggle-slider { background: var(--clr-orange); }
                .toggle-switch input:checked + .toggle-slider::before { transform: translateX(22px); }

                .danger-btn {
                    width: 100%;
                    padding: 1rem;
                    background: #fef2f2;
                    border: 3px solid #fca5a5;
                    border-radius: 20px;
                    color: #ef4444;
                    font-family: var(--font-heading);
                    font-weight: 900;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .danger-btn:hover { background: #fee2e2; box-shadow: 4px 4px 0 #fca5a5; transform: translateY(-2px); }

                @media (max-width: 768px) {
                    .profile-hero-content { flex-direction: column; text-align: center; }
                    .profile-badges { justify-content: center; }
                    .quick-stats { grid-template-columns: repeat(2, 1fr); }
                    .overview-grid { grid-template-columns: 1fr; }
                    .settings-grid { grid-template-columns: 1fr; }
                    .profile-tabs { overflow-x: auto; }
                    .profile-tab span:not(.tab-icon) { display: none; }
                    .profile-tab { padding: 0.8rem; }
                    .tab-icon { font-size: 1.5rem; }
                }
            `}</style>
        </>
    );
}
