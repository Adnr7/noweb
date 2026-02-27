'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const dotPos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Detect touch device
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('canvas') ||
                target.closest('[data-cursor-expand]');

            if (isInteractive) {
                dotRef.current?.classList.add('expanded');
                ringRef.current?.classList.add('expanded');
            } else {
                dotRef.current?.classList.remove('expanded');
                ringRef.current?.classList.remove('expanded');
            }
        };

        let raf: number;
        const animate = () => {
            dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.8;
            dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.8;
            ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.35;
            ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.35;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
            }
            if (ringRef.current) {
                const ringSize = ringRef.current.classList.contains('expanded') ? 50 : 36;
                const offset = ringSize / 2;
                ringRef.current.style.transform = `translate(${ringPos.current.x - offset}px, ${ringPos.current.y - offset}px)`;
            }

            raf = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
}
