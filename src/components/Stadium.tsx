import { RigidBody, CuboidCollider, CylinderCollider } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three";

export function Stadium() {
  const radius = 10;
  const height = 2.5;
  const segments = 64;

  return (
    <group>
      {/* Visual Bowl */}
      <mesh receiveShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 0.75, height, segments, 1, true]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.9} 
          roughness={0.1} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Solid Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[radius * 0.75, segments]} />
        <meshStandardMaterial color="#111" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Physics World: Continuous Bowl */}
      <group>
        {/* Solid Ground Base */}
        <RigidBody type="fixed">
          <CylinderCollider args={[0.1, radius * 0.75]} position={[0, -0.1, 0]} friction={0.05} restitution={0.8} />
        </RigidBody>
        
        {/* Sloped Walls (Trimesh) */}
        <RigidBody type="fixed" colliders="trimesh" friction={0.05} restitution={0.8}>
          <mesh visible={false} position={[0, height / 2, 0]}>
            <cylinderGeometry args={[radius, radius * 0.75, height, segments, 1, true]} />
          </mesh>
        </RigidBody>

        {/* Outer Guard Rail (Invisible Wall) */}
        <RigidBody type="fixed" colliders="trimesh">
           <mesh visible={false} position={[0, height + 1, 0]}>
              <cylinderGeometry args={[radius + 0.5, radius, 5, segments, 1, true]} />
           </mesh>
        </RigidBody>
      </group>

      {/* Low Friction Center Zone Visual */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.1} />
      </mesh>

      {/* X-Line Trigger Zone */}
      <XLine radius={radius * 0.88} />
      
      {/* Visual background grid */}
      <gridHelper args={[100, 50, "#111", "#080808"]} position={[0, -0.05, 0]} />
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
        onIntersectionEnter={(payload) => {
          // Logic handled in Beyblade component using name check
          console.log("Entered X-Line");
        }}
      >
        <CylinderCollider args={[0.5, radius + 0.5]} />
      </RigidBody>
      
      {/* Visual X-Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[radius - 0.1, radius + 0.1, 64]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={4} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
