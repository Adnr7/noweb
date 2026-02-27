'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';

const ParticleField = dynamic(() => import('../three/ParticleField'), { ssr: false });


export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const warpRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        let tl: ReturnType<typeof import('gsap').gsap.timeline> | undefined;
        let st: { kill: () => void } | undefined;

        const loadGsap = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            // Entrance animation
            tl = gsap.timeline({ delay: 3.2 });

            tl.fromTo(
                titleRef.current,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
            ).fromTo(
                subtitleRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                '-=0.6'
            );

            // Black hole warp on scroll — everything gets sucked into center
            if (warpRef.current && sectionRef.current) {
                const warpTween = gsap.to(warpRef.current, {
                    scale: 0,
                    rotation: 15,
                    opacity: 0,
                    ease: 'power2.in',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.8,
                    },
                });
                st = warpTween.scrollTrigger as { kill: () => void } | undefined;
            }
        };

        loadGsap();

        return () => {
            tl?.kill();
            st?.kill();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {/* Warp container — everything inside gets sucked into the black hole on scroll */}
            <div
                ref={warpRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    willChange: 'transform, opacity',
                }}
            >
                {/* WebGL Canvas */}
                <div className="canvas-container" data-cursor-expand>
                    <Canvas
                        camera={{ position: [0, 0, 6], fov: 60 }}
                        dpr={[1, 2]}
                        gl={{ antialias: true, alpha: true }}
                        style={{ background: 'transparent' }}
                        frameloop="always"
                    >
                        <ParticleField />
                    </Canvas>
                </div>


                {/* Text overlay */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'left',
                        pointerEvents: 'none',
                        width: '100%',
                        padding: '0 clamp(2rem, 8vw, 8rem)',
                    }}
                >
                    <h1
                        ref={titleRef}
                        style={{
                            opacity: 0,
                            marginBottom: '1.5rem',
                        }}
                    >
                        Software
                        <br />
                        <span className="accent-text">Engineer</span>
                    </h1>
                    <p
                        ref={subtitleRef}
                        style={{
                            opacity: 0,
                            fontSize: 'clamp(0.75rem, 1vw, 1rem)',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        Building the future, one system at a time
                    </p>
                </div>

                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <span>Scroll</span>
                    <div className="scroll-line" />
                </div>
            </div>

            {/* Bottom fade — smooth transition to next section */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '200px',
                    background: 'linear-gradient(to bottom, transparent 0%, var(--background) 100%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />
        </section>
    );
}
