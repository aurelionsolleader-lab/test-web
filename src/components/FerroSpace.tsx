import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Ferrofluid Shader
const FerroMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uIntensity: { value: 0.5 },
    uColor: { value: new THREE.Color('#050510') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uMouse;
    uniform float uIntensity;

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0/6.0;
      vec3 x2 = x0 - i2 + 1.0/3.0;
      vec3 x3 = x0 - 1.0 + 1.0/2.0;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      
      float noise = snoise(position * 1.5 + uTime * 0.2);
      float dist = distance(uMouse, position);
      float spike = 0.0;
      
      // More intense spikes near mouse
      if(dist < 3.0) {
        float falloff = pow(1.0 - dist/3.0, 2.5);
        spike = falloff * noise * uIntensity * 2.0;
      }
      
      vec3 newPosition = position + normal * spike;
      vPosition = newPosition;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uMouse;
    uniform vec3 uColor;

    void main() {
      float dist = distance(uMouse, vPosition);
      vec3 base = uColor;
      vec3 highlight = vec3(0.2, 0.6, 1.0);
      
      float intensity = 0.0;
      if(dist < 3.0) {
        intensity = pow(1.0 - dist/3.0, 2.0);
      }
      
      vec3 col = mix(base, highlight, intensity * 0.3);
      float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
      col += highlight * pow(rim, 6.0) * 0.4;
      
      gl_FragColor = vec4(col, 1.0);
    }
  `
};

const FerroOrb = ({ activeSection }: { activeSection: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    const { clock, mouse, camera } = state;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      materialRef.current.uniforms.uMouse.value.lerp(pos, 0.1);
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
      
      // Reactive animation based on section
      const targetScaleNum = activeSection === 0 ? 1 : (activeSection === 1 ? 0.8 : 1.2);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScaleNum, targetScaleNum, targetScaleNum), 0.05);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <shaderMaterial
          ref={materialRef}
          args={[FerroMaterial]}
          transparent
        />
      </mesh>
      <ContactShadows opacity={0.4} scale={10} blur={2} far={10} resolution={256} color="#000000" position={[0, -2, 0]} />
    </group>
  );
};

const CameraRig = ({ activeSection }: { activeSection: number }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeSection === 0) {
      targetPos.current.set(0, 0, 10);
      targetLook.current.set(0, 0, 0);
    } else if (activeSection === 1) {
      targetPos.current.set(-5, 2, 5);
      targetLook.current.set(0, 0, 0);
    } else if (activeSection === 2) {
      targetPos.current.set(4, -2, 4);
      targetLook.current.set(0, 0, 0);
    }
  }, [activeSection]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.03);
    camera.lookAt(targetLook.current);
  });

  return null;
};

const FerroSpace = ({ activeSection, theme = 'dark' }: { activeSection: number, theme?: 'dark' | 'light' }) => {
  return (
    <div className={`w-full h-full ${theme === 'dark' ? 'bg-[#020205]' : 'bg-[#f0f0f5]'}`}>
      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <CameraRig activeSection={activeSection} />
        
        {theme === 'dark' && <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />}
        
        <ambientLight intensity={theme === 'dark' ? 0.2 : 0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={theme === 'dark' ? 1500 : 2000} castShadow />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <FerroOrb activeSection={activeSection} />
        </Float>

        <Environment preset="night" />
        <OrbitControls enablePan={false} enableZoom={false} makeDefault />
      </Canvas>
    </div>
  );
};

export default FerroSpace;
