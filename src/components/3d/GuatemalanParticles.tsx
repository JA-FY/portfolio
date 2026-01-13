'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 90000;
const FLAG_BLUE = new THREE.Color('#63C5FF'); 
const FLAG_WHITE = new THREE.Color('#FFFFFF');
const MOUSE_INFLUENCE_RADIUS = 0.6; 
const ROTATION_SPEED = 2.5; 

const FLAG_WIDTH = 12; 
const FLAG_HEIGHT = 7;

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uSpeed;
  
  attribute vec3 aInitialPosition;
  attribute vec3 aColor;
  attribute float aSize;
  
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec3 pos = aInitialPosition;
    
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    
    if (dist < uRadius) {
      float angle = atan(d.y, d.x);
      float strength = (1.0 - dist / uRadius) * uSpeed;
      angle += strength;
      
      pos.x = uMouse.x + cos(angle) * dist;
      pos.y = uMouse.y + sin(angle) * dist;
    }
    
    pos.x += sin(uTime * 0.2 + pos.z) * 0.05;
    pos.y += cos(uTime * 0.1 + pos.x) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    gl_PointSize = (6.0 * aSize) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    gl_FragColor = vec4(vColor * 1.2, alpha);
  }
`;


function Particles() {
  const points = useRef<THREE.Points>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);
  
  const { viewport } = useThree();

  const [positions, colors, initialPositions, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const initPos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      let x = (Math.random() - 0.5) * FLAG_WIDTH;
      let y = (Math.random() - 0.5) * FLAG_HEIGHT;
      let z = (Math.random() - 0.5) * 0.5; 

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      initPos[i3] = x;
      initPos[i3 + 1] = y;
      initPos[i3 + 2] = z;

      const normalizedX = x / (FLAG_WIDTH / 2);
      let color = FLAG_BLUE;
      if (normalizedX > -0.33 && normalizedX < 0.33) {
        color = FLAG_WHITE;
      }

      cols[i3] = color.r;
      cols[i3 + 1] = color.g;
      cols[i3 + 2] = color.b;
      sz[i] = Math.random() * 1.0 + 0.5;
    }
    return [pos, cols, initPos, sz];
  }, []); 

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(9999, 9999) },
    uRadius: { value: MOUSE_INFLUENCE_RADIUS },
    uSpeed: { value: ROTATION_SPEED },
  }), []);

  useFrame((state) => {
    const { clock, pointer } = state;
    material.current.uniforms.uTime.value = clock.getElapsedTime() % 10000;
    
    material.current.uniforms.uMouse.value.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2
    );
  });

  const responsiveScale = Math.min(1, viewport.width / (FLAG_WIDTH + 1));

  return (
    <points ref={points} scale={[responsiveScale, responsiveScale, responsiveScale]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aInitialPosition" count={PARTICLE_COUNT} array={initialPositions} itemSize={3} />
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

export default function GuatemalanParticles() {
  return (
    <div className="w-full h-full bg-neutral-950">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
