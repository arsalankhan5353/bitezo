"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";
import RealBurgerModel from "./real-burger-model";
import FloatingProps from "./floating-props";

function MouseCamera() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.35, 0));

  useFrame(() => {
    // camera drifts toward the cursor with easing — never snaps
    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.35 + 0.1;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY + 0.5 - camera.position.y) * 0.04;
    camera.lookAt(target.current);
  });

  return null;
}

/** Procedural radial-gradient glow, additive-blended so Bloom picks it up. */
function GlowHalo() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,140,50,0.9)");
    grad.addColorStop(0.4, "rgba(255,106,0,0.45)");
    grad.addColorStop(1, "rgba(255,106,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh position={[0, 0.5, -1.6]}>
      <planeGeometry args={[5.5, 5.5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function RotatingBurger() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // slow continuous auto-spin
    const autoSpin = t * 0.18;
    // mouse-driven tilt, eased toward target rather than snapping
    const targetTiltX = pointer.y * 0.18;
    const targetTiltZ = -pointer.x * 0.16;

    g.rotation.y = autoSpin;
    g.rotation.x += (targetTiltX - g.rotation.x) * 0.05;
    g.rotation.z += (targetTiltZ - g.rotation.z) * 0.05;

    // slow float up/down, base position raised higher in frame
    g.position.y = 0.55 + Math.sin(t * 0.6) * 0.16;
  });

  return (
    <group ref={group} scale={1.05}>
      <RealBurgerModel />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.6, 5.2], fov: 42 }}
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
      <pointLight position={[-3, -0.5, 2.5]} intensity={0.9} color="#ff6a00" />
      <pointLight position={[0, 2.2, -2.5]} intensity={0.5} color="#ffc857" />
      <pointLight position={[0, 0.5, -1]} intensity={1.6} color="#ff7a1f" distance={5} />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.4} />
        <GlowHalo />
        <RotatingBurger />
        <FloatingProps />
        <EffectComposer>
          <Bloom intensity={0.85} luminanceThreshold={0.25} luminanceSmoothing={0.85} mipmapBlur />
          <DepthOfField focusDistance={0.015} focalLength={0.045} bokehScale={3} />
        </EffectComposer>
      </Suspense>

      <MouseCamera />
    </Canvas>
  );
}
