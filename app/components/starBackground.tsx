"use client";

import React, { useState, useRef, Suspense, FC } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { Points as PointsImpl } from "three";
import { JSX } from "react/jsx-runtime";

// Helper to create random sphere positions
const createRandomSphere = (count: number, radius: number): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Generate random unit vector inside a sphere
    let x: number, y: number, z: number, dsq: number;
    do {
      x = (Math.random() - 0.5) * 2;
      y = (Math.random() - 0.5) * 2;
      z = (Math.random() - 0.5) * 2;
      dsq = x * x + y * y + z * z;
    } while (dsq > 1);

    const scale = radius * Math.pow(Math.random(), 1 / 3);
    positions[i3] = x * scale;
    positions[i3 + 1] = y * scale;
    positions[i3 + 2] = z * scale;
  }

  return positions;
};

// Props type for StarBackground if you expect to pass any mesh/group props
type StarBackgroundProps = JSX.IntrinsicElements["group"];

const StarBackground: FC<StarBackgroundProps> = (props) => {
  const ref = useRef<PointsImpl>(null);
  const [sphere] = useState<Float32Array>(() => createRandomSphere(1500, 1.2));

  useFrame((_, delta: number) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]} {...props}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas: FC = () => (
  <div className="w-full h-auto fixed inset-0 z-[10]">
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;
