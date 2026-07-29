"use client";

import { useMemo } from "react";

function SesameSeeds({ count = 14, radius = 0.62 }: { count?: number; radius?: number }) {
  const seeds = useMemo(() => {
    const arr: [number, number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      arr.push([Math.cos(a) * r, 0.18 + Math.random() * 0.03, Math.sin(a) * r, Math.random() * Math.PI]);
    }
    return arr;
  }, [count, radius]);

  return (
    <group>
      {seeds.map(([x, y, z, rot], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, rot, 0]} castShadow>
          <capsuleGeometry args={[0.025, 0.05, 4, 6]} />
          <meshStandardMaterial color="#fff6e0" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function BurgerModel() {
  return (
    <group>
      {/* bottom bun */}
      <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.68, 0.28, 32]} />
        <meshStandardMaterial color="#d99a4e" roughness={0.75} />
      </mesh>

      {/* lettuce - irregular flattened ring peeking out */}
      <mesh position={[0, -0.36, 0]} castShadow>
        <torusGeometry args={[0.66, 0.09, 8, 24]} />
        <meshStandardMaterial color="#6fae3e" roughness={0.9} />
      </mesh>

      {/* patty */}
      <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.58, 0.6, 0.22, 32]} />
        <meshStandardMaterial color="#5a3420" roughness={0.85} />
      </mesh>

      {/* cheese - diagonal drape */}
      <mesh position={[0, -0.08, 0]} rotation={[0, Math.PI / 6, 0]} castShadow>
        <boxGeometry args={[1.3, 0.04, 1.3]} />
        <meshStandardMaterial color="#f5c542" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* tomato slice */}
      <mesh position={[0.28, 0.02, 0.22]} rotation={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.07, 20]} />
        <meshStandardMaterial color="#c1392b" roughness={0.5} />
      </mesh>

      {/* onion ring accent */}
      <mesh position={[-0.22, 0.08, -0.2]} rotation={[Math.PI / 2.4, 0, 0.3]} castShadow>
        <torusGeometry args={[0.22, 0.045, 8, 20]} />
        <meshStandardMaterial color="#e6d6f0" roughness={0.5} />
      </mesh>

      {/* pickles */}
      {[-0.4, -0.15, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.14, -0.35 + i * 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.22, 12]} />
          <meshStandardMaterial color="#7ba043" roughness={0.7} />
        </mesh>
      ))}

      {/* top bun (dome) */}
      <group position={[0, 0.22, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.66, 32, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color="#e2a95c" roughness={0.7} />
        </mesh>
        <SesameSeeds />
      </group>
    </group>
  );
}
