import React, { useEffect, useState, useCallback } from 'react';

export default function Notification({ message, type, onClose }) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    const DURATION = 4000;

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => onClose(), 400);
    }, [onClose]);

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
            setProgress(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                handleClose();
            }
        }, 30);
        return () => clearInterval(interval);
    }, [handleClose]);

    const themes = {
        success: {
            icon: '✨',
            title: 'Magical!',
            accent: '#22c55e',
            shadow: 'rgba(34, 197, 94, 0.3)',
            bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '#86efac',
            bar: 'linear-gradient(90deg, #22c55e, #4ade80)'
        },
        error: {
            icon: '🚫',
            title: 'Oops!',
            accent: '#ef4444',
            shadow: 'rgba(239, 68, 68, 0.3)',
            bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '#fca5a5',
            bar: 'linear-gradient(90deg, #ef4444, #f87171)'
        },
        info: {
            icon: '💫',
            title: 'Hey!',
            accent: '#3b82f6',
            shadow: 'rgba(59, 130, 246, 0.3)',
            bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '#93c5fd',
            bar: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
        }
    };

    const t = themes[type] || themes.info;

    return (
        <>
            <style>{`
                @keyframes notifSlideIn {
                    0% { transform: translateX(120%); opacity: 0; }
                    60% { transform: translateX(-8px); opacity: 1; }
                    80% { transform: translateX(4px); }
                    100% { transform: translateX(0); }
                }
                @keyframes notifSlideOut {
                    0% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(120%); opacity: 0; }
                }
                @keyframes notifIconBounce {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.3); }
                    70% { transform: scale(0.85); }
                    100% { transform: scale(1); }
                }
                @keyframes notifShine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `}</style>
            <div style={{
                position: 'fixed',
                bottom: '100px',
                right: '30px',
                zIndex: 9999,
                animation: isExiting 
                    ? 'notifSlideOut 0.4s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards' 
                    : 'notifSlideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                pointerEvents: 'auto'
            }}>
                <div style={{
                    background: t.bg,
                    border: `3px solid ${t.border}`,
                    borderRadius: '24px',
                    padding: '1.2rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: `0 20px 60px ${t.shadow}, 0 8px 20px rgba(0,0,0,0.08)`,
                    minWidth: '340px',
                    maxWidth: '420px',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)'
                }}>
                    {/* Shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: '-100%',
                        width: '60%', height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        animation: 'notifShine 1s ease-in-out 0.3s forwards',
                        pointerEvents: 'none'
                    }} />

                    {/* Icon */}
                    <div style={{
                        width: '48px', height: '48px',
                        borderRadius: '16px',
                        background: '#fff',
                        border: `2px solid ${t.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                        animation: 'notifIconBounce 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both',
                        boxShadow: `0 4px 12px ${t.shadow}`
                    }}>
                        {t.icon}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            margin: 0,
                            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            color: t.accent,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>{t.title}</p>
                        <p style={{
                            margin: '2px 0 0',
                            fontFamily: 'var(--font-body, "Outfit", sans-serif)',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: '#1e293b',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>{message}</p>
                    </div>

                    {/* Close */}
                    <button onClick={handleClose} style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.3rem',
                        color: '#94a3b8',
                        padding: '4px',
                        lineHeight: 1,
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        flexShrink: 0
                    }}
                    onMouseOver={e => e.target.style.color = t.accent}
                    onMouseOut={e => e.target.style.color = '#94a3b8'}
                    >×</button>

                    {/* Progress bar */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0, left: 0,
                        width: '100%', height: '4px',
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: '0 0 24px 24px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: t.bar,
                            borderRadius: '0 0 24px 24px',
                            transition: 'width 0.05s linear'
                        }} />
                    </div>
                </div>
            </div>
        </>
    );
}
