import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import { useShop } from '../context/ShopContext';

export default function Home() {
    const { settings, catalog, collections, homeSections } = useShop();


    useEffect(() => {
        const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
        const animateObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = entry.target.dataset.originalTransform || 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.collection-card, .glass-card, .review-bubble, .category-blob');
        animatedElements.forEach((el, index) => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.transform !== 'none' && !el.dataset.originalTransform) {
                el.dataset.originalTransform = computedStyle.transform;
            }
            el.style.opacity = '0';
            el.style.transition = `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.05}s`;
            el.style.transform = 'translateY(50px)';
            animateObserver.observe(el);
        });

        return () => animateObserver.disconnect();
    }, []);

    // Get best sellers (first 3)
    const bestSellers = catalog.slice(0, 3);

    return (
        <>
            <BackgroundElements />
            <Header />

            <section className="hero-section">
                <div className="hero-content">
                    <p className="handwritten-tag floating-slow">{settings.heroSubtitle}</p>
                    <h1 className="hero-title styled-type">
                        {settings.heroTitle.split(',').map((part, i) => (
                            <React.Fragment key={i}>
                                {i === 0 ? <span className="text-stroke">{part}</span> : <span className="marker-highlight">{part}</span>}
                                {i === 0 && <br />}
                            </React.Fragment>
                        ))}
                    </h1>
                    <p className="hero-subtitle">{settings.heroDescription}</p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-pill btn-primary btn-large floating-fast scribble-shadow">Shop Collection</Link>
                    </div>
                    <div className="scribble scribble-star scribble-pos-1 floating-slow"></div>
                </div>

                <div className="hero-mixed-media">
                    <img src={settings.heroImage || "assets/hero_kids.png"} alt="Real kids jumping" className="hero-real-cutout" />
                    <div className="scribble scribble-cloud floating-fast scribble-pos-2"></div>
                </div>
            </section>

            <section id="collections" className="featured-collections">
                <h2 className="section-title text-center styled-type">A <span className="marker-highlight text-mint">Storybook</span> Season</h2>
                <div className="collections-grid">
                    {collections.map((coll, idx) => (
                        <Link 
                            to="/products" 
                            state={{ initialCollection: coll.title }} 
                            key={coll._id} 
                            style={{ textDecoration: 'none', display: 'block' }}
                        >
                            <div className={`polaroid-card ${idx % 3 === 0 ? 'tilted-left' : idx % 3 === 1 ? 'titled-card' : 'tilted-right'} floating-slow`}>
                                <div className="masking-tape tape-1"></div>
                                <div className="card-img-wrapper">
                                    <img src={coll.image} alt={coll.title} className="photo-real" />
                                    <img src={coll.illust || coll.image} alt="Illustration overlay" className="photo-illust-overlay" />
                                </div>
                                <div className="card-content handwritten-style">
                                    <h3 className="polaroid-caption">{coll.title}</h3>
                                </div>
                                {idx % 2 === 0 && <div className="scribble scribble-burst floating-fast"></div>}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>


            {homeSections.map((sec, secIdx) => {
                const secProducts = catalog.filter(p => sec.productIds?.includes(p._id));
                if (secProducts.length === 0) return null;

                return (
                    <section key={sec._id} className="best-sellers" style={{ marginTop: secIdx === 0 ? '0' : '8rem' }}>
                        <h2 className="section-title styled-type">
                            {sec.title.split(sec.highlight || '').map((part, i, arr) => (
                                <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && <span className="marker-highlight text-yellow">{sec.highlight}</span>}
                                </React.Fragment>
                            ))}
                        </h2>
                        <div className="products-grid">
                            {secProducts.map((item, idx) => (
                                <Link 
                                    to={`/product/${item._id}`} 
                                    key={item._id} 
                                    style={{ textDecoration: 'none', display: 'block' }}
                                >
                                    <div className={`product-card glass-card collage-border ${idx % 2 === 0 ? 'tilted-left' : 'tilted-right'}`}>
                                        <div className="prod-img-box">
                                            <div className={`watercolor-blob blob-${['mint', 'orange', 'yellow'][idx % 3]}`}></div>
                                            <img src={item.image} alt={item.title} className="floating-product" style={{ animationDelay: `${idx}s` }} />
                                            {idx === 0 && <span className="tag tag-sketch">New</span>}
                                        </div>
                                        <div className="prod-info">
                                            <h4>{item.title}</h4>
                                            <p className="price">{settings.currency}{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}

            <Footer />
        </>
    );
}

