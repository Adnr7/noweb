'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Expertise', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLAnchorElement[]>([]);
    const hamburgerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Animate links in
            gsap.fromTo(
                linksRef.current,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'power3.out',
                    delay: 0.3,
                }
            );

            // Focus first link after animation
            setTimeout(() => {
                linksRef.current[0]?.focus();
            }, 400);
        }
    }, [isOpen]);

    // Focus trap when overlay is open
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                setIsOpen(false);
                hamburgerRef.current?.focus();
                return;
            }

            if (e.key === 'Tab') {
                const focusable = [
                    hamburgerRef.current,
                    ...linksRef.current,
                ].filter(Boolean) as HTMLElement[];

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        [isOpen]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        // Smooth scroll after overlay closes
        setTimeout(() => {
            const el = document.querySelector(href);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }, 600);
    };

    return (
        <>
            {/* Header bar */}
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10002,
                    padding: '1.5rem clamp(1.5rem, 5vw, 4rem)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mixBlendMode: 'difference',
                }}
            >
                <a
                    href="#hero"
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--foreground)',
                        textDecoration: 'none',
                        letterSpacing: '-0.02em',
                    }}
                >
                    noweb<span style={{ color: 'var(--accent)' }}>.</span>
                </a>

                <button
                    ref={hamburgerRef}
                    className={`hamburger ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </header>

            {/* Overlay */}
            <div
                ref={overlayRef}
                className={`nav-overlay ${isOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal={isOpen}
                aria-label="Navigation menu"
            >
                <nav
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    {navItems.map((item, i) => (
                        <a
                            key={item.label}
                            ref={(el) => {
                                if (el) linksRef.current[i] = el;
                            }}
                            href={item.href}
                            className="nav-link"
                            style={{ opacity: isOpen ? undefined : 0 }}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(item.href);
                            }}
                        >
                            <span style={{ color: 'var(--accent)', fontSize: '0.5em', marginRight: '1rem' }}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        </>
    );
}
