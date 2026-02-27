'use client';

import { useRef, useEffect } from 'react';

export default function Identity() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const triggers: { kill: () => void }[] = [];

        const loadGsap = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            // Section entrance — fade in + slide up
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
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
                if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
            }

            if (imageRef.current) {
                const tween = gsap.fromTo(
                    imageRef.current,
                    { y: 80, scale: 0.95 },
                    {
                        y: -80,
                        scale: 1,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
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

    return (
        <section
            ref={sectionRef}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(2rem, 5vw, 6rem) clamp(1.5rem, 5vw, 6rem)',
                overflow: 'hidden',
                opacity: 0,
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '600px',
                    aspectRatio: '3/4',
                }}
            >
                {/* Thin border frame */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-1rem',
                        border: '1px solid var(--border)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Image container with parallax */}
                <div
                    ref={imageRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* Gradient placeholder for headshot */}
                    <div
                        style={{
                            width: '100%',
                            height: '120%',
                            background: `
                linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0a0a0a 60%),
                radial-gradient(circle at 50% 40%, rgba(0, 255, 136, 0.08) 0%, transparent 60%)
              `,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Stylized avatar placeholder */}
                        <div
                            style={{
                                width: '200px',
                                height: '200px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dim) 100%)',
                                opacity: 0.15,
                                filter: 'blur(40px)',
                            }}
                        />
                    </div>
                </div>

                {/* Minimal name overlay */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-2.5rem',
                        left: 0,
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                    }}
                >
                    Adarsh — Mumbai, India
                </div>
            </div>
        </section>
    );
}
