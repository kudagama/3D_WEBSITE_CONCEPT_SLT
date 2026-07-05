'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CityGrid() {
  const cityGroupRef = useRef<THREE.Group>(null);
  const solidMeshRef = useRef<THREE.InstancedMesh>(null);
  const wireMeshRef = useRef<THREE.InstancedMesh>(null);
  const beamMeshRef = useRef<THREE.InstancedMesh>(null);

  const gridSize = 12; // 12x12 grid = 144 buildings
  const count = gridSize * gridSize;
  const spacing = 2.2;

  // 1. Generate static building positions & scales
  const buildings = useMemo(() => {
    const list = [];
    const seed = 0.54; // Constant seed for reproducibility
    let idx = 0;
    
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        // Pseudo-random height generator based on coordinate indices
        const hash = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
        const rand = hash - Math.floor(hash);
        
        // Tall towers in the center, short buildings on the edges
        const distFromCenter = Math.sqrt(
          Math.pow(x - gridSize / 2, 2) + Math.pow(z - gridSize / 2, 2)
        );
        const centerBias = Math.max(0, 1 - distFromCenter / (gridSize * 0.7));
        const height = 0.5 + rand * 3.5 + centerBias * 4.0;
        
        const posX = (x - gridSize / 2) * spacing;
        const posZ = (z - gridSize / 2) * spacing;
        const posY = height / 2; // Bottom of building sits on ground plane (y=0)
        
        list.push({
          id: idx++,
          x: posX,
          y: posY,
          z: posZ,
          width: 0.8 + rand * 0.4,
          height: height,
          depth: 0.8 + rand * 0.4,
          // Emissive beam probability (whether building fires a telemetry beam)
          hasBeam: rand > 0.75,
          beamSpeed: 1.0 + rand * 1.5,
          beamOffset: rand * Math.PI * 2,
        });
      }
    }
    return list;
  }, [spacing]);

  // 2. Initialize instance matrices for the static city buildings
  useEffect(() => {
    const tempMatrix = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempScale = new THREE.Vector3();

    buildings.forEach((building, idx) => {
      // Solid/Wireframe building transforms
      tempPos.set(building.x, building.y, building.z);
      tempScale.set(building.width, building.height, building.depth);
      
      tempMatrix.compose(
        tempPos,
        new THREE.Quaternion(), // No rotation
        tempScale
      );

      if (solidMeshRef.current) {
        solidMeshRef.current.setMatrixAt(idx, tempMatrix);
      }
      if (wireMeshRef.current) {
        wireMeshRef.current.setMatrixAt(idx, tempMatrix);
      }
    });

    if (solidMeshRef.current) solidMeshRef.current.instanceMatrix.needsUpdate = true;
    if (wireMeshRef.current) wireMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings]);

  // 3. Setup communication beams positions & scales
  const beamCount = useMemo(() => buildings.filter(b => b.hasBeam).length, [buildings]);
  const beamBuildings = useMemo(() => buildings.filter(b => b.hasBeam), [buildings]);

  // Reusable objects for frame loop
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate the whole city scene slowly
    if (cityGroupRef.current) {
      cityGroupRef.current.rotation.y = time * 0.03;
    }

    // Animate the instanced data beams
    if (beamMeshRef.current) {
      beamBuildings.forEach((building, idx) => {
        // Calculate dynamic height scale using sin wave
        const pulse = Math.sin(time * building.beamSpeed + building.beamOffset);
        const activeHeight = Math.max(0.1, (pulse + 1) * 3.5);
        
        // Sit the beam on top of the respective building
        const beamY = building.height + activeHeight / 2;
        tempPos.set(building.x, beamY, building.z);
        
        // Scale the beam height dynamically
        tempScale.set(0.08, activeHeight, 0.08);

        tempMatrix.compose(tempPos, tempQuat, tempScale);
        beamMeshRef.current!.setMatrixAt(idx, tempMatrix);
      });
      
      beamMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={cityGroupRef}>
      {/* Ground Grid Plane */}
      <gridHelper
        args={[30, 20, '#8b5cf6', '#1e1b4b']}
        position={[0, 0, 0]}
      />

      {/* Solid translucent buildings */}
      <instancedMesh ref={solidMeshRef} args={[null as any, null as any, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#060613"
          transparent
          opacity={0.65}
        />
      </instancedMesh>

      {/* Glowing wireframe overlay for buildings */}
      <instancedMesh ref={wireMeshRef} args={[null as any, null as any, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Telemetry connection beams */}
      <instancedMesh ref={beamMeshRef} args={[null as any, null as any, beamCount]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </group>
  );
}
