'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HologramGlobe() {
  const globeRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Generate random node positions on a sphere
  const { nodePositions, arcs } = useMemo(() => {
    const nodes: [number, number, number][] = [];
    const arcLines: THREE.Vector3[][] = [];
    const nodeCount = 60;
    const radius = 2.5;

    // 1. Generate nodes on sphere surface using Fibonacci sphere algorithm
    for (let i = 0; i < nodeCount; i++) {
      const offset = 2 / nodeCount;
      const increment = Math.PI * (3 - Math.sqrt(5));
      const y = (i * offset - 1) + (offset / 2);
      const r = Math.sqrt(1 - y * y) * radius;
      const phi = i * increment;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      nodes.push([x, y * radius, z]);
    }

    // 2. Generate random connection arcs between pairs of nodes
    const arcCount = 20;
    for (let i = 0; i < arcCount; i++) {
      const startIndex = Math.floor(Math.random() * nodeCount);
      let endIndex = Math.floor(Math.random() * nodeCount);
      while (endIndex === startIndex) {
        endIndex = Math.floor(Math.random() * nodeCount);
      }

      const p1 = new THREE.Vector3(...nodes[startIndex]);
      const p2 = new THREE.Vector3(...nodes[endIndex]);

      // Calculate middle point projected outwards for curvature
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(radius + dist * 0.4); // Push outward based on distance

      // Create quadratic Bezier curve
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      arcLines.push(curve.getPoints(30)); // 30 segments per line
    }

    return { nodePositions: nodes, arcs: arcLines };
  }, []);

  // Animate globe components
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.05;
      globeRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }

    if (orbitRef.current) {
      orbitRef.current.rotation.y = -time * 0.1;
      orbitRef.current.rotation.z = time * 0.03;
    }

    if (coreRef.current) {
      // Core glowing pulse
      const scale = 1.0 + Math.sin(time * 3) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Slow rotating main Globe group */}
      <group ref={globeRef}>
        {/* Core sphere with glowing mesh */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.15}
            wireframe
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Global Node Point Cloud */}
        <points>
          <sphereGeometry args={[2.5, 40, 40]} />
          <pointsMaterial
            color="#00f0ff"
            size={0.04}
            sizeAttenuation
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Dynamic Curved Connection Arcs */}
        {arcs.map((points, idx) => (
          <line key={idx}>
            <bufferGeometry>
              <float32BufferAttribute
                attach="attributes-position"
                args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={idx % 2 === 0 ? '#00f0ff' : '#8b5cf6'}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              linewidth={1}
            />
          </line>
        ))}

        {/* Concentrated node dots */}
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              color={idx % 3 === 0 ? '#ff007f' : '#00f0ff'}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Orbiting Satellite Rings */}
      <group ref={orbitRef}>
        {/* Large outer ring */}
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[3.2, 3.22, 64]} />
          <meshBasicMaterial
            color="#ff007f"
            side={THREE.DoubleSide}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Secondary ring */}
        <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <ringGeometry args={[2.8, 2.81, 64]} />
          <meshBasicMaterial
            color="#8b5cf6"
            side={THREE.DoubleSide}
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}
