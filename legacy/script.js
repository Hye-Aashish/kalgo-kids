document.addEventListener('DOMContentLoaded', () => {
    // Select all background doodles and floating shapes
    const interactives = document.querySelectorAll('.doodle, .shape-blob-1, .shape-blob-2, .shape-blob-3, .accent-blob');
    
    // Mouse Parallax Effect for Background Elements
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // range from -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // range from -1 to 1
        
        interactives.forEach((el, index) => {
            // Apply different speeds and directions based on index to create depth
            const speed = (index % 5) * 10 + 10;
            const dirX = index % 2 === 0 ? 1 : -1;
            const dirY = index % 3 === 0 ? -1 : 1;
            
            // Note: we let CSS handle the continuous floating keyframes,
            // while we apply a dynamic translation via the translate property.
            // Using a custom property --mouseX and --mouseY inside CSS is an option, 
            // but for simplicity we'll just push the elements slightly.
            const moveX = x * speed * dirX;
            const moveY = y * speed * dirY;
            
            // To prevent overriding the CSS animations entirely, we apply it as a margin or left/top tweak
            // Wait, changing margin is expensive. Better approach is to wrap the elements, 
            // but just translating is fine for this demo.
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Intersection Observer for Scroll entry animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Keep the initial fade-in styles, but remove it from observer
                entry.target.style.opacity = '1';
                // Remove the start transform, letting CSS transitions take over
                entry.target.style.transform = entry.target.dataset.originalTransform || 'translateY(0)';
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial setup for animated elements
    const animatedElements = document.querySelectorAll('.collection-card, .glass-card, .review-bubble, .category-blob');
    
    animatedElements.forEach((el, index) => {
        // Store original transform if exists (like tilted classes)
        const computedStyle = window.getComputedStyle(el);
        if (computedStyle.transform !== 'none') {
            el.dataset.originalTransform = computedStyle.transform;
        }

        el.style.opacity = '0';
        // Give a slight staggered delay based on horizontal position or index if desired
        el.style.transition = `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.05}s`;
        
        // Push them down initially
        // If element already has a transform, we append a translateY. For simplicity:
        el.style.transform = 'translateY(50px)';
        animateObserver.observe(el);
    });
        
    // --- Simulated Admin Backend (LocalStorage) ---
    // Initialize Catalog
    const defaultCatalog = [
        { id: 1, title: "Well Done Bear Set", price: 45.00, image: "assets/well_done_set.jpg", isMultiply: false, category: "T-Shirts" },
        { id: 2, title: "Pink Flower Denim Set", price: 52.00, image: "assets/pink_flower_set.jpg", isMultiply: false, category: "Jeans" },
        { id: 3, title: "Geo Fun Sweater", price: 42.00, image: "assets/product_1.png", isMultiply: true, category: "Shirts" },
        { id: 4, title: "Rainbow Stompers", price: 55.00, image: "assets/product_2.png", isMultiply: true, category: "Shoes" },
        { id: 5, title: "Sunny Overalls", price: 48.00, image: "assets/product_3.png", isMultiply: true, category: "Pants" },
        { id: 6, title: "Starry Sky Denim", price: 65.00, image: "assets/prod_denim.png", isMultiply: true, category: "Outerwear" },
        { id: 7, title: "Puddle Jumpers", price: 35.00, image: "assets/prod_boots.png", isMultiply: true, category: "Shoes" },
        { id: 8, title: "Art Class Skirt", price: 38.00, image: "assets/prod_skirt.png", isMultiply: true, category: "Bottoms" }
    ];

    if (!localStorage.getItem('antigrav_catalog')) {
        localStorage.setItem('antigrav_catalog', JSON.stringify(defaultCatalog));
    }
    if (!localStorage.getItem('antigrav_orders')) {
        localStorage.setItem('antigrav_orders', JSON.stringify([]));
    }

    // --- Dynamic Product Rendering ---
    const productGrid = document.querySelector('.products-grid');
    if (productGrid) {
        // Only dynamically replace on the products page specifically to avoid over-complicating the homepage layout
        if (window.location.pathname.includes('products.html')) {
            const catalog = JSON.parse(localStorage.getItem('antigrav_catalog')) || [];
            let htmlOut = '';
            
            catalog.forEach((item, index) => {
                const tilts = ['tilted-right', 'tilted-left', ''];
                const tilt = tilts[index % 3];
                const blobs = ['blob-mint', 'blob-orange', 'blob-yellow'];
                const blob = blobs[index % 3];

                if (!item.isMultiply) {
                    htmlOut += `
                    <div class="real-photo-card ${tilt}">
                        <div class="real-photo-wrapper">
                            <img src="${item.image}" alt="${item.title}" onerror="this.src='assets/winter.png';">
                        </div>
                        <div class="prod-info">
                            <h4>${item.title}</h4>
                            <p class="price">$${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        <div class="action-btns">
                            <button class="add-to-cart-btn">Add to Cart</button>
                            <button class="btn-primary" style="background:var(--clr-orange); border:none; color:#fff;">Buy Now</button>
                        </div>
                    </div>`;
                } else {
                    htmlOut += `
                    <div class="product-card glass-card collage-border ${tilt}">
                        <div class="prod-img-box">
                            <div class="watercolor-blob ${blob}"></div>
                            <img src="${item.image}" alt="${item.title}" class="floating-product" onerror="this.style.display='none';">
                        </div>
                        <div class="prod-info">
                            <h4>${item.title}</h4>
                            <p class="price">$${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        <div class="action-btns">
                            <button class="add-to-cart-btn">Add to Cart</button>
                            <button class="btn-primary" style="background:var(--clr-orange); border:none; color:#fff;">Buy Now</button>
                        </div>
                    </div>`;
                }
            });
            productGrid.innerHTML = htmlOut;
        }
    }

    // --- E-Commerce Cart Logic (LocalStorage) ---
    function updateCartBadges() {
        let cart = JSON.parse(localStorage.getItem('antigrav_cart')) || [];
        const count = cart.reduce((total, item) => total + item.qty, 0);
        document.querySelectorAll('.cart-counter').forEach(counter => {
            counter.innerText = `Cart (${count})`;
        });
    }

    updateCartBadges();

    // Event Delegation for dynamically rendered Add To Cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            e.preventDefault();
            const btn = e.target;
            
            let cart = JSON.parse(localStorage.getItem('antigrav_cart')) || [];
            
            const card = btn.closest('.product-card, .real-photo-card');
            if(!card) return;
            
            const title = card.querySelector('h4').innerText;
            const rawPrice = card.querySelector('.price').innerText.split('\n').pop().trim().split(' ').pop().replace('$', ''); 
            const price = parseFloat(rawPrice) || 0;
            
            const imgEl = card.querySelector('img');
            const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
            const isMultiply = card.classList.contains('glass-card') ? true : false;
            
            const existingItem = cart.find(i => i.title === title);
            if(existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ title, price, image: imgSrc, qty: 1, isMultiply });
            }
            
            localStorage.setItem('antigrav_cart', JSON.stringify(cart));
            updateCartBadges();
            
            document.querySelectorAll('.cart-counter').forEach(counter => {
                counter.style.transform = 'scale(1.15)';
                setTimeout(() => counter.style.transform = 'scale(1)', 200);
            });

            const originalText = btn.innerText;
            btn.innerText = "Added! ✓";
            btn.style.background = "var(--clr-mint)";
            btn.style.color = "var(--clr-blue)";
            btn.style.borderColor = "var(--clr-mint)";
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
                btn.style.color = "var(--clr-blue)";
                btn.style.borderColor = "var(--clr-blue)";
            }, 1200);
        }
    });

});
