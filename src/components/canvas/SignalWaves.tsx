'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SignalWavesProps {
  paramsRef: React.MutableRefObject<{
    frequency: number;
    amplitude: number;
    speed: number;
  }>;
}

export default function SignalWaves({ paramsRef }: SignalWavesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 1. Grid geometry details
  const size = 20;
  const segments = 120; // 120x120 grid = 14,400 points

  // 2. Custom GLSL Shader code
  const shader = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uFrequency: { value: 1.5 },
        uAmplitude: { value: 0.4 },
        uSpeed: { value: 1.2 },
        uColorCyan: { value: new THREE.Color('#00f0ff') },
        uColorViolet: { value: new THREE.Color('#8b5cf6') },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uFrequency;
        uniform float uAmplitude;
        uniform float uSpeed;
        
        varying float vElevation;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Circular wave propagation from the origin (center of plane)
          float dist = distance(pos.xy, vec2(0.0));
          float wave = sin(dist * uFrequency - uTime * uSpeed) * uAmplitude;
          
          // Secondary noise wave for organic behavior
          float microWave = cos((pos.x + pos.y) * (uFrequency * 2.0) + uTime * (uSpeed * 1.5)) * (uAmplitude * 0.15);
          
          pos.z += wave + microWave;
          vElevation = wave + microWave;

          vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * modelViewPosition;

          // Size attenuation based on distance to camera
          gl_PointSize = 4.5 * (10.0 / -modelViewPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorCyan;
        uniform vec3 uColorViolet;
        
        varying float vElevation;
        varying vec2 vUv;

        void main() {
          // Discard pixels outside a circle to draw circular points rather than square boxes
          if (length(gl_PointCoord - vec2(0.5)) > 0.5) {
            discard;
          }

          // Normalize the wave elevation for color mixing
          // -uAmplitude to +uAmplitude mapped to 0.0 to 1.0
          float strength = (vElevation + 1.0) * 0.5;
          vec3 color = mix(uColorViolet, uColorCyan, strength);

          // Add a subtle brightness glow in the center of each point particle
          float glow = 1.0 - (length(gl_PointCoord - vec2(0.5)) * 2.0);
          vec3 finalColor = color + vec3(glow * 0.3);

          // Subtle alpha fade at the outer edges of the grid plane
          float edgeFade = 1.0 - smoothstep(0.3, 0.5, distance(vUv, vec2(0.5)));

          gl_FragColor = vec4(finalColor, 0.85 * edgeFade);
        }
      `
    };
  }, []);

  // 3. Frame loop to update shader uniforms in real-time bypassing React state renders
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uFrequency.value = paramsRef.current.frequency;
      materialRef.current.uniforms.uAmplitude.value = paramsRef.current.amplitude;
      materialRef.current.uniforms.uSpeed.value = paramsRef.current.speed;
    }

    // Slow grid rotation to show 3D depth
    if (pointsRef.current) {
      pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        uniforms={shader.uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
