'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FiberTunnel() {
  const tunnelRef = useRef<THREE.Mesh>(null);
  const particleGroupRef = useRef<THREE.Group>(null);

  // 1. Define the 3D spline curve for the tunnel
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const length = 50;
    
    // Generate a spiral spline along the Z-axis
    for (let i = 0; i < length; i++) {
      const angle = i * 0.35;
      const radius = 2.0 + Math.sin(i * 0.1) * 0.4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = 25 - i * 1.0; // Spanning from z = 25 down to z = -25
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // 2. Setup multiple data packet particles
  const particleCount = 45;
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < particleCount; i++) {
      data.push({
        // Spread starting positions along the spline (0 to 1)
        progress: (i / particleCount) + Math.random() * 0.05,
        speed: 0.12 + Math.random() * 0.08,
        color: i % 3 === 0 ? '#ff007f' : i % 3 === 1 ? '#00f0ff' : '#8b5cf6',
        scale: 0.03 + Math.random() * 0.04,
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          0
        ),
      });
    }
    return data;
  }, []);

  // Reusable Vector3 to prevent garbage collection inside useFrame
  const tempPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // Rotate the wireframe tunnel for aesthetic dynamism
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }

    // Move packet particles along the spline
    if (particleGroupRef.current) {
      const children = particleGroupRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const mesh = children[i] as THREE.Mesh;
        const pData = particles[i];

        // Increment progress along spline
        pData.progress += pData.speed * delta;
        if (pData.progress > 1.0) {
          pData.progress = 0.0;
        }

        // Get position on spline curve
        curve.getPointAt(pData.progress, tempPos);
        
        // Apply spatial offset to particles so they float around the center path
        mesh.position.copy(tempPos).add(pData.offset);
      }
    }
  });

  return (
    <group>
      {/* The main wireframe cylinder tube */}
      <mesh ref={tunnelRef}>
        <tubeGeometry args={[curve, 120, 1.8, 16, false]} />
        <meshBasicMaterial
          color="#ff007f"
          wireframe
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer concentric rings representing tunnel nodes */}
      {Array.from({ length: 10 }).map((_, index) => {
        // Calculate coordinate down the spline path
        const t = index / 9;
        const pos = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        
        // Orient rings to face the direction of the tunnel curve
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);

        return (
          <group key={index} position={pos} quaternion={quaternion}>
            <mesh>
              <ringGeometry args={[1.78, 1.8, 32]} />
              <meshBasicMaterial
                color={index % 2 === 0 ? '#00f0ff' : '#8b5cf6'}
                side={THREE.DoubleSide}
                transparent
                opacity={0.35}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}

      {/* Glowing data packets group */}
      <group ref={particleGroupRef}>
        {particles.map((p, idx) => (
          <mesh key={idx} scale={[p.scale, p.scale, p.scale]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={p.color}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
