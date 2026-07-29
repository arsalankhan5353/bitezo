"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";
import BurgerModel from "./burger-model";
import FloatingProps from "./floating-props";

function MouseCamera() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // camera drifts toward the cursor with easing — never snaps
    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.35 + 0.1;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY + 0.2 - camera.position.y) * 0.04;
    camera.lookAt(target.current);
  });

  return null;
}

function RotatingBurger() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    // slow continuous rotation + gentle bob, independent of mouse tilt
    g.rotation.y = state.clock.elapsedTime * 0.25;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
  });
  return (
    <group ref={group} scale={1.35}>
      <BurgerModel />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.3, 5.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050302"]} />
      <fog attach="fog" args={["#050302", 6, 12]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.4}
        color="#ff8a3d"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#ff6a00" />
      <pointLight position={[0, 2, -3]} intensity={0.4} color="#ffc857" />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.4} />
        <RotatingBurger />
        <FloatingProps />
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
          <DepthOfField focusDistance={0.015} focalLength={0.04} bokehScale={2.5} />
        </EffectComposer>
      </Suspense>

      <MouseCamera />
    </Canvas>
  );
}
