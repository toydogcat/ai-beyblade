import { RigidBody, RapierRigidBody, CylinderCollider, useRapier } from "@react-three/rapier";
import { useRef, useState, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface BeybladeConfig {
  mass: number;
  restitution: number;
  friction: number;
}

interface BeybladeProps {
  id: string;
  position: [number, number, number];
  color: string;
  initialSpin?: number;
  initialVelocity?: [number, number, number];
  onStateChange?: (state: "active" | "burst" | "stopped") => void;
  apiRef?: React.RefObject<RapierRigidBody>;
  config: BeybladeConfig;
}

export function Beyblade({ id, position, color, initialSpin = 80, initialVelocity = [0, 0, 0], onStateChange, apiRef, config }: BeybladeProps) {
  const rb = useRef<RapierRigidBody>(null);
  const layer1 = useRef<RapierRigidBody>(null); // Blade
  const layer2 = useRef<RapierRigidBody>(null); // Ratchet
  const layer3 = useRef<RapierRigidBody>(null); // Bit
  
  const [burst, setBurst] = useState(false);
  const [inXLine, setInXLine] = useState(false);
  const { rapier, world } = useRapier();

  // Expose RB to parent
  useImperativeHandle(apiRef, () => rb.current!);

  // Burst threshold (Impact force)
  const BURST_THRESHOLD = 60; // Increased for more drama
  
  useFrame((state, delta) => {
    if (!rb.current || burst) return;

    const body = rb.current;
    const angVel = body.angvel();
    
    // 1. Gyroscopic Physics: Try to keep the Y-axis upright
    const rotation = body.rotation();
    const up = new THREE.Vector3(0, 1, 0);
    const bodyUp = new THREE.Vector3(0, 1, 0).applyQuaternion(new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
    
    const tiltAxis = new THREE.Vector3().crossVectors(bodyUp, up);
    const tiltAmount = bodyUp.angleTo(up);
    const spinMagnitude = Math.abs(angVel.y);
    
    // Low RPM failure
    if (spinMagnitude < 10 && onStateChange) {
      onStateChange("stopped");
    }

    if (tiltAmount > 0.05) {
      // Correcting torque: perpendicular to tilt and spin
      const correctionTorque = tiltAxis.multiplyScalar(tiltAmount * spinMagnitude * 0.08);
      body.applyTorqueImpulse(correctionTorque, true);
    }

    // Centripetal force to keep them in center-ish if they are too far
    const pos = body.translation();
    const distFromCenterSq = pos.x * pos.x + pos.z * pos.z;
    if (distFromCenterSq > 64) { // dist > 8
      const dirToCenter = new THREE.Vector3(-pos.x, 0, -pos.z).normalize();
      body.applyImpulse(dirToCenter.multiplyScalar(0.2), true);
    }

    // 2. X-Dash Logic
    const dist = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    const isOnXLine = inXLine && dist >= 8.2 && dist <= 9.6;

    if (isOnXLine && spinMagnitude > 60) {
      // Tangential direction (Clockwise spin DASH)
      const tangent = new THREE.Vector3(-pos.z, 0, pos.x).normalize();
      // Apply linear impulse for speed
      body.applyImpulse(tangent.multiplyScalar(0.6), true);

      // Reduce spin (rotational energy conversion)
      body.setAngvel({ x: angVel.x, y: angVel.y * 0.98, z: angVel.z }, true);
    }
    
    // 3. Friction/Damping - Gradual loss of energy
    body.setAngularDamping(0.25);
    body.setLinearDamping(0.15);
  });

  const handleCollision = (payload: any) => {
    if (burst) return;

    const impactForce = payload.totalForceMagnitude;
    
    // Reduce angular velocity and linear velocity to simulate heavy energy loss on clashes
    if (rb.current) {
      const body = rb.current;
      const currentAngVel = body.angvel();
      const currentLinVel = body.linvel();
      
      // Mildly damp rotational and linear velocity on impacts (lose 15% velocity)
      body.setAngvel({ x: currentAngVel.x * 0.85, y: currentAngVel.y * 0.85, z: currentAngVel.z * 0.85 }, true);
      body.setLinvel({ x: currentLinVel.x * 0.85, y: currentLinVel.y * 0.85, z: currentLinVel.z * 0.85 }, true);
    }
    
    if (impactForce > BURST_THRESHOLD) {
      triggerBurst();
    }
  };

  const triggerBurst = () => {
    setBurst(true);
    if (onStateChange) onStateChange("burst");
  };

  const handleIntersection = (payload: any) => {
    if (payload.other.rigidBodyObject?.name === "X-Line") setInXLine(true);
  };

  const handleExit = (payload: any) => {
    if (payload.other.rigidBodyObject?.name === "X-Line") setInXLine(false);
  };

  return (
    <group>
      {/* Main Assembly - Active until burst */}
      {!burst && (
        <RigidBody
          ref={rb}
          position={position}
          colliders={false}
          onCollisionEnter={handleCollision}
          onIntersectionEnter={handleIntersection}
          onIntersectionExit={handleExit}
          angularVelocity={[0, initialSpin, 0]}
          linearVelocity={initialVelocity}
          friction={0.2}
          restitution={0.1}
          linearDamping={0.15}
          angularDamping={0.25}
          canSleep={false}
          ccd={true}
          name={`beyblade-${id}`}
        >
          {/* Visuals */}
          <group>
            {/* Bit */}
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.05, 0.2, 0.2, 8]} />
              <meshStandardMaterial color="#444" metalness={1} roughness={0.1} />
            </mesh>
            <CylinderCollider args={[0.1, 0.1]} position={[0, -0.4, 0]} friction={config.friction} restitution={0.1} />

            {/* Ratchet */}
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.6, 0.5, 0.3, 16]} />
              <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
            </mesh>
            <CylinderCollider args={[0.15, 0.6]} position={[0, -0.1, 0]} friction={0.1} restitution={0.1} />

            {/* Blade */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
              <meshStandardMaterial color="#ddd" metalness={1} roughness={0.05} />
              {[0, 1, 2, 3].map((i) => (
                <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
                   <boxGeometry args={[1.8, 0.1, 0.3]} />
                   <meshStandardMaterial color="#888" metalness={1} />
                </mesh>
              ))}
            </mesh>
            <CylinderCollider args={[0.1, 0.9]} position={[0, 0.2, 0]} friction={0.1} restitution={0.1} />

            {/* Mass Center Offset (Top Heavy) */}
            <CylinderCollider args={[0.05, 0.1]} position={[0, 0.35, 0]} mass={config.mass} />
          </group>
        </RigidBody>
      )}

      {/* Burst Pieces - Only rendered after burst */}
      {burst && rb.current && (
        <group position={[rb.current.translation().x, rb.current.translation().y, rb.current.translation().z]}>
          {/* Blade Fragment */}
          <RigidBody position={[0, 0.5, 0]} angularVelocity={[Math.random() * 10, Math.random() * 10, Math.random() * 10]} linearVelocity={[Math.random() * 5 - 2.5, 5, Math.random() * 5 - 2.5]}>
             <mesh>
                <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
                <meshStandardMaterial color="#ddd" metalness={1} />
             </mesh>
             <CylinderCollider args={[0.1, 0.8]} />
          </RigidBody>
          
          {/* Ratchet Fragment */}
          <RigidBody position={[0, 0.2, 0]} angularVelocity={[Math.random() * 10, Math.random() * 10, Math.random() * 10]} linearVelocity={[Math.random() * 5 - 2.5, 4, Math.random() * 5 - 2.5]}>
             <mesh>
              <cylinderGeometry args={[0.6, 0.5, 0.3, 16]} />
              <meshStandardMaterial color={color} metalness={0.5} />
             </mesh>
             <CylinderCollider args={[0.15, 0.6]} />
          </RigidBody>

          {/* Bit Fragment */}
          <RigidBody position={[0, 0, 0]} angularVelocity={[Math.random() * 10, Math.random() * 10, Math.random() * 10]} linearVelocity={[Math.random() * 2 - 1, 3, Math.random() * 2 - 1]}>
             <mesh>
              <cylinderGeometry args={[0.05, 0.2, 0.2, 8]} />
              <meshStandardMaterial color="#444" metalness={1} />
             </mesh>
             <CylinderCollider args={[0.1, 0.1]} />
          </RigidBody>
        </group>
      )}
    </group>
  );
}
