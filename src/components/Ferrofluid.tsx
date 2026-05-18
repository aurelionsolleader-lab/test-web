import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShaderChunk = `
  vec3 displacedPosition(vec3 pos, float time, vec3 pointer, float sharpness) {
    vec3 p = normalize(pos);
    
    // Geometric frequency - controls number of spikes
    float f = 18.0; 
    
    // Rotate the pattern very slowly over time for a living feel
    mat3 rot = mat3(
      cos(time*0.1), 0.0, sin(time*0.1),
      0.0, 1.0, 0.0,
      -sin(time*0.1), 0.0, cos(time*0.1)
    );
    vec3 q = rot * p;
    
    // Create a perfect 3D symmetric lattice pattern (BCC-style)
    float h = cos(q.x * f) * cos(q.y * f) + 
              cos(q.y * f) * cos(q.z * f) + 
              cos(q.z * f) * cos(q.x * f);
              
    // h ranges roughly from -1.5 to 3.0. We isolate the peaks.
    // pow() controls the sharpness of the spikes
    float spike = pow(max(0.0, (h - 0.5) / 2.5), sharpness);
    
    // Pointer interaction: pull a spike towards the mouse pointer
    float distToPointer = length(p - normalize(pointer));
    float pointerSpike = exp(-distToPointer * distToPointer * 6.0) * 0.5;
    
    // Breathing/wobbling effect on the spikes
    float breath = sin(time * 3.0 + p.y * 5.0) * 0.05 + 0.95;
    
    // Combine spikes and height multiplier
    float totalSpike = (spike * 0.5 * breath) + pointerSpike;
    
    // The base shape remains a perfect sphere
    return pos + p * totalSpike;
  }
`;

interface FerrofluidProps {
  sharpness?: number;
}

export default function Ferrofluid({ sharpness = 3.0 }: FerrofluidProps = {}) {
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<any>(null);
  
  const { pointer, camera } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector3(0, 5, 0) }, // Default pointer above
    uSharpness: { value: sharpness }
  }), []);

  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uSharpness.value = sharpness;
    }
  }, [sharpness]);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Calculate world pointer intersection on an invisible sphere or plane
      // Since our camera is at [0, 2, 5], we can just project the 2D pointer to a 3D target ahead
      const vector = new THREE.Vector3(pointer.x, pointer.y, 0.5);
      vector.unproject(camera);
      vector.sub(camera.position).normalize();
      
      // Assume interaction distance ~4 units away from camera
      const target = camera.position.clone().add(vector.multiplyScalar(4));
      
      // Smoothly interpolate the uniform pointer towards the actual target
      shaderRef.current.uniforms.uPointer.value.lerp(target, 0.1);
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uPointer = uniforms.uPointer;
    shader.uniforms.uSharpness = uniforms.uSharpness;
    shaderRef.current = shader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
      uniform float uTime;
      uniform vec3 uPointer;
      uniform float uSharpness;
      ${vertexShaderChunk}
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `
      float time = uTime;
      vec3 pointer = uPointer;
      float sharpness = uSharpness;
      float eps = 0.01; 
      
      vec3 p0 = displacedPosition(position, time, pointer, sharpness);
      
      vec3 tangent1 = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
      if (length(tangent1) < 0.01) {
        tangent1 = normalize(cross(normal, vec3(1.0, 0.0, 0.0)));
      }
      vec3 tangent2 = cross(normal, tangent1);
      
      vec3 p1 = displacedPosition(position + tangent1 * eps, time, pointer, sharpness);
      vec3 p2 = displacedPosition(position + tangent2 * eps, time, pointer, sharpness);
      
      vec3 objectNormal = normalize(cross(p2 - p0, p1 - p0));
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      vec3 transformed = p0;
      `
    );
  };

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, -0.4, 0]}>
      {/* High segments for sharp spikes */}
      <sphereGeometry args={[1.2, 512, 512]} />
      <meshPhysicalMaterial
        ref={materialRef}
        onBeforeCompile={onBeforeCompile}
        color="#0a0a0a"      
        emissive="#000000"
        metalness={1.0}      
        roughness={0.05}     
        clearcoat={1.0}      
        clearcoatRoughness={0.05}
        iridescence={1.0}
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[100, 400]}
        envMapIntensity={3.0} 
        reflectivity={1.0}
      />
    </mesh>
  );
}

