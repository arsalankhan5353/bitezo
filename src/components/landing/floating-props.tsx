"use client";

import Floating from "./floating";
import RealPizzaModel from "./real-pizza-model";

function Fries() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.4, 0.24]} />
        <meshStandardMaterial color="#e33b2e" roughness={0.6} />
      </mesh>
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.32, 0]} rotation={[0, 0, (i - 1) * 0.15]} castShadow>
          <boxGeometry args={[0.05, 0.32, 0.05]} />
          <meshStandardMaterial color="#f2c14e" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Drink() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.13, 0.5, 24]} />
        <meshStandardMaterial color="#f4f4f4" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 24]} />
        <meshStandardMaterial color="#e33b2e" roughness={0.4} />
      </mesh>
      <mesh position={[0.02, 0.42, 0]} rotation={[0.15, 0, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
    </group>
  );
}

function BurgerBox() {
  return (
    <mesh castShadow>
      <boxGeometry args={[0.5, 0.22, 0.5]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.55} emissive="#ff6a00" emissiveIntensity={0.06} />
    </mesh>
  );
}

function CheeseSlice() {
  return (
    <mesh castShadow rotation={[Math.PI / 2, 0, 0.3]}>
      <boxGeometry args={[0.34, 0.34, 0.02]} />
      <meshStandardMaterial color="#f5c542" roughness={0.35} />
    </mesh>
  );
}

function TomatoSlice() {
  return (
    <mesh castShadow>
      <cylinderGeometry args={[0.2, 0.2, 0.06, 20]} />
      <meshStandardMaterial color="#c1392b" roughness={0.5} />
    </mesh>
  );
}

function OnionRing() {
  return (
    <mesh castShadow rotation={[Math.PI / 2.2, 0, 0]}>
      <torusGeometry args={[0.16, 0.035, 8, 20]} />
      <meshStandardMaterial color="#e6d6f0" roughness={0.5} />
    </mesh>
  );
}

function LettuceLeaf() {
  return (
    <mesh castShadow>
      <torusGeometry args={[0.18, 0.07, 8, 16]} />
      <meshStandardMaterial color="#6fae3e" roughness={0.9} />
    </mesh>
  );
}

function Pickle() {
  return (
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.05, 0.05, 0.24, 12]} />
      <meshStandardMaterial color="#7ba043" roughness={0.7} />
    </mesh>
  );
}

/**
 * All the ingredients from the brief, each independently floating/orbiting
 * around the hero burger with its own speed and phase.
 */
export default function FloatingProps() {
  return (
    <>
      <Floating position={[-2.1, 0.4, -0.3]} orbitRadius={0.25} orbitSpeed={0.22} bobSpeed={0.9} phase={0}>
        <Fries />
      </Floating>
      <Floating position={[2.2, -0.3, -0.4]} orbitRadius={0.3} orbitSpeed={0.18} bobSpeed={1.1} phase={1.2}>
        <Drink />
      </Floating>
      <Floating position={[-1.7, -0.9, 0.6]} orbitRadius={0.2} orbitSpeed={0.15} bobSpeed={0.8} phase={2.4}>
        <BurgerBox />
      </Floating>
      <Floating position={[1.9, 1, 0.3]} orbitRadius={0.22} orbitSpeed={0.28} bobSpeed={1.3} phase={0.6}>
        <CheeseSlice />
      </Floating>
      <Floating position={[0.2, 1.5, -1]} orbitRadius={0.18} orbitSpeed={0.3} bobSpeed={1} phase={3}>
        <TomatoSlice />
      </Floating>
      <Floating position={[-0.4, -1.5, -0.8]} orbitRadius={0.2} orbitSpeed={0.24} bobSpeed={1.2} phase={1.8}>
        <OnionRing />
      </Floating>
      <Floating position={[1.3, -1.3, 0.9]} orbitRadius={0.22} orbitSpeed={0.2} bobSpeed={0.95} phase={2.1}>
        <LettuceLeaf />
      </Floating>
      <Floating position={[-2.3, 1.1, 0.5]} orbitRadius={0.2} orbitSpeed={0.26} bobSpeed={1.15} phase={0.9}>
        <Pickle />
      </Floating>
      <Floating position={[2.4, 0.6, 1.1]} orbitRadius={0.28} orbitSpeed={0.16} bobSpeed={0.85} phase={1.5} rotationSpeed={[0.1, 0.3, 0.05]}>
        <RealPizzaModel />
      </Floating>
    </>
  );
}
