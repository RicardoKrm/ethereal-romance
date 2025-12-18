
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const HorseSpirit: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({ position, rotationY = 0 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 600;
  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Forma de "nube" alargada dinámica
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return { positions: pos, originalPositions: new Float32Array(pos) };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      // Animación de galope en las partículas
      const idx = i * 3;
      array[idx] = originalPositions[idx] + Math.cos(time * 3 + originalPositions[idx]) * 0.2;
      array[idx + 1] = originalPositions[idx + 1] + Math.sin(time * 5 + originalPositions[idx]) * 0.3;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += 0.005;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Points positions={positions} ref={pointsRef}>
        <PointMaterial
          transparent
          color="#00f2ff"
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
      
      {/* Halo de luz que sugiere el cuerpo */}
      <mesh>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} transparent opacity={0.2} />
      </mesh>
      
      <pointLight intensity={8} color="#00f2ff" distance={12} />
    </group>
  );
};

export default HorseSpirit;
