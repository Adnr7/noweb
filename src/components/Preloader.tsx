'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [count, setCount] = useState(0);
    const preloaderRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const hasCompleted = useRef(false);
    const onCompleteRef = useRef(onComplete);

    // Keep the ref current without restarting the effect
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const duration = 2.5; // seconds
        const obj = { val: 0 };

        const tl = gsap.timeline({
            onComplete: () => {
                if (hasCompleted.current) return;
                hasCompleted.current = true;

                gsap.to(preloaderRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power3.inOut',
                    delay: 0.3,
                    onComplete: () => {
                        onCompleteRef.current();
                    },
                });
            },
        });

        tl.to(obj, {
            val: 100,
            duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                setCount(Math.round(obj.val));
            },
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div ref={preloaderRef} className="preloader">
            <span ref={counterRef} className="preloader-counter">
                {String(count).padStart(3, '0')}
            </span>
            <span className="preloader-label">Loading Experience</span>
        </div>
    );
}
