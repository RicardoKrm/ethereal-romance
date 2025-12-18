
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PETAL_COUNT = 250; // Reducido para mayor elegancia

const SakuraPetals: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petals = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        Math.random() * 30 - 15,
        (Math.random() - 0.5) * 20
      ),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      speed: 0.005 + Math.random() * 0.02,
      horizontalOsc: Math.random() * 10,
      scale: 0.04 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    petals.forEach((petal, i) => {
      // Caída muy lenta y poética
      petal.position.y -= petal.speed;
      
      // Movimiento errático lateral (viento suave)
      petal.position.x += Math.sin(time * 0.4 + petal.horizontalOsc) * 0.008;
      
      // Reset
      if (petal.position.y < -20) {
        petal.position.y = 20;
        petal.position.x = (Math.random() - 0.5) * 40;
      }

      // Rotación orgánica de hoja
      petal.rotation.x += 0.002;
      petal.rotation.y += 0.005;
      petal.rotation.z += Math.sin(time * 0.5 + petal.phase) * 0.01;

      dummy.position.copy(petal.position);
      dummy.rotation.copy(petal.rotation);
      dummy.scale.set(petal.scale, petal.scale * 1.5, petal.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PETAL_COUNT]}>
      <circleGeometry args={[1, 5]} /> 
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffb7ce"
        emissiveIntensity={0.2}
        transparent 
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};

export default SakuraPetals;
