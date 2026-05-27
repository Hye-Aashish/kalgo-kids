import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import { useShop } from '../context/ShopContext';

export default function Contact() {
    const { settings, addMessage, showNotify } = useShop();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name.trim().length < 2) {
            showNotify('Please enter your name!', 'error');
            return;
        }
        if (!formData.email.includes('@')) {
            showNotify('Please enter a valid email!', 'error');
            return;
        }
        if (formData.message.trim().length < 5) {
            showNotify('Message must be at least 5 characters!', 'error');
            return;
        }

        setIsSending(true);
        await new Promise(r => setTimeout(r, 600));
        await addMessage(formData);
        setFormData({ name: '', email: '', message: '' });
        setIsSending(false);
    };

    return (
        <>
            <BackgroundElements />
            <Header />
            
            <section className="contact-page">
                <div className="contact-header text-center">
                    <h1 className="hero-title styled-type">Say <span className="marker-highlight text-orange">Hello!</span></h1>
                    <p className="handwritten-style" style={{ fontSize: '1.5rem' }}>We'd love to hear from our mini explorers and their families.</p>
                </div>

                <div className="contact-grid" style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
                    <div className="contact-form-side glass-card collage-border" style={{ padding: '3rem' }}>
                        <h2 className="handwritten-style" style={{ marginBottom: '2rem', fontSize: '2rem' }}>Send a Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <input 
                                type="text" placeholder="Your Name" required 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="email" placeholder="Email Address" required 
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                            <textarea 
                                placeholder="What's on your mind?" rows="6" required
                                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                            <button type="submit" className="btn btn-pill btn-primary btn-large scribble-shadow w-full" disabled={isSending}>
                                {isSending ? 'Sending...' : 'Send Magic Mail ✉️'}
                            </button>
                        </form>
                    </div>

                    <div className="contact-info-side">
                        <div className="polaroid-card titled-card floating-slow" style={{ padding: '2rem 2rem 3rem' }}>
                            <div className="masking-tape tape-2"></div>
                            <h3 className="handwritten-style" style={{ fontSize: '1.8rem', color: 'var(--clr-blue)' }}>Reach Out</h3>
                            <div className="info-list" style={{ marginTop: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                                <div className="info-item" style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ color: 'var(--clr-orange)', fontSize: '0.9rem' }}>EMAIL US</p>
                                    <p style={{ fontSize: '1.2rem' }}>{settings.contactEmail}</p>
                                </div>
                                <div className="info-item" style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ color: 'var(--clr-orange)', fontSize: '0.9rem' }}>FOLLOW THE ADVENTURE</p>
                                    <p style={{ fontSize: '1.2rem' }}>@{settings.socialLinks.instagram}</p>
                                </div>
                            </div>
                            <div className="scribble scribble-burst floating-fast" style={{ position: 'relative', marginTop: '1rem' }}></div>
                        </div>

                        <div className="scribble scribble-cloud floating-slow" style={{ position: 'relative', marginTop: '3rem', marginLeft: 'auto', width: '150px', height: '100px' }}></div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                .contact-form input, .contact-form textarea {
                    width: 100%;
                    padding: 1.2rem;
                    border: 2px solid var(--clr-blue);
                    border-radius: 15px;
                    margin-bottom: 1.5rem;
                    font-family: var(--font-body);
                    font-weight: 600;
                    background: rgba(255,255,255,0.7);
                    outline: none;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                .contact-form input:focus, .contact-form textarea:focus {
                    border-color: var(--clr-orange);
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.1);
                }
                .w-full { width: 100%; }
                
                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                    .contact-info-side { order: -1; }
                }
            `}</style>
        </>
    );
}
