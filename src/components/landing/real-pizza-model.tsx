"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RAW_CENTER: [number, number, number] = [2.306, -0.032, 0.026];
const RAW_WIDTH = 6.613;
const TARGET_WIDTH = 0.55;
const SCALE = TARGET_WIDTH / RAW_WIDTH;

export default function RealPizzaModel() {
  const { scene } = useGLTF("/models/pizza.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [cloned]);

  return (
    <group scale={SCALE}>
      <primitive object={cloned} position={[-RAW_CENTER[0], -RAW_CENTER[1], -RAW_CENTER[2]]} />
    </group>
  );
}

useGLTF.preload("/models/pizza.glb");
