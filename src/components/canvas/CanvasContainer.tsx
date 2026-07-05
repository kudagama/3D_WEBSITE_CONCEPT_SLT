'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stats, Loader } from '@react-three/drei';
import * as THREE from 'three';
import HologramGlobe from './HologramGlobe';
import FiberTunnel from './FiberTunnel';
import CityGrid from './CityGrid';
import SignalWaves from './SignalWaves';

interface CanvasContainerProps {
  waveParamsRef: React.MutableRefObject<{
    frequency: number;
    amplitude: number;
    speed: number;
  }>;
  setSection: (section: number) => void;
}

// Camera controller that drives position based on scroll position using LERP
function CameraController({ setSection }: { setSection: (section: number) => void }) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 8));
  const targetCamLook = useRef(new THREE.Vector3(0, 0, 0));

  // Define spatial points for each section
  const sections = [
    {
      // Sector 1: Globe
      camPos: new THREE.Vector3(0, 0, 8),
      lookAt: new THREE.Vector3(0, 0, 0),
    },
    {
      // Sector 2: Tunnel (Start at entrance, pointing through spline)
      camPos: new THREE.Vector3(0, -30, 15),
      lookAt: new THREE.Vector3(0, -30, -20),
    },
    {
      // Sector 3: Smart City (Aerial angle looking down)
      camPos: new THREE.Vector3(45, 12, -18),
      lookAt: new THREE.Vector3(30, -2, -30),
    },
    {
      // Sector 4: Wave Modulator (Looking down at the plane grid)
      camPos: new THREE.Vector3(0, 36, 42),
      lookAt: new THREE.Vector3(0, 26, 30),
    },
  ];

  useFrame((state) => {
    // 1. Calculate global scroll percentage
    const scrollY = window.scrollY || 0;
    const maxScroll = (document.documentElement.scrollHeight || 1) - window.innerHeight;
    const progress = THREE.MathUtils.clamp(scrollY / (maxScroll || 1), 0, 1);

    // Update parent state for indicators (0, 1, 2, 3)
    const sectionIndex = Math.min(Math.floor(progress * 4), 3);
    setSection(sectionIndex);

    // 2. Interpolate camera position and target vectors based on progress
    const segment = progress * 3; // 3 segments for 4 points
    const index = Math.floor(segment);
    const fraction = segment - index;

    if (index >= 0 && index < 3) {
      const start = sections[index];
      const end = sections[index + 1];

      targetCamPos.current.lerpVectors(start.camPos, end.camPos, fraction);
      targetCamLook.current.lerpVectors(start.lookAt, end.lookAt, fraction);
    } else {
      // Out of bounds safety
      const end = sections[3];
      targetCamPos.current.copy(end.camPos);
      targetCamLook.current.copy(end.lookAt);
    }

    // 3. Smooth camera movement with lerp
    camera.position.lerp(targetCamPos.current, 0.08);
    currentTarget.current.lerp(targetCamLook.current, 0.08);
    camera.lookAt(currentTarget.current);

    // Subtle drift/float animation to make the scene feel alive
    const floatOffset = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
    camera.position.y += floatOffset * 0.05;
    camera.position.x += Math.cos(state.clock.getElapsedTime() * 0.5) * 0.05;
  });

  return null;
}

export default function CanvasContainer({ waveParamsRef, setSection }: CanvasContainerProps) {
  return (
    <div className="canvas-wrapper">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]} // Performance optimization: cap at 1.5dpr
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
      >
        {/* Color space correction and clear color */}
        <color attach="background" args={['#030307']} />
        
        {/* Ambient background light */}
        <ambientLight intensity={0.4} />
        
        {/* Key light for gloss effects */}
        <directionalLight position={[10, 20, 15]} intensity={1.2} color="#00f0ff" castShadow={false} />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#ff007f" />

        <Suspense fallback={null}>
          {/* Section 1 scene: Global Globe */}
          <group position={[0, 0, 0]}>
            <HologramGlobe />
          </group>

          {/* Section 2 scene: Fiber Tunnel */}
          <group position={[0, -30, 0]}>
            <FiberTunnel />
          </group>

          {/* Section 3 scene: Smart City Grid */}
          <group position={[30, 0, -30]}>
            <CityGrid />
          </group>

          {/* Section 4 scene: Signal Modulator */}
          <group position={[0, 30, 30]}>
            <SignalWaves paramsRef={waveParamsRef} />
          </group>
          
          {/* Custom Camera logic */}
          <CameraController setSection={setSection} />
        </Suspense>

        {/* Display rendering statistics for debug. Can be removed for final output. */}
        <Stats className="r3f-stats-panel" />
      </Canvas>
      <Loader />
    </div>
  );
}
