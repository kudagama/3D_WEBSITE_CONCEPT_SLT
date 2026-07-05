'use client';

import React, { useState, useRef } from 'react';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CanvasContainer from '@/components/canvas/CanvasContainer';
import Overlay from '@/components/layout/Overlay';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);

  // High-performance shared ref to bypass React render updates for active shader variables
  const waveParamsRef = useRef({
    frequency: 1.5,
    amplitude: 0.4,
    speed: 1.2,
  });

  return (
    <SmoothScroll>
      <main style={{ position: 'relative', width: '100%' }}>
        {/* Background 3D Canvas rendering layer */}
        <CanvasContainer
          waveParamsRef={waveParamsRef}
          setSection={setCurrentSection}
        />

        {/* Foreground Interactive DOM/HUD layer */}
        <Overlay
          currentSection={currentSection}
          waveParamsRef={waveParamsRef}
        />
      </main>
    </SmoothScroll>
  );
}
