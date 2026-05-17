import { Suspense, useState, useRef } from "react";
import { Physics } from "@react-three/rapier";
import { OrbitControls, PerspectiveCamera, Environment, Stars } from "@react-three/drei";
import { Stadium } from "./Stadium";
import { Beyblade } from "./Beyblade";
import { useFrame } from "@react-three/fiber";

interface ExperienceProps {
  mode: "cinematic" | "sim";
  onMatchEnd: (winner: "p1" | "p2" | "draw") => void;
}

export function Experience({ mode, onMatchEnd }: ExperienceProps) {
  const [timeScale, setTimeScale] = useState(1);
  const p1Ref = useRef<any>(null);
  const p2Ref = useRef<any>(null);
  const matchEnded = useRef(false);

  useFrame((state, delta) => {
    if (mode !== "cinematic") {
      if (timeScale !== 1) setTimeScale(1);
      return;
    }

    // Cinematic slow motion logic
    // If Beyblades are very close, slow down time
    if (p1Ref.current && p2Ref.current) {
      const p1Pos = p1Ref.current.translation();
      const p2Pos = p2Ref.current.translation();
      const distSq = 
        Math.pow(p1Pos.x - p2Pos.x, 2) + 
        Math.pow(p1Pos.z - p2Pos.z, 2);

      // Slow motion threshold (dist < 3 -> distSq < 9)
      if (distSq < 16) {
        // More stable time scaling
        const targetScale = Math.max(0.2, Math.sqrt(distSq) / 4);
        setTimeScale(prev => prev + (targetScale - prev) * 0.05);
      } else {
        setTimeScale(prev => prev + (1 - prev) * 0.05);
      }

      // Out of bounds check (radius = 10, so 15 is safe boundary)
      if (Math.abs(p1Pos.x) > 15 || Math.abs(p1Pos.z) > 15 || p1Pos.y < -2) {
        checkWinner("p1", "stopped");
      }
      if (Math.abs(p2Pos.x) > 15 || Math.abs(p2Pos.z) > 15 || p2Pos.y < -2) {
        checkWinner("p2", "stopped");
      }
    }
  });

  const checkWinner = (id: string, state: "burst" | "stopped") => {
    if (matchEnded.current) return;
    
    matchEnded.current = true;
    const winner = id === "p1" ? "p2" : "p1";
    onMatchEnd(winner);
  };

  return (
    <Suspense fallback={null}>
      <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={40} />
      <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2.1} />
      
      <ambientLight intensity={1.5} />
      <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={5000} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={2000} color="#0088ff" />
      
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <Physics 
        gravity={[0, -20, 0]} 
        debug={false}
        timeStep={1/60 * timeScale}
      >
        <Stadium />
        
        {/* Spawn 2 Beyblades with initial inward velocity */}
        <Beyblade 
          id="p1"
          position={[-4, 1.5, 0]} 
          color="#0066ff" 
          initialSpin={180} 
          initialVelocity={[5, 0, 2]}
          onStateChange={(s) => s !== "active" && checkWinner("p1", s)}
          apiRef={p1Ref}
        />
        <Beyblade 
          id="p2"
          position={[4, 1.5, 1]} 
          color="#ff6600" 
          initialSpin={-180} 
          initialVelocity={[-5, 0, -2]}
          onStateChange={(s) => s !== "active" && checkWinner("p2", s)}
          apiRef={p2Ref}
        />
      </Physics>
      
      <fog attach="fog" args={["#0A0B0D", 20, 100]} />
    </Suspense>
  );
}
