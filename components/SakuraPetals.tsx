
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PETAL_COUNT = 400;

const SakuraPetals: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petals = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        Math.random() * 25 - 10,
        (Math.random() - 0.5) * 20
      ),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      speed: 0.01 + Math.random() * 0.04,
      horizontalOsc: Math.random() * 5,
      scale: 0.05 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    petals.forEach((petal, i) => {
      // Movimiento de caída más lento y suave
      petal.position.y -= petal.speed;
      
      // Viento y oscilación orgánica
      petal.position.x += Math.sin(time * 0.5 + petal.horizontalOsc) * 0.005;
      petal.position.z += Math.cos(time * 0.3 + petal.phase) * 0.003;
      
      // Reset si sale de pantalla
      if (petal.position.y < -15) {
        petal.position.y = 15;
        petal.position.x = (Math.random() - 0.5) * 40;
      }

      // Rotación suave (hojas/pétalos en el aire)
      petal.rotation.x += 0.005;
      petal.rotation.y += 0.01;
      petal.rotation.z += Math.sin(time + petal.phase) * 0.01;

      dummy.position.copy(petal.position);
      dummy.rotation.copy(petal.rotation);
      dummy.scale.set(petal.scale, petal.scale * 1.2, petal.scale); // Ligeramente estirado para forma de pétalo
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PETAL_COUNT]}>
      {/* Usamos CircleGeometry para evitar bordes rectos/geométricos */}
      <circleGeometry args={[1, 6]} /> 
      <meshStandardMaterial 
        color="#ffd1dc" 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.6}
        emissive="#ffb7ce"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  );
};

export default SakuraPetals;
