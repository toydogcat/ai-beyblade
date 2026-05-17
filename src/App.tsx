/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Zap, Shield, Cpu, Activity, Gauge } from "lucide-react";

export default function App() {
  const [gameId, setGameId] = useState(0);
  const [mode, setMode] = useState<"cinematic" | "sim">("cinematic");
  const [stats, setStats] = useState({ p1Wins: 0, p2Wins: 0, draws: 0 });

  const resetGame = () => {
    setGameId((prev) => prev + 1);
  };

  const toggleMode = () => {
    setMode(prev => prev === "cinematic" ? "sim" : "cinematic");
    resetGame();
  };

  return (
    <div className="w-full h-screen bg-[#0A0B0D] text-gray-100 font-sans flex flex-col overflow-hidden select-none">
      {/* Header Navigation */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0D0F12] shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-orange-600 rounded-sm rotate-45 flex items-center justify-center cursor-pointer" onClick={resetGame}>
            <span className="text-black font-black -rotate-45 text-lg">B</span>
          </div>
          <h1 className="text-xl font-bold tracking-tighter">
            BEYBLADE <span className="text-orange-500">DIGITAL-X</span>
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          <button 
            onClick={() => setMode("cinematic")}
            className={`transition-colors flex flex-col items-center ${mode === "cinematic" ? "text-orange-500" : "hover:text-white"}`}
          >
            <span>Lab / Physics</span>
            {mode === "cinematic" && <motion.div layoutId="underline" className="h-[2px] w-full bg-orange-500 mt-1" />}
          </button>
          <button 
            onClick={() => setMode("sim")}
            className={`transition-colors flex flex-col items-center ${mode === "sim" ? "text-blue-500" : "hover:text-white"}`}
          >
            <span>Statistics / Match</span>
            {mode === "sim" && <motion.div layoutId="underline" className="h-[2px] w-full bg-blue-500 mt-1" />}
          </button>
          <a href="#" className="hover:text-white transition-colors">Stadium Config</a>
          <a href="#" className="hover:text-white transition-colors">Telemetry</a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase">Engine Status</div>
            <div className="text-xs text-green-400 font-mono">
              {mode === "cinematic" ? "RAPIER_3D: CINEMATIC" : "RAPIER_3D: SIM_MODE"}
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
          />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Configuration */}
        <aside className="hidden lg:flex w-72 border-r border-white/10 p-6 flex-col gap-6 bg-[#0D0F12]/50 z-10">
          <section>
            <h3 className="text-[10px] text-gray-500 uppercase font-bold mb-4 tracking-[0.2em]">Top Configuration</h3>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg group hover:border-orange-500/50 transition-colors">
                <label className="text-[10px] text-orange-500 block mb-1 font-bold tracking-widest uppercase">Blade Mass</label>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono">5.2 kg</span>
                  <span className="text-[10px] text-gray-400">Tempest</span>
                </div>
                <div className="h-1 bg-white/10 mt-2 w-full rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg group hover:border-blue-500/50 transition-colors">
                <label className="text-[10px] text-blue-400 block mb-1 font-bold tracking-widest uppercase">Ratchet Height</label>
                <div className="text-sm font-medium">3-60 High Profile</div>
                <div className="h-1 bg-white/10 mt-2 w-full rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} className="h-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg group hover:border-purple-500/50 transition-colors">
                <label className="text-[10px] text-purple-400 block mb-1 font-bold tracking-widest uppercase">Bit Friction</label>
                <div className="text-sm font-medium">Flat / High Speed</div>
                <div className="h-1 bg-white/10 mt-2 w-full rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} className="h-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.4)]" />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-auto">
            {mode === "sim" && (
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4">
                <h4 className="text-[10px] font-bold text-blue-400 mb-3 uppercase tracking-widest">Match Records</h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">P1 Blue Wins:</span>
                    <span className="text-blue-400">{stats.p1Wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">P2 Orange Wins:</span>
                    <span className="text-orange-400">{stats.p2Wins}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2">
                    <span className="text-gray-400">Winrate P1:</span>
                    <span className="text-white">
                      {Math.round((stats.p1Wins / (stats.p1Wins + stats.p2Wins + stats.draws || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className={`border p-4 rounded-xl ${mode === "cinematic" ? "bg-orange-500/10 border-orange-500/20" : "bg-blue-500/10 border-blue-500/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className={mode === "cinematic" ? "text-orange-500" : "text-blue-400"} />
                <h4 className={`text-xs font-bold italic uppercase ${mode === "cinematic" ? "text-orange-500" : "text-blue-400"}`}>
                  {mode === "cinematic" ? "Cinematic Mode" : "Analysis Mode"}
                </h4>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                {mode === "cinematic" 
                  ? "Auto-slow motion on impacts enabled for high-fidelity observation." 
                  : "Match outcomes are recorded to analyze part performance over time."}
              </p>
            </div>
          </section>
        </aside>

        {/* Center: Viewport */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Stadium Overlay Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-dots" />
          
          {/* Main Canvas Viewport */}
          <div className="absolute inset-0 z-0">
            <Canvas shadows key={gameId}>
              <Experience mode={mode} onMatchEnd={(winner) => {
                if (mode === "sim") {
                  setStats(prev => ({
                    ...prev,
                    p1Wins: winner === "p1" ? prev.p1Wins + 1 : prev.p1Wins,
                    p2Wins: winner === "p2" ? prev.p2Wins + 1 : prev.p2Wins,
                    draws: winner === "draw" ? prev.draws + 1 : prev.draws,
                  }));
                  // Auto reset in sim mode
                  setTimeout(resetGame, 1000);
                }
              }} />
            </Canvas>
          </div>
          
          {/* Viewport Labels */}
          <div className="absolute bottom-8 left-8 text-[10px] font-mono text-gray-500 pointer-events-none z-10">
            GRID_X: 102.4 <br /> 
            GRID_Y: -42.9 <br /> 
            Z_GRAVITY: -9.81m/s²
          </div>
          <div className="absolute top-8 right-8 flex gap-2 z-10">
            <button className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] rounded hover:bg-white/10 transition-colors pointer-events-auto flex items-center gap-2">
              <Cpu size={12} /> WIREFRAME
            </button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] rounded hover:bg-white/10 transition-colors pointer-events-auto flex items-center gap-2">
              <Activity size={12} /> VECTORS
            </button>
          </div>
        </div>

        {/* Right Sidebar: Physics Telemetry */}
        <aside className="hidden lg:flex w-72 border-l border-white/10 p-6 flex-col gap-6 bg-[#0D0F12]/50 font-mono z-10">
          <h3 className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] font-sans">Live Telemetry</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[11px] mb-2">
                <span className="text-gray-400 flex items-center gap-1"><Gauge size={12} /> ANGULAR_VEL</span>
                <span className="text-white">12,482 RPM</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: ["85%", "90%", "87%"] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-2">
                <span className="text-gray-400 flex items-center gap-1"><Shield size={12} /> STABILITY_I</span>
                <span className="text-white">0.92</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: "92%" }} className="h-full bg-green-500 rounded-full" />
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-red-400">BURST_THRESHOLD</span>
                <span className="text-red-400 font-bold uppercase">Crit</span>
              </div>
              <div className="text-[24px] text-red-500 font-bold tracking-tight">74.2%</div>
              <div className="text-[9px] text-red-400/60 mt-1 uppercase">Next Impact {">"} 15N will trigger Burst</div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-wider font-sans">Collision Log</div>
              <div className="text-[10px] space-y-2 text-gray-400">
                <div className="flex gap-2 items-center"><span className="text-blue-400 tabular-nums">12:04:22</span> <span className="opacity-50">Impulse:</span> 12.4N</div>
                <div className="flex gap-2 items-center"><span className="text-blue-400 tabular-nums">12:04:24</span> <span className="opacity-50">Impulse:</span> 8.9N</div>
                <div className="flex gap-2 items-center font-bold text-orange-500"><span className="tabular-nums">12:04:28</span> X-DASH TRGR</div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Controls */}
      <footer className="h-24 border-t border-white/10 bg-[#0A0B0D] px-8 flex items-center justify-between shrink-0 z-20">
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
            className="h-12 px-10 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-sm tracking-[0.2em] text-sm transition-colors shadow-[0_0_20px_rgba(234,88,12,0.3)]"
          >
            3-2-1 LET IT RIP!
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            onClick={resetGame}
            className="h-12 px-8 border border-white/10 text-white font-bold rounded-sm text-xs tracking-widest uppercase transition-colors flex items-center gap-3"
          >
            <RefreshCw size={14} /> RESET ARENA
          </motion.button>
        </div>
        
        <div className="hidden xl:flex items-center gap-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">DAMPING</span>
            <input type="range" className="accent-orange-500 w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">FRICTION</span>
            <input type="range" className="accent-orange-500 w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="w-12 h-6 bg-white/5 border border-white/10 rounded flex items-center px-1">
            <motion.div 
              animate={{ x: [0, 24, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4 bg-orange-500" 
            />
          </div>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Realtime Sim</span>
        </div>
      </footer>

      {/* Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
    </div>
  );
}

