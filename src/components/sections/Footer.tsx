'use client';

import { useRef, useEffect, useState } from 'react';

export default function Footer() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const triggers: { kill: () => void }[] = [];

        const loadGsap = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            // Section entrance
            if (sectionRef.current) {
                const tween = gsap.fromTo(
                    sectionRef.current,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
                if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
            }

            if (headingRef.current) {
                const tween = gsap.fromTo(
                    headingRef.current,
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
                if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
            }
        };

        loadGsap();

        return () => {
            triggers.forEach((st) => st.kill());
        };
    }, []);

    const socialLinks = [
        {
            label: 'GitHub',
            href: '#',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
            ),
        },
        {
            label: 'LinkedIn',
            href: '#',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        {
            label: 'Email',
            href: 'mailto:hello@noweb.site',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13L2 4" />
                </svg>
            ),
        },
    ];

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="section-padding"
            style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                opacity: 0,
            }}
        >
            <div style={{ maxWidth: '800px' }}>
                <div className="section-number">05 — Contact</div>
                <div className="thin-rule" style={{ marginBottom: '3rem' }} />

                <h2
                    ref={headingRef}
                    style={{ marginBottom: '2rem' }}
                >
                    Let&apos;s <span className="accent-text">Connect</span>
                </h2>

                <p
                    className="text-body-lg"
                    style={{ maxWidth: '500px', marginBottom: '3rem' }}
                >
                    Have a project in mind or just want to chat about technology?
                    I&apos;m always open to exploring new ideas and collaborations.
                </p>

                {/* Social links */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        marginBottom: '4rem',
                    }}
                >
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${link.label} (opens in a new tab)`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>

                <div className="thin-rule" style={{ marginBottom: '2rem' }} />

                {/* Footer bottom */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                    }}
                >
                    <span
                        style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            letterSpacing: '0.1em',
                        }}
                    >
                        © {new Date().getFullYear()} noweb.site — All rights reserved
                    </span>

                    {/* Audio toggle */}
                    <button
                        className="audio-toggle"
                        aria-label="Toggle ambient audio"
                        onClick={() => setIsPlaying((prev) => !prev)}
                    >
                        <div className={`audio-bars${isPlaying ? ' playing' : ''}`}>
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        Sound
                    </button>
                </div>
            </div>
        </section>
    );
}
