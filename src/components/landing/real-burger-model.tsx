"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Measured from the uploaded model's bounding box: it isn't centered at the
// origin and is authored at a much larger scale than this scene uses, so we
// re-center and normalize it here rather than guessing in the editor.
const RAW_CENTER: [number, number, number] = [-4.97, 0.283, 6.364];
const RAW_HEIGHT = 50.0;
const TARGET_HEIGHT = 1.7; // desired on-screen height in scene units
const SCALE = TARGET_HEIGHT / RAW_HEIGHT;

export default function RealBurgerModel() {
  const { scene } = useGLTF("/models/burger.glb");

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
      <primitive
        object={cloned}
        position={[-RAW_CENTER[0], -RAW_CENTER[1], -RAW_CENTER[2]]}
      />
    </group>
  );
}

useGLTF.preload("/models/burger.glb");
