'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface Skill {
    name: string;
    angle: number;
    description: string;
    stats: string[];
}

const skills: Skill[] = [
    {
        name: 'Cloud Computing',
        angle: 0,
        description: 'Building scalable, distributed cloud architectures with modern infrastructure-as-code practices.',
        stats: ['AWS / Azure / GCP', 'Kubernetes & Docker', 'Serverless Architecture', 'CI/CD Pipelines'],
    },
    {
        name: 'Blockchain',
        angle: (Math.PI * 2) / 3,
        description: 'Developing decentralized applications and smart contracts on multiple blockchain platforms.',
        stats: ['Solidity & Rust', 'DeFi Protocols', 'NFT Infrastructure', 'Web3 Integration'],
    },
    {
        name: 'AI / ML',
        angle: (Math.PI * 4) / 3,
        description: 'Designing and deploying machine learning models from research to production at scale.',
        stats: ['Deep Learning / NLP', 'Computer Vision', 'MLOps & Model Serving', 'Data Engineering'],
    },
];

function SkillNode({ skill, onSelect, isSelected }: { skill: Skill; onSelect: (skill: Skill | null) => void; isSelected: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const radius = 2.4;
    const [hovered, setHovered] = useState(false);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            const t = clock.getElapsedTime() * 0.3;
            groupRef.current.position.x = Math.cos(skill.angle + t) * radius;
            groupRef.current.position.z = Math.sin(skill.angle + t) * radius;
            groupRef.current.position.y = Math.sin(t * 1.5 + skill.angle) * 0.3;
        }
    });

    return (
        <group
            ref={groupRef}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(isSelected ? null : skill);
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Node sphere */}
            <mesh>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial
                    color={isSelected || hovered ? '#00ff88' : '#ffffff'}
                    emissive={isSelected || hovered ? '#00ff88' : '#333333'}
                    emissiveIntensity={isSelected || hovered ? 0.8 : 0.2}
                    wireframe
                />
            </mesh>

            {/* Orbiting ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.38, 0.012, 8, 32]} />
                <meshStandardMaterial
                    color={isSelected || hovered ? '#00ff88' : '#444444'}
                    transparent
                    opacity={isSelected || hovered ? 1 : 0.3}
                />
            </mesh>

            {/* Label */}
            <Billboard>
                <Text
                    position={[0, 0.5, 0]}
                    fontSize={0.18}
                    color={isSelected || hovered ? '#00ff88' : '#888888'}
                    anchorX="center"
                    anchorY="bottom"
                >
                    {skill.name}
                </Text>
            </Billboard>
        </group>
    );
}

function CentralModel() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[1.76, 1]} />
            <meshStandardMaterial
                color="#0a0a0a"
                wireframe
                emissive="#00ff88"
                emissiveIntensity={0.15}
            />
        </mesh>
    );
}

function ConnectionLines() {
    const linesRef = useRef<THREE.Group>(null);

    const lines = useMemo(() => {
        return skills.map(() => {
            const geo = new THREE.BufferGeometry();
            const positions = new Float32Array(2 * 3);
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const mat = new THREE.LineBasicMaterial({ color: '#00ff88', opacity: 0.15, transparent: true });
            const line = new THREE.Line(geo, mat);
            return { line, geo, mat };
        });
    }, []);

    // Dispose GPU resources on unmount
    useEffect(() => {
        return () => {
            lines.forEach(({ geo, mat }) => {
                geo.dispose();
                mat.dispose();
            });
        };
    }, [lines]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.3;
        const radius = 2.4;

        skills.forEach((skill, i) => {
            const x = Math.cos(skill.angle + t) * radius;
            const z = Math.sin(skill.angle + t) * radius;
            const y = Math.sin(t * 1.5 + skill.angle) * 0.3;

            const positions = lines[i].line.geometry.getAttribute('position') as THREE.BufferAttribute;
            positions.setXYZ(0, 0, 0, 0);
            positions.setXYZ(1, x, y, z);
            positions.needsUpdate = true;
        });
    });

    return (
        <group ref={linesRef}>
            {lines.map(({ line }, i) => (
                <primitive key={i} object={line} />
            ))}
        </group>
    );
}

export default function SkillsModel({ onSelectSkill, selectedSkill }: { onSelectSkill: (skill: Skill | null) => void; selectedSkill?: Skill | null }) {
    const handleSelect = (skill: Skill | null) => {
        onSelectSkill(skill);
    };

    const currentSelected = selectedSkill ?? null;

    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#00ff88" />
            <pointLight position={[-5, -5, -5]} intensity={0.3} color="#ffffff" />

            <CentralModel />
            <ConnectionLines />

            {skills.map((skill) => (
                <SkillNode
                    key={skill.name}
                    skill={skill}
                    onSelect={handleSelect}
                    isSelected={currentSelected?.name === skill.name}
                />
            ))}

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
            />
        </>
    );
}

export type { Skill };
