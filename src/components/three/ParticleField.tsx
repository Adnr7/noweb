'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 2500;

const vertexShader = `
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uTime;
  
  attribute float aScale;
  
  varying float vAlpha;
  varying float vDistortion;
  
  void main() {
    vec3 pos = position;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vec4 projected = projectionMatrix * mvPosition;
    vec2 screenPos = projected.xy / projected.w;
    
    float dist = distance(screenPos, uMouse);
    
    // Subtle attraction toward cursor
    float pullRadius = 0.5;
    float pullStrength = smoothstep(pullRadius, 0.0, dist);
    float spiralStrength = pullStrength * pullStrength;
    
    // Direction toward cursor
    vec2 toMouse = uMouse - screenPos;
    float angle = atan(toMouse.y, toMouse.x);
    
    // Gentle spiral rotation near cursor
    float spiralAngle = angle + spiralStrength * 3.0 + uTime * 0.4 * spiralStrength;
    
    // Soft pull — particles nudge toward cursor, not teleport
    if (dist < pullRadius) {
      pos.x += cos(spiralAngle) * spiralStrength * 0.5 + toMouse.x * spiralStrength * 0.4;
      pos.y += sin(spiralAngle) * spiralStrength * 0.5 + toMouse.y * spiralStrength * 0.4;
      pos.z += spiralStrength * 0.3;
    }
    
    mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    gl_Position = projectionMatrix * mvPosition;
    
    // Gentle size boost near cursor
    float sizeBoost = 1.0 + spiralStrength * 1.0;
    gl_PointSize = aScale * uPixelRatio * (100.0 / -mvPosition.z) * sizeBoost;
    
    vAlpha = smoothstep(0.0, 0.2, aScale) * (0.35 + spiralStrength * 0.5);
    vDistortion = spiralStrength;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vDistortion;
  
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
    
    // Color shifts toward green/white near cursor
    vec3 baseColor = vec3(0.4, 0.7, 1.0);
    vec3 distortedColor = vec3(0.0, 1.0, 0.5);
    vec3 color = mix(baseColor, distortedColor, vDistortion);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function ParticleField() {
    const meshRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const geoRef = useRef<THREE.BufferGeometry>(null);
    const mouse = useRef(new THREE.Vector2(0, 0));

    const particleData = useRef<{
        velocities: Float32Array;
        phases: Float32Array;
    } | null>(null);

    const { positions, scales, velocities, phases } = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const scales = new Float32Array(PARTICLE_COUNT);
        const velocities = new Float32Array(PARTICLE_COUNT * 3);
        const phases = new Float32Array(PARTICLE_COUNT * 3);

        // Grid-based placement with jitter for even distribution
        const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (30 / 18)));
        const rows = Math.ceil(PARTICLE_COUNT / cols);
        const cellW = 30 / cols;
        const cellH = 18 / rows;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const col = i % cols;
            const row = Math.floor(i / cols);

            // Place at grid center + random jitter within the cell
            positions[i3] = -15 + (col + 0.5) * cellW + (Math.random() - 0.5) * cellW * 0.9;
            positions[i3 + 1] = -9 + (row + 0.5) * cellH + (Math.random() - 0.5) * cellH * 0.9;
            positions[i3 + 2] = (Math.random() - 0.5) * 5;

            // More uniform sizes — small particles with slight variation
            scales[i] = 0.3 + Math.random() * 0.7;

            velocities[i3] = (Math.random() - 0.5) * 0.004;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.003;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;

            phases[i3] = Math.random() * Math.PI * 2;
            phases[i3 + 1] = Math.random() * Math.PI * 2;
            phases[i3 + 2] = Math.random() * Math.PI * 2;
        }

        return { positions, scales, velocities, phases };
    }, []);

    // Set particle data ref after initial render (not during render)
    useEffect(() => {
        particleData.current = { velocities, phases };
    }, [velocities, phases]);

    useEffect(() => {
        if (geoRef.current) {
            geoRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geoRef.current.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        }
    }, [positions, scales]);

    useFrame(({ clock, pointer }) => {
        if (materialRef.current) {
            mouse.current.x += (pointer.x - mouse.current.x) * 0.05;
            mouse.current.y += (pointer.y - mouse.current.y) * 0.05;
            materialRef.current.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }

        if (geoRef.current && particleData.current) {
            const posAttr = geoRef.current.getAttribute('position') as THREE.BufferAttribute;
            if (!posAttr) return;
            const arr = posAttr.array as Float32Array;
            const { velocities, phases } = particleData.current;
            const t = clock.getElapsedTime();

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;

                arr[i3] += velocities[i3] + Math.sin(t * 0.3 + phases[i3]) * 0.001;
                arr[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.25 + phases[i3 + 1]) * 0.001;
                arr[i3 + 2] += velocities[i3 + 2] + Math.sin(t * 0.2 + phases[i3 + 2]) * 0.0005;

                // Wrap around edges
                if (arr[i3] > 15) arr[i3] = -15;
                if (arr[i3] < -15) arr[i3] = 15;
                if (arr[i3 + 1] > 9) arr[i3 + 1] = -9;
                if (arr[i3 + 1] < -9) arr[i3 + 1] = 9;
                if (arr[i3 + 2] > 2.5) arr[i3 + 2] = -2.5;
                if (arr[i3 + 2] < -2.5) arr[i3 + 2] = 2.5;
            }

            posAttr.needsUpdate = true;
        }
    });

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2;

    const uniforms = useMemo(() => ({
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: dpr },
        uTime: { value: 0 },
    }), [dpr]);

    return (
        <points ref={meshRef}>
            <bufferGeometry ref={geoRef} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

