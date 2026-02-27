'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import type { Skill } from '../three/SkillsModel';

const SkillsModel = dynamic(() => import('../three/SkillsModel'), { ssr: false });

export default function SkillsHub() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const gsapRef = useRef<typeof import('gsap').gsap | null>(null);
    const entranceTriggersRef = useRef<unknown[]>([]);

    // Section entrance — runs once
    useEffect(() => {
        const loadGsap = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);
            gsapRef.current = gsap;

            if (sectionRef.current) {
                const st = gsap.fromTo(
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
                entranceTriggersRef.current.push(st);
            }
        };

        loadGsap();

        return () => {
            entranceTriggersRef.current.forEach((st: unknown) => {
                if (st && typeof st === 'object' && 'scrollTrigger' in (st as Record<string, unknown>)) {
                    ((st as Record<string, unknown>).scrollTrigger as { kill: () => void })?.kill();
                }
            });
        };
    }, []);

    // Panel animation — runs on skill change
    useEffect(() => {
        const gsap = gsapRef.current;
        if (!gsap || !panelRef.current) return;

        if (selectedSkill) {
            gsap.fromTo(
                panelRef.current,
                { x: 40, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, [selectedSkill]);

    const handleSelectSkill = useCallback((skill: Skill | null) => {
        setSelectedSkill(skill);
    }, []);

    return (
        <section
            ref={sectionRef}
            id="skills"
            style={{
                padding: 'clamp(2rem, 4vh, 4rem) clamp(1.5rem, 5vw, 6rem)',
                position: 'relative',
                opacity: 0,
            }}
        >
            <div className="section-number">03 — Expertise</div>
            <h2 style={{ marginBottom: '0.5rem' }}>
                The <span className="accent-text">3D</span> Hub
            </h2>
            <p className="text-body-lg" style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
                Click on the orbiting nodes to explore deep-dive proficiency data.
            </p>

            {/* Split layout: Globe left, Details right */}
            <div
                style={{
                    display: 'flex',
                    gap: '0',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    height: 'clamp(400px, 55vh, 600px)',
                }}
            >
                {/* Left half — 3D Globe */}
                <div
                    data-cursor-expand
                    style={{
                        flex: 1,
                        position: 'relative',
                        minWidth: 0,
                    }}
                >
                    <Canvas
                        camera={{ position: [0, 0, 4.5], fov: 60 }}
                        dpr={[1, 2]}
                        gl={{ antialias: true, alpha: true }}
                        style={{ background: 'var(--background)', width: '100%', height: '100%' }}
                    >
                        <SkillsModel onSelectSkill={handleSelectSkill} selectedSkill={selectedSkill} />
                    </Canvas>
                </div>

                {/* Right half — Skill details */}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderLeft: '1px solid var(--border)',
                        background: 'rgba(10, 10, 10, 0.6)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {selectedSkill ? (
                        <div
                            ref={panelRef}
                            style={{
                                padding: 'clamp(1.5rem, 3vw, 3rem)',
                                maxWidth: '450px',
                            }}
                        >
                            <h3
                                className="accent-text"
                                style={{
                                    fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                                    marginBottom: '1rem',
                                    fontWeight: 700,
                                }}
                            >
                                {selectedSkill.name}
                            </h3>
                            <p
                                style={{
                                    fontSize: 'clamp(0.85rem, 1vw, 1rem)',
                                    marginBottom: '2rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.7,
                                }}
                            >
                                {selectedSkill.description}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {selectedSkill.stats.map((stat, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            fontSize: 'clamp(0.8rem, 1vw, 0.95rem)',
                                            color: 'var(--foreground)',
                                            padding: '0.5rem 0',
                                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: 'var(--accent)',
                                                flexShrink: 0,
                                                boxShadow: '0 0 8px var(--accent)',
                                            }}
                                        />
                                        {stat}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '2rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    fontSize: '1.5rem',
                                }}
                            >
                                ←
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                                Select a skill node to view details
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
