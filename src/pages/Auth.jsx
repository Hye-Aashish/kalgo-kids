import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';

export default function Auth() {
    const { login, register, user, showNotify } = useShop();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.from || '/profile';

    useEffect(() => {
        if (user) navigate(redirectPath);
    }, [user, navigate, redirectPath]);

    const validate = () => {
        if (!isLogin && formData.name.trim().length < 2) {
            showNotify('Name must be at least 2 characters!', 'error');
            return false;
        }
        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            showNotify('Please enter a valid email address!', 'error');
            return false;
        }
        if (formData.password.length < 4) {
            showNotify('Magic word must be at least 4 characters!', 'error');
            return false;
        }
        if (!isLogin && formData.password !== formData.confirmPassword) {
            showNotify('Magic words do not match!', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        
        try {
            let success = false;
            if (isLogin) {
                success = await login(formData.email, formData.password);
                if (success) showNotify('Welcome back explorer! ✨', 'success');
            } else {
                success = await register(formData.name, formData.email, formData.password);
                if (success) showNotify('Your magic account is ready! 🎈', 'success');
            }
            
            if (success) {
                setTimeout(() => navigate(redirectPath), 500);
            }
        } catch (err) {
            showNotify('Oops! Something went wrong.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <BackgroundElements />
            <Header />
            
            <section className="auth-page">
                <div className="auth-wrapper">
                    <div className="auth-brand">
                        <div className="polaroid-card floating-slow" style={{ padding: '2rem', maxWidth: '350px' }}>
                            <div className="masking-tape tape-2"></div>
                            <h2 className="styled-type" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                                {isLogin ? 'Welcome\nBack!' : 'Join Our\nMagic World'}
                            </h2>
                            <p className="handwritten-style" style={{ fontSize: '1.3rem', color: 'var(--clr-blue)', lineHeight: 1.5 }}>
                                {isLogin 
                                    ? 'Enter your secret magic word and continue your amazing adventure with us!' 
                                    : 'Create your storybook account and get access to exclusive magical outfits!'}
                            </p>
                        </div>
                    </div>

                    <div className="auth-form-card glass-card collage-border">
                        <div className="form-header">
                            <div className="tab-switch">
                                <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => !isLogin && switchMode()}>Log In</button>
                                <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => isLogin && switchMode()}>Sign Up</button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="form-field">
                                    <label>Your Name</label>
                                    <div className="input-wrapper">
                                        <span className="field-icon">👤</span>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Brave Explorer" required />
                                    </div>
                                </div>
                            )}

                            <div className="form-field">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <span className="field-icon">📧</span>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="magic@portal.com" required />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <span className="field-icon">🔑</span>
                                    <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                                    <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="form-field">
                                    <label>Confirm Password</label>
                                    <div className="input-wrapper">
                                        <span className="field-icon">🔁</span>
                                        <input type={showPass ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                                {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p className="handwritten-style">
                                {isLogin ? "New explorer? " : "Already a citizen? "}
                                <button className="link-btn" onClick={switchMode}>{isLogin ? "Create Account" : "Log In"}</button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                .auth-page { min-height: 85vh; display: flex; align-items: center; justify-content: center; padding: 4rem 5%; }
                .auth-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 1000px; width: 100%; align-items: center; }
                .auth-brand { display: flex; justify-content: center; }
                .auth-form-card { padding: 2.5rem; position: relative; }
                .tab-switch { display: flex; background: var(--clr-sky); border-radius: 16px; padding: 4px; margin-bottom: 2rem; border: 2px solid var(--clr-blue); }
                .tab-btn { flex: 1; padding: 0.8rem; border: none; background: none; font-family: var(--font-heading); font-weight: 900; font-size: 1rem; color: var(--clr-blue); cursor: pointer; border-radius: 12px; transition: 0.3s; }
                .tab-btn.active { background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08); color: var(--clr-orange); }
                
                .form-field { margin-bottom: 1.2rem; }
                .form-field label { display: block; font-family: var(--font-heading); font-weight: 800; font-size: 0.9rem; color: var(--clr-blue); margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .field-icon { position: absolute; left: 14px; font-size: 1.1rem; z-index: 2; }
                .auth-form input { width: 100%; padding: 0.9rem 1rem 0.9rem 2.8rem; border: 3px solid #e2e8f0; border-radius: 16px; font-family: var(--font-body); font-weight: 700; font-size: 1rem; outline: none; background: #fff; color: var(--clr-blue); transition: 0.25s; }
                .auth-form input:focus { border-color: var(--clr-orange); box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.1); }
                .toggle-pass { position: absolute; right: 14px; background: none; border: none; cursor: pointer; font-size: 1.2rem; z-index: 2; padding: 4px; }

                .submit-btn { width: 100%; padding: 1rem; margin-top: 1.5rem; border: 4px solid var(--clr-blue); border-radius: 20px; background: var(--clr-orange); color: #fff; font-family: var(--font-heading); font-weight: 900; font-size: 1.15rem; cursor: pointer; transition: 0.3s; box-shadow: 6px 6px 0 var(--clr-blue); }
                .submit-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 8px 10px 0 var(--clr-blue); }
                .submit-btn.loading { background: #94a3b8; cursor: wait; box-shadow: 4px 4px 0 #64748b; }

                .auth-footer { text-align: center; margin-top: 1.5rem; }
                .link-btn { background: none; border: none; color: var(--clr-orange); font-weight: 900; font-family: var(--font-hand); font-size: 1.2rem; cursor: pointer; text-decoration: underline; }
                
                @media (max-width: 768px) {
                    .auth-wrapper { grid-template-columns: 1fr; }
                    .auth-brand { display: none; }
                }
            `}</style>
        </>
    );
}
