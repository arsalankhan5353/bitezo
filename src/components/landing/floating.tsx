"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type FloatingProps = {
  children: React.ReactNode;
  position: [number, number, number];
  orbitRadius?: number;
  orbitSpeed?: number;
  bobSpeed?: number;
  bobHeight?: number;
  rotationSpeed?: [number, number, number];
  phase?: number;
};

/**
 * Wraps a mesh with independent floating motion: a slow orbital drift around
 * its base position, a vertical bob, and continuous self-rotation. Each
 * instance gets its own phase offset so nothing moves in sync — this is what
 * "independent floating animation" actually means in a real R3F scene.
 */
export default function Floating({
  children,
  position,
  orbitRadius = 0.3,
  orbitSpeed = 0.3,
  bobSpeed = 1,
  bobHeight = 0.15,
  rotationSpeed = [0.2, 0.4, 0.1],
  phase = 0,
}: FloatingProps) {
  const group = useRef<THREE.Group>(null);
  const [bx, by, bz] = position;

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime + phase;
    g.position.x = bx + Math.sin(t * orbitSpeed) * orbitRadius;
    g.position.z = bz + Math.cos(t * orbitSpeed) * orbitRadius;
    g.position.y = by + Math.sin(t * bobSpeed) * bobHeight;
    g.rotation.x = t * rotationSpeed[0];
    g.rotation.y = t * rotationSpeed[1];
    g.rotation.z = t * rotationSpeed[2];
  });

  return <group ref={group}>{children}</group>;
}
