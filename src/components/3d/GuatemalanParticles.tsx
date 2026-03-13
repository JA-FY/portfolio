'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 1000;

const PARTICLE_COUNT = isMobile ? 3500 : 25000; 
const FLAG_BLUE = new THREE.Color('#91d3fa'); 
const FLAG_WHITE = new THREE.Color('#FFFFFF');

const FLAG_WIDTH = 10; 
const FLAG_HEIGHT = 6; 

const vertexShader = `
  precision mediump float;
  uniform float uTime;
  uniform float uPixelRatio;
  
  attribute vec3 aInitialPosition;
  attribute vec3 aColor;
  attribute float aSize;
  
  varying vec3 vColor;

  uniform float uIsMobile;

  void main() {
    vColor = aColor;
    vec3 pos = aInitialPosition;
    
    float movementScore = 1.0 - uIsMobile;
    pos.x += sin(uTime * 0.2 + pos.z) * 0.02 * movementScore;
    pos.y += cos(uTime * 0.1 + pos.x) * 0.02 * movementScore;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    float baseSize = 10.0 * aSize;
    gl_PointSize = baseSize * (1.0 / max(-mvPosition.z, 0.1)) * uPixelRatio;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec3 vColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha); 
  }
`;

function Particles({ scrollProgress }: { scrollProgress?: MotionValue<number> }) {
  const points = useRef<THREE.Points>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);
  const { viewport, camera } = useThree();

const [positions, colors, initialPositions, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const initPos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      let x = (Math.random() - 0.5) * FLAG_WIDTH;
      let y = (Math.random() - 0.5) * FLAG_HEIGHT;
      let z = (Math.random() - 0.5) * 0.1; 

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      initPos[i3] = x;
      initPos[i3 + 1] = y;
      initPos[i3 + 2] = z;

      const normalizedX = x / (FLAG_WIDTH / 2);
      
      const overlapJitter = 0.08; 

      const checkX = normalizedX + (Math.random() - 0.5) * overlapJitter;

      let color = FLAG_BLUE;
      if (checkX > -0.32 && checkX < 0.32) {
        color = FLAG_WHITE;
      }

      cols[i3] = color.r;
      cols[i3 + 1] = color.g;
      cols[i3 + 2] = color.b;
      
      sz[i] = Math.random() * 0.4 + 0.6;
    }
    return [pos, cols, initPos, sz];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
    uIsMobile: { value: typeof window !== 'undefined' && window.innerWidth < 1000 ? 1.0 : 0.0 },
  }), []);

  useFrame((state, delta) => {
    const { clock } = state;
    
    material.current.uniforms.uTime.value = clock.getElapsedTime() % 10000;
    
    material.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);

    if (scrollProgress) {
      const rawScroll = scrollProgress.get(); 
      const scroll = Math.max(0, Math.min(1, rawScroll));
      
      const isMobileDevice = window.innerWidth < 1000;
      material.current.uniforms.uIsMobile.value = isMobileDevice ? 1.0 : 0.0;
      let targetZ = 8.0;
      
      if (!isMobileDevice) {
        targetZ = THREE.MathUtils.lerp(8.0, -3.0, scroll);
        if (points.current) {
          points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, 0, 5.0 * delta);
          points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, 0, 5.0 * delta);
        }
      } else {
        targetZ = 8.0;
        
        if (points.current) {
          points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, 0, 5.0 * delta);
          points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, 0, 5.0 * delta);
        }
      }
      
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 5.0 * delta);
    }
  });

  const responsiveScale = Math.min(1, viewport.width / (FLAG_WIDTH + 1));

  return (
    <points ref={points} scale={[responsiveScale, responsiveScale, responsiveScale]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aInitialPosition" count={PARTICLE_COUNT} array={initialPositions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface Props {
  scrollProgress?: MotionValue<number>;
}

export default function GuatemalanParticles({ scrollProgress }: Props) {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }} 
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <Particles scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
