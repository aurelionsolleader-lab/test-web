import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Environment, Stars as DreiStars } from '@react-three/drei';
import * as THREE from 'three';

/**
 * FERROFLOW - Magnetically Responsive Shader
 * Features: 1/r^2 Force calculation, Spikid spikes, and Mode-based movement
 */

const ferroShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uIntensity: { value: 1.0 },
    uColor: { value: new THREE.Color("#111115") },
    uMode: { value: 0.0 } // 0: Core, 1: Prisma, 2: Orbital
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uMouse;
    uniform float uIntensity;
    uniform float uMode;

    // Classic 3D Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
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
      vec4 sig = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= sig.x; p1 *= sig.y; p2 *= sig.z; p3 *= sig.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      
      vec3 pos = position;
      float noise = snoise(pos * 2.0 + uTime * 0.5);
      
      // Magnet Interaction: B proportional to 1/r^2
      float dist = distance(uMouse, pos);
      float magnetForce = 1.0 / (0.5 + dist * dist);
      magnetForce = clamp(magnetForce, 0.0, 5.0) * uIntensity;
      
      // Spikid (Spiky) spikes chasing mouse
      float spikes = snoise(pos * 15.0 + uTime) * 0.2 * magnetForce;
      
      // Mode Logic implementation
      if(uMode > 1.5) { // Orbital: Vortex / Swirl
        float angle = uTime * 2.0 + pos.y * 3.0;
        pos.xz += vec2(sin(angle), cos(angle)) * 0.1 * magnetForce;
        pos += normal * spikes;
      } else if (uMode > 0.5) { // Prisma: Geometric refinement
        pos += normal * spikes * 0.5;
        pos += normal * (noise * 0.1);
      } else { // Core: Pure Spikid spikes
        pos += normal * spikes;
      }
      
      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;
      vPosition = modelPosition.xyz;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uColor;
    uniform float uIntensity;

    void main() {
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float light = max(dot(vNormal, lightDir), 0.0);
      vec3 finalColor = mix(vec3(0.02, 0.02, 0.04), uColor, light * 0.2);
      
      // Specular highlight for metallic feeling
      float shine = pow(max(dot(vNormal, normalize(vec3(0.0, 0.0, 1.0))), 0.0), 32.0);
      finalColor += shine * vec3(0.4, 0.5, 0.8) * uIntensity;

      // Rim light
      float rim = 1.0 - max(dot(vNormal, normalize(vec3(0.0, 0.0, 1.0))), 0.0);
      finalColor += pow(rim, 4.0) * vec3(0.2, 0.4, 1.0) * 0.3;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const FerroOrb = ({ mode = 0 }: { mode?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    const { clock, mouse, camera } = state;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      
      // Project mouse to world space
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const mouseWorldPos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      materialRef.current.uniforms.uMouse.value.lerp(mouseWorldPos, 0.08);
      materialRef.current.uniforms.uMode.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uMode.value, mode, 0.1);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        {...ferroShader}
        transparent
      />
    </mesh>
  );
};

const FerroSpace = ({ 
  theme = 'dark',
  mode = 0 
}: { 
  theme?: 'dark' | 'light',
  mode?: number 
}) => {
  return (
    <div className={`w-full h-full relative ${theme === 'dark' ? 'bg-[#020205]' : 'bg-[#f0f0f5]'}`}>
      <Canvas 
        dpr={[1, 1.5]} 
        shadows 
        frameloop="demand" 
        camera={{ position: [0, 0, 8], fov: 45 }}
        onCreated={(state) => {
          const trigger = () => state.setFrameloop('always');
          const stop = () => state.setFrameloop('demand');
          state.gl.domElement.addEventListener('pointermove', trigger);
          state.gl.domElement.addEventListener('pointerout', stop);
          // Also trigger on static frames initially
          setTimeout(trigger, 100);
          setTimeout(stop, 2000);
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        
        {theme === 'dark' && <DreiStars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />}
        
        <ambientLight intensity={theme === 'dark' ? 0.2 : 0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={theme === 'dark' ? 500 : 1000} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={theme === 'dark' ? 200 : 400} color="#2997ff" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <FerroOrb mode={mode} />
        </Float>

        <Environment preset="night" />
        <OrbitControls enablePan={false} enableZoom={false} makeDefault />
      </Canvas>
    </div>
  );
};

export default FerroSpace;
