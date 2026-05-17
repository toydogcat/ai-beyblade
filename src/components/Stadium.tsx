import { RigidBody, CylinderCollider } from "@react-three/rapier";
import * as THREE from "three";

export function Stadium() {
  const radius = 10;
  const bottomRadius = 5.0; // Steeper sloped bowl (was 7.5)
  const height = 4.5;       // Much deeper arena (was 2.5)
  const segments = 64;

  return (
    <group>
      {/* Visual Bowl */}
      <mesh receiveShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, bottomRadius, height, segments, 1, true]} />
        <meshStandardMaterial 
          color="#22252a" 
          metalness={0.9} 
          roughness={0.15} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Solid Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[bottomRadius, segments]} />
        <meshStandardMaterial color="#111316" roughness={0.4} metalness={0.85} />
      </mesh>

      {/* Holographic Energy Forcefield Barrier (Visual) */}
      <mesh position={[0, height + 3.0, 0]}>
        <cylinderGeometry args={[radius, radius, 6.0, segments, 1, true]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={2.5} 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle Laser Forcefield Grid Lines */}
      <mesh position={[0, height + 3.0, 0]}>
        <cylinderGeometry args={[radius + 0.02, radius + 0.02, 6.0, 16, 6, true]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.25} 
          wireframe 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Physics World: Deep Bowl & Forcefield Boundaries */}
      <group>
        {/* Solid Ground Base */}
        <RigidBody type="fixed">
          <CylinderCollider args={[0.1, bottomRadius]} position={[0, -0.1, 0]} friction={0.05} restitution={0.85} />
        </RigidBody>
        
        {/* Steep Sloped Walls (Trimesh) */}
        <RigidBody type="fixed" colliders="trimesh" friction={0.05} restitution={0.85}>
          <mesh visible={false} position={[0, height / 2, 0]}>
            <cylinderGeometry args={[radius, bottomRadius, height, segments, 1, true]} />
          </mesh>
        </RigidBody>

        {/* Tall Laser Forcefield Boundary (Hollow Trimesh Wall) */}
        <RigidBody type="fixed" colliders="trimesh" friction={0.1} restitution={0.9}>
           <mesh visible={false} position={[0, height + 3.0, 0]}>
              <cylinderGeometry args={[radius, radius, 6.0, segments, 1, true]} />
           </mesh>
        </RigidBody>
      </group>

      {/* Low Friction Center Zone Visual */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.6} transparent opacity={0.12} />
      </mesh>

      {/* X-Line Trigger Zone placed perfectly on the flat bottom floor */}
      <XLine radius={bottomRadius * 0.85} />
      
      {/* Visual background grid */}
      <gridHelper args={[100, 50, "#16191f", "#0c0d10"]} position={[0, -0.05, 0]} />
    </group>
  );
}

function XLine({ radius }: { radius: number }) {
  return (
    <group>
      <RigidBody
        type="fixed"
        sensor
        name="X-Line"
      >
        <CylinderCollider args={[0.2, radius + 0.2]} />
      </RigidBody>
      
      {/* Visual X-Line Ring on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius - 0.12, radius + 0.12, 64]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={3.5} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
