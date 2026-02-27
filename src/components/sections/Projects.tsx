'use client';

import { useRef, useEffect } from 'react';

interface Project {
    title: string;
    category: string;
    description: string;
    color: string;
}

const projects: Project[] = [
    {
        title: 'Cloud Atlas',
        category: 'Cloud Infrastructure',
        description:
            'A distributed multi-cloud orchestration platform that seamlessly manages workloads across AWS, Azure, and GCP with intelligent auto-scaling and cost optimization.',
        color: '#00ff88',
    },
    {
        title: 'ChainForge',
        category: 'Blockchain / DeFi',
        description:
            'A decentralized finance protocol enabling cross-chain atomic swaps and liquidity aggregation, built with Solidity smart contracts and zero-knowledge proofs.',
        color: '#00ddff',
    },
    {
        title: 'NeuralScope',
        category: 'AI / Machine Learning',
        description:
            'An end-to-end MLOps platform for training, deploying, and monitoring production ML models with real-time drift detection and automated retraining pipelines.',
        color: '#ff6600',
    },
    {
        title: 'DataWeave',
        category: 'Data Engineering',
        description:
            'A real-time streaming data pipeline framework processing millions of events per second with exactly-once semantics and sub-second latency guarantees.',
        color: '#cc00ff',
    },
];

export default function Projects() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const triggers: { kill: () => void }[] = [];

        const loadGsap = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            // Section header entrance
            const header = sectionRef.current?.querySelector('.projects-header');
            if (header) {
                const tween = gsap.fromTo(
                    header,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: header,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
                if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
            }

            // Each card slides in/out tied to scroll position
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                const isEven = i % 2 === 0;

                const tween = gsap.fromTo(
                    card,
                    {
                        x: isEven ? -100 : 100,
                        opacity: 0,
                        scale: 0.92,
                    },
                    {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            end: 'top 50%',
                            scrub: 0.5,
                        },
                    }
                );
                if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
            });
        };

        loadGsap();

        return () => {
            triggers.forEach((st) => st.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="projects"
            style={{
                padding: 'clamp(4rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6rem)',
                position: 'relative',
            }}
        >
            {/* Header */}
            <div className="projects-header" style={{ opacity: 0 }}>
                <div className="section-number">04 — Projects</div>
                <h2 style={{ marginBottom: '1rem' }}>
                    Selected <span className="accent-text">Work</span>
                </h2>
                <p className="text-body-lg" style={{ maxWidth: '500px', marginBottom: 'clamp(3rem, 6vh, 5rem)' }}>
                    A curated selection of projects spanning cloud, blockchain, AI, and data engineering.
                </p>
            </div>

            {/* Projects — vertical stack, each revealed on scroll */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 4vh, 4rem)' }}>
                {projects.map((project, i) => (
                    <div
                        key={i}
                        ref={(el) => { cardsRef.current[i] = el; }}
                        tabIndex={0}
                        role="article"
                        aria-label={`${project.title} — ${project.category}`}
                        style={{
                            position: 'relative',
                            border: '1px solid var(--border)',
                            borderRadius: '1.5rem',
                            padding: 'clamp(2rem, 4vw, 4rem)',
                            overflow: 'hidden',
                            background: 'rgba(10, 10, 10, 0.5)',
                            backdropFilter: 'blur(10px)',
                            cursor: 'pointer',
                            transition: 'border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
                            opacity: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(2rem, 4vw, 4rem)',
                            minHeight: '220px',
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = project.color + '55';
                            el.style.transform = 'translateY(-4px)';
                            el.style.boxShadow = `0 20px 60px ${project.color}15`;
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = 'var(--border)';
                            el.style.transform = 'translateY(0)';
                            el.style.boxShadow = 'none';
                        }}
                        onFocus={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = project.color + '55';
                            el.style.transform = 'translateY(-4px)';
                            el.style.boxShadow = `0 20px 60px ${project.color}15`;
                        }}
                        onBlur={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = 'var(--border)';
                            el.style.transform = 'translateY(0)';
                            el.style.boxShadow = 'none';
                        }}
                    >
                        {/* Background gradient accent */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: `radial-gradient(circle at ${i % 2 === 0 ? '85% 70%' : '15% 30%'}, ${project.color}10 0%, transparent 50%)`,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Big number */}
                        <span
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(5rem, 10vw, 9rem)',
                                fontWeight: 800,
                                color: project.color,
                                opacity: 0.08,
                                lineHeight: 1,
                                pointerEvents: 'none',
                                flexShrink: 0,
                                position: 'relative',
                                zIndex: 0,
                            }}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </span>

                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                            <span
                                style={{
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.3em',
                                    textTransform: 'uppercase',
                                    color: project.color,
                                    marginBottom: '0.75rem',
                                    display: 'block',
                                }}
                            >
                                {project.category}
                            </span>

                            <h3
                                style={{
                                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                                    marginBottom: '1rem',
                                    color: 'var(--foreground)',
                                    fontWeight: 600,
                                    lineHeight: 1.1,
                                }}
                            >
                                {project.title}
                            </h3>

                            <p
                                style={{
                                    fontSize: 'clamp(0.85rem, 1vw, 1rem)',
                                    lineHeight: 1.7,
                                    color: 'var(--text-secondary)',
                                    maxWidth: '600px',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                {project.description}
                            </p>

                            <a
                                href="#"
                                data-cursor-expand
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.8rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: project.color,
                                    textDecoration: 'none',
                                    borderBottom: `1px solid ${project.color}40`,
                                    paddingBottom: '0.25rem',
                                    transition: 'gap 0.3s ease, border-color 0.3s ease',
                                }}
                            >
                                View Case Study
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
