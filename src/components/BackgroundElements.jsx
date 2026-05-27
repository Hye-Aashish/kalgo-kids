import React, { useEffect } from 'react';

export default function BackgroundElements({ showExtra = false, extraProps = {} }) {
    useEffect(() => {
        const interactives = document.querySelectorAll('.doodle, .shape-blob-1, .shape-blob-2, .shape-blob-3, .accent-blob');
        
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            interactives.forEach((el, index) => {
                const speed = (index % 5) * 10 + 10;
                const dirX = index % 2 === 0 ? 1 : -1;
                const dirY = index % 3 === 0 ? -1 : 1;
                const moveX = x * speed * dirX;
                const moveY = y * speed * dirY;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <div className="paper-texture"></div>
            <div className="bg-elements" aria-hidden="true">
                {showExtra ? (
                    <>
                        {extraProps.blob1 && <div className="shape shape-blob-1" style={extraProps.blob1}></div>}
                        {extraProps.blob2 && <div className="shape shape-blob-2" style={extraProps.blob2}></div>}
                        {!extraProps.hideBlob3 && <div className="shape shape-blob-3"></div>}
                    </>
                ) : (
                    <>
                        <div className="shape shape-blob-1"></div>
                        <div className="shape shape-blob-2"></div>
                        <div className="shape shape-blob-3"></div>
                    </>
                )}
                <div className="doodle-bg" style={{ backgroundImage: "url('assets/illust_doodles.png')", opacity: extraProps.bgOpacity || 0.07, mixBlendMode: 'multiply' }}></div>
            </div>
        </>
    );
}
