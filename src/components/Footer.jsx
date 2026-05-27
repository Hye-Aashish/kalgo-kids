import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Footer({ style }) {
    const { settings } = useShop();

    return (
        <footer className="torn-paper-footer" style={style}>
            <div className="paper-tear-top"></div>
            <div className="footer-grid">
                <div className="footer-brand">
                    <h3 className="logo-text" style={{ color: '#fff' }}>{settings.brandName || "KALGO Kids"}</h3>
                    <p className="handwritten-tag" style={{ color: '#fff', fontSize: '1.8rem', transform: 'none' }}>
                        {settings.footerTagline || "A blend of reality & imagination."}
                    </p>
                    <div className="social-icons" style={{ marginTop: '2rem' }}>
                        {settings.socialLinks?.instagram && (
                            <a href={`https://instagram.com/${settings.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="social-btn sketch-btn">Ig</a>
                        )}
                        {settings.socialLinks?.twitter && (
                            <a href={`https://twitter.com/${settings.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="social-btn sketch-btn">Tw</a>
                        )}
                    </div>
                </div>

                {console.log("Footer Settings:", settings)}
                {settings.footerSections && settings.footerSections.length > 0 ? (
                    settings.footerSections.map((section, idx) => (
                        <div className="footer-links" key={idx}>
                            <h4 style={{ color: '#fff', fontSize: '1.4rem', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                                {section.title || "Section"}
                            </h4>
                            
                            {section.type === 'links' && section.links && (
                                <ul>
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}><Link to={link.url || '#'}>{link.label || 'Link'}</Link></li>
                                    ))}
                                </ul>
                            )}

                            {section.type === 'text' && (
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6', fontWeight: 600 }}>
                                    {section.content}
                                </p>
                            )}

                            {section.type === 'socials' && (
                                <div className="social-icons">
                                    {settings.socialLinks?.instagram && (
                                        <a href={`https://instagram.com/${settings.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="social-btn sketch-btn">Ig</a>
                                    )}
                                    {settings.socialLinks?.twitter && (
                                        <a href={`https://twitter.com/${settings.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="social-btn sketch-btn">Tw</a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="footer-links">
                        <h4 style={{ color: '#fff' }}>Quick Links</h4>
                        <ul>
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="footer-bottom">
                <p>{settings.footerCopyright || "© 2026 KALGO Kids. Designed with illustrations."}</p>
            </div>
        </footer>
    );
}
