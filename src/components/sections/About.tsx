'use client';

import { useRef, useEffect } from 'react';

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const wordsRef = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {
        const triggers: { kill: () => void }[] = [];

        const loadGsap = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            // Fade in the entire section as it scrolls into view
            if (sectionRef.current) {
                const tween = gsap.fromTo(
                    sectionRef.current,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 90%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
                if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
            }

            // Animate each word from dim to bright on scroll
            wordsRef.current.forEach((word) => {
                if (!word) return;
                const tween = gsap.fromTo(
                    word,
                    { opacity: 0.15 },
                    {
                        opacity: 1,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: word,
                            start: 'top 85%',
                            end: 'top 50%',
                            scrub: true,
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

    const paragraphs = [
        'Born in the vibrant lands of India, my journey began not with code — but with numbers. A deep foundation in mathematics and physics shaped a mind built for problem-solving and first-principles thinking.',
        'That analytical core naturally evolved into software engineering, where abstractions become architecture, and logic becomes product.',
        'Today, I bridge the gap between emerging technologies and real-world applications — from cloud-native distributed systems to blockchain protocols and machine learning pipelines.',
        'Every system I build is an expression of clarity: minimal complexity, maximum impact.',
    ];

    const renderWords = (text: string, startIndex: number) => {
        const words = text.split(' ');
        return words.map((word, i) => (
            <span
                key={startIndex + i}
                ref={(el) => {
                    if (el) wordsRef.current[startIndex + i] = el;
                }}
                style={{
                    display: 'inline-block',
                    marginRight: '0.3em',
                    opacity: 0.15,
                    transition: 'color 0.3s ease',
                }}
            >
                {word}
            </span>
        ));
    };

    let wordIndex = 0;

    return (
        <section
            ref={sectionRef}
            id="about"
            className="section-padding"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: '900px',
                margin: '0 auto',
                opacity: 0,
            }}
        >
            <div className="section-number">01 — The Origin</div>
            <div className="thin-rule" style={{ marginBottom: '3rem' }} />

            {paragraphs.map((p, pi) => {
                const currentStartIndex = wordIndex;
                wordIndex += p.split(' ').length;
                return (
                    <p
                        key={pi}
                        style={{
                            fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                            fontWeight: 400,
                            lineHeight: 1.6,
                            marginBottom: '2rem',
                            fontFamily: 'var(--font-display)',
                        }}
                    >
                        {renderWords(p, currentStartIndex)}
                    </p>
                );
            })}
        </section>
    );
}
