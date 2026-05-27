import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import { useShop } from '../context/ShopContext';

export default function About() {
    const { settings } = useShop();

    return (
        <>
            <BackgroundElements />
            <Header />
            
            <section className="about-page">
                <div className="about-hero">
                    <h1 className="hero-title styled-type text-stroke">Our <span className="marker-highlight text-mint">Story</span></h1>
                    <p className="handwritten-style" style={{ fontSize: '2rem', marginTop: '1rem' }}>Where Imagination Meets Adventure</p>
                </div>

                <div className="about-content grid-2">
                    <div className="about-image-stack">
                        <div className="polaroid-card tilted-right floating-slow">
                            <div className="masking-tape tape-1"></div>
                            <img src="https://images.unsplash.com/photo-1519706824991-89a385e05423?q=80&w=1000&auto=format&fit=crop" alt="Kids playing" className="photo-real" />
                        </div>
                    </div>
                    <div className="about-text glass-card">
                        <h2 className="handwritten-style" style={{ fontSize: '2.5rem', color: 'var(--clr-orange)' }}>Welcome to {settings.brandName}!</h2>
                        <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            We believe that childhood is the most magical adventure of all. Our brand was born from a simple doodle on a napkin—a dream to create clothes that feel like a warm hug and look like a splash of paint on a sunny day.
                        </p>
                        <p style={{ marginTop: '1rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            Every piece in our collection is designed with "Mini Explorers" in mind. We use the softest sustainable fabrics, vibrant colors, and whimsical patterns that encourage kids to climb, jump, and dream big.
                        </p>
                        <div className="scribble scribble-star floating-fast" style={{ position: 'relative', marginTop: '2rem' }}></div>
                    </div>
                </div>

                <div className="values-section" style={{ marginTop: '6rem' }}>
                    <h2 className="section-title styled-type text-center">What We <span className="marker-highlight text-yellow">Believe</span> In</h2>
                    <div className="values-grid">
                        <div className="value-card polaroid-card tilted-left">
                            <h3 className="handwritten-style">Comfort First</h3>
                            <p>Soft seams and stretchy fabrics for non-stop play.</p>
                        </div>
                        <div className="value-card polaroid-card">
                            <h3 className="handwritten-style">Pure Wonder</h3>
                            <p>Designs that spark curiosity and celebrate creativity.</p>
                        </div>
                        <div className="value-card polaroid-card tilted-right">
                            <h3 className="handwritten-style">Kind Planet</h3>
                            <p>Better choices for the world our children will inherit.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .about-hero { text-align: center; margin-bottom: 5rem; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: center; }
                .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 2rem; }
                .value-card p { margin-top: 1rem; font-family: var(--font-body); font-weight: 600; }
                
                @media (max-width: 900px) {
                    .grid-2 { grid-template-columns: 1fr; }
                    .about-image-stack { order: -1; display: flex; justify-content: center; }
                    .values-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </>
    );
}
