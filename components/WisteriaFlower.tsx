
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface WisteriaProps {
  position: [number, number, number];
  color: string;
}

const WisteriaFlower: React.FC<WisteriaProps> = ({ position, color }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Balanceo suave como si hubiera viento
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Creamos racimos de pétalos
  const petals = Array.from({ length: 15 }, (_, i) => ({
    pos: [
      (Math.random() - 0.5) * 0.5,
      -i * 0.3, // Caída vertical
      (Math.random() - 0.5) * 0.5
    ] as [number, number, number],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
    scale: 0.4 - (i * 0.02) // Se hacen más pequeños hacia abajo
  }));

  return (
    <group position={position} ref={groupRef}>
      {/* Luz central del racimo */}
      <pointLight distance={8} intensity={2} color={color} />
      
      {petals.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot} scale={p.scale}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default WisteriaFlower;
