import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

export default function Products() {
    const { catalog, settings, categories, collections } = useShop();
    const [filter, setFilter] = useState('All Products');
    const [activeCollection, setActiveCollection] = useState('All Collections');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.initialCollection) {
            setActiveCollection(location.state.initialCollection);
            // Clear state so refresh doesn't keep the filter if unwanted
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    
    // Original styles from products.html
    const styles = `
        .filter-btn-active { box-shadow: 4px 4px 0 var(--clr-orange); background: var(--clr-blue); color: white; font-weight: 700; }
        .search-container { position: relative; max-width: 500px; margin: 3rem auto 0; }
        .search-input { width: 100%; padding: 1.2rem 1.5rem 1.2rem 3.5rem; border: 3px solid var(--clr-blue); border-radius: 40px; font-family: var(--font-heading); font-size: 1.2rem; outline: none; box-shadow: 6px 6px 0 var(--clr-sky); font-weight: 800; color: var(--clr-blue); }
        .search-icon { position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); font-size: 1.5rem; }
        .filter-btn { background: rgba(255, 255, 255, 0.8); border: 2px solid var(--clr-blue); color: var(--clr-blue); }
        .filter-btn:hover { background: var(--clr-blue); color: white; transform: translateY(-2px); box-shadow: 4px 4px 0 var(--clr-orange); }
        .real-photo-card { background: #fff; padding: 1.5rem; box-shadow: 8px 8px 0 var(--clr-blue); border: 3px solid var(--clr-orange); border-radius: 20px; transition: transform 0.3s; position: relative; }
        .real-photo-card:hover { transform: translateY(-10px); box-shadow: 12px 12px 0 var(--clr-blue); }
        .real-photo-wrapper { width: 100%; height: 320px; border-radius: 12px; overflow: hidden; margin-bottom: 2rem; border: 2px solid #eee; background: #fafafa; position: relative; display: flex; align-items: center; justify-content: center; }
        .real-photo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .action-btns { display: flex; gap: 10px; margin-top: 1.5rem; }
        .action-btns button { flex: 1; border-radius: 30px; font-family: var(--font-heading); font-weight: 800; padding: 0.8rem 5px; cursor: pointer; font-size: 1rem; transition: 0.3s; }
        .add-to-cart-btn { border: 2px solid var(--clr-blue); color: var(--clr-blue); background: #fff; }
        .add-to-cart-btn:hover { background: var(--clr-sky); }
    `;

    const allFilters = ['All Products', ...categories];

    const filteredCatalog = catalog.filter(item => {
        const matchesCollection = activeCollection === 'All Collections' || item.collection === activeCollection;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCollection && matchesSearch;
    });

    return (
        <>
            <style>{styles}</style>
            <BackgroundElements showExtra={true} extraProps={{ blob1: { background: 'var(--clr-mint)', opacity: 0.1 }, blob2: { background: 'var(--clr-yellow)', opacity: 0.1 }, hideBlob3: true, bgOpacity: 0.05 }} />
            <Header />

            <section className="plp-header" style={{ paddingTop: '4rem', paddingBottom: '2rem', textAlign: 'center' }}>
                <h1 className="hero-title styled-type text-stroke" style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
                    Shop The <span className="marker-highlight" style={{ WebkitTextStroke: 0 }}>Magic</span>
                </h1>
                <p className="handwritten-style" style={{ fontSize: '1.8rem', color: 'var(--clr-blue)', maxWidth: '600px', margin: '0 auto' }}>
                    {settings.heroSubtitle}
                </p>

                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="collection-filters" style={{ marginTop: '2.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['All Collections', ...collections.map(c => c.title)].map(c => (
                        <button 
                            key={c} 
                            onClick={() => setActiveCollection(c)} 
                            className={`btn btn-pill ${activeCollection === c ? 'filter-btn-active' : 'filter-btn'}`}
                            style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </section>

            <section className="products-grid-full" style={{ paddingTop: '2rem' }}>
                <div className="products-grid">
                    {filteredCatalog.map((item, index) => (
                        <ProductCard key={item.id || index} product={item} index={index} />
                    ))}
                    {filteredCatalog.length === 0 && (
                        <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', fontFamily: 'var(--font-heading)', color: 'var(--clr-blue)'}}>
                            <h2>No products found in this category!</h2>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}

