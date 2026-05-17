/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Zap, Shield, Cpu, Activity, Gauge, Languages } from "lucide-react";
import { Language, translations } from "./locales";

export default function App() {
  const [gameId, setGameId] = useState(0);
  const [mode, setMode] = useState<"cinematic" | "sim">("cinematic");
  const [stats, setStats] = useState({ p1Wins: 0, p2Wins: 0, draws: 0 });
  const [roundWinner, setRoundWinner] = useState<"p1" | "p2" | "draw" | null>(null);

  // Individual Physics Configurations for both Beyblades
  const [p1Config, setP1Config] = useState({
    mass: 5.2,
    restitution: 0.85,
    friction: 0.05,
  });

  const [p2Config, setP2Config] = useState({
    mass: 5.2,
    restitution: 0.85,
    friction: 0.05,
  });

  // Track active customize tab (p1 = Blue, p2 = Orange)
  const [activeConfigTab, setActiveConfigTab] = useState<"p1" | "p2">("p1");

  // Localization State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("lang");
    return (saved === "zh" || saved === "en") ? saved : "zh";
  });

  const toggleLanguage = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = translations[lang];

  const resetGame = () => {
    setRoundWinner(null);
    setGameId((prev) => prev + 1);
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
            className={`transition-colors flex flex-col items-center cursor-pointer ${mode === "cinematic" ? "text-orange-500" : "hover:text-white"}`}
          >
            <span>{t.navLab}</span>
            {mode === "cinematic" && <motion.div layoutId="underline" className="h-[2px] w-full bg-orange-500 mt-1" />}
          </button>
          <button 
            onClick={() => setMode("sim")}
            className={`transition-colors flex flex-col items-center cursor-pointer ${mode === "sim" ? "text-blue-500" : "hover:text-white"}`}
          >
            <span>{t.navStats}</span>
            {mode === "sim" && <motion.div layoutId="underline" className="h-[2px] w-full bg-blue-500 mt-1" />}
          </button>
          <a href="#" className="hover:text-white transition-colors">{t.navStadium}</a>
          <a href="#" className="hover:text-white transition-colors">{t.navTelemetry}</a>
        </nav>
        
        {/* Right Header Side controls */}
        <div className="flex items-center gap-6">
          {/* Language Switch Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-orange-500/50 hover:shadow-[0_0_12px_rgba(249,115,22,0.2)] transition-all cursor-pointer text-[10px] font-bold tracking-wider text-gray-300"
          >
            <Languages size={12} className="text-orange-500" />
            <span className={lang === "zh" ? "text-orange-500" : "opacity-60"}>中</span>
            <span className="opacity-30">/</span>
            <span className={lang === "en" ? "text-orange-500" : "opacity-60"}>EN</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase">{t.engineStatus}</div>
              <div className="text-xs text-green-400 font-mono">
                {mode === "cinematic" ? t.engineCinematic : t.engineSim}
              </div>
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
            />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Configuration */}
        <aside className="hidden lg:flex w-72 border-r border-white/10 p-6 flex-col gap-6 bg-[#0D0F12]/50 z-10">
          <section>
            <h3 className="text-[10px] text-gray-500 uppercase font-bold mb-4 tracking-[0.2em]">{t.topConfig}</h3>
            
            {/* Glow Styled Tab Switcher */}
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveConfigTab("p1")}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer text-center ${
                  activeConfigTab === "p1"
                    ? "bg-[#0066ff]/20 text-[#0066ff] border border-[#0066ff]/50 shadow-[0_0_12px_rgba(0,102,255,0.3)] font-black"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {t.p1Label}
              </button>
              <button
                onClick={() => setActiveConfigTab("p2")}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer text-center ${
                  activeConfigTab === "p2"
                    ? "bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/50 shadow-[0_0_12px_rgba(255,102,0,0.3)] font-black"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {t.p2Label}
              </button>
            </div>

            {/* Config Sliders Container */}
            <div className="space-y-5">
              {/* Blade Mass */}
              <div className={`bg-white/5 border p-3 rounded-lg group transition-all ${
                activeConfigTab === "p1" ? "hover:border-[#0066ff]/50" : "hover:border-[#ff6600]/50"
              }`}>
                <label className={`text-[10px] block mb-1 font-bold tracking-widest uppercase ${
                  activeConfigTab === "p1" ? "text-[#0066ff]" : "text-[#ff6600]"
                }`}>
                  {t.bladeMass}
                </label>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold">
                    {(activeConfigTab === "p1" ? p1Config.mass : p2Config.mass).toFixed(1)} kg
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {(activeConfigTab === "p1" ? p1Config.mass : p2Config.mass) > 6.0 
                      ? (lang === "zh" ? "極重 / 破壞型" : "Heavy / Smasher") 
                      : (activeConfigTab === "p1" ? p1Config.mass : p2Config.mass) < 4.5 
                      ? (lang === "zh" ? "輕盈 / 敏捷型" : "Light / Agile") 
                      : (lang === "zh" ? "標準重量" : "Standard")}
                  </span>
                </div>
                <input 
                  type="range"
                  min="3.0"
                  max="8.0"
                  step="0.1"
                  value={activeConfigTab === "p1" ? p1Config.mass : p2Config.mass}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (activeConfigTab === "p1") {
                      setP1Config(prev => ({ ...prev, mass: val }));
                    } else {
                      setP2Config(prev => ({ ...prev, mass: val }));
                    }
                  }}
                  className={`w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-2 ${
                    activeConfigTab === "p1" ? "accent-[#0066ff]" : "accent-[#ff6600]"
                  }`}
                />
              </div>

              {/* Ratchet Rebound Restitution */}
              <div className={`bg-white/5 border p-3 rounded-lg group transition-all ${
                activeConfigTab === "p1" ? "hover:border-[#0066ff]/50" : "hover:border-[#ff6600]/50"
              }`}>
                <label className="text-[10px] text-blue-400 block mb-1 font-bold tracking-widest uppercase">
                  {t.restitutionLabel}
                </label>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold">
                    {Math.round((activeConfigTab === "p1" ? p1Config.restitution : p2Config.restitution) * 100)}%
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {(activeConfigTab === "p1" ? p1Config.restitution : p2Config.restitution) > 0.8 
                      ? (lang === "zh" ? "高能反彈" : "High Rebound") 
                      : (lang === "zh" ? "緩震穩健" : "Stabilizing")}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.40"
                  max="0.95"
                  step="0.05"
                  value={activeConfigTab === "p1" ? p1Config.restitution : p2Config.restitution}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (activeConfigTab === "p1") {
                      setP1Config(prev => ({ ...prev, restitution: val }));
                    } else {
                      setP2Config(prev => ({ ...prev, restitution: val }));
                    }
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-400"
                />
              </div>

              {/* Bit Friction */}
              <div className={`bg-white/5 border p-3 rounded-lg group transition-all ${
                activeConfigTab === "p1" ? "hover:border-[#0066ff]/50" : "hover:border-[#ff6600]/50"
              }`}>
                <label className="text-[10px] text-purple-400 block mb-1 font-bold tracking-widest uppercase">
                  {t.bitFriction}
                </label>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold">
                    {(activeConfigTab === "p1" ? p1Config.friction : p2Config.friction).toFixed(2)}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                    {(activeConfigTab === "p1" ? p1Config.friction : p2Config.friction) <= 0.03
                      ? t.staminaBit
                      : (activeConfigTab === "p1" ? p1Config.friction : p2Config.friction) >= 0.15
                      ? t.attackBit
                      : t.balanceBit}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.01"
                  max="0.40"
                  step="0.01"
                  value={activeConfigTab === "p1" ? p1Config.friction : p2Config.friction}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (activeConfigTab === "p1") {
                      setP1Config(prev => ({ ...prev, friction: val }));
                    } else {
                      setP2Config(prev => ({ ...prev, friction: val }));
                    }
                  }}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-2 accent-purple-400"
                />
              </div>
            </div>
          </section>

          <section className="mt-auto">
            {mode === "sim" && (
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4">
                <h4 className="text-[10px] font-bold text-blue-400 mb-3 uppercase tracking-widest">{t.matchRecords}</h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t.p1Wins}</span>
                    <span className="text-blue-400">{stats.p1Wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t.p2Wins}</span>
                    <span className="text-orange-400">{stats.p2Wins}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2">
                    <span className="text-gray-400">{t.winrateP1}</span>
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
                  {mode === "cinematic" ? t.cinematicMode : t.analysisMode}
                </h4>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                {mode === "cinematic" ? t.cinematicDesc : t.analysisDesc}
              </p>
            </div>
          </section>
        </aside>

        {/* Center: Viewport */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Stadium Overlay Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-dots" />
          
          {/* Futuristic Top Scoreboard HUD */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6 bg-[#0D0F12]/85 backdrop-blur-md border border-white/10 px-8 py-2.5 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.8)] pointer-events-none">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0066ff] shadow-[0_0_12px_rgba(0,102,255,0.7)]" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#0066ff] font-sans">
                {lang === "zh" ? "藍色 P1" : "BLUE P1"}
              </span>
            </div>
            <div className="flex items-center gap-4 px-5 py-1.5 bg-white/5 border border-white/5 rounded-md font-mono text-xl font-black text-white">
              <span className="text-blue-500">{stats.p1Wins}</span>
              <span className="text-gray-600 font-sans text-xs font-normal">:</span>
              <span className="text-orange-500">{stats.p2Wins}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#ff6600] font-sans">
                {lang === "zh" ? "橘色 P2" : "ORANGE P2"}
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#ff6600] shadow-[0_0_12px_rgba(255,102,0,0.7)]" />
            </div>
          </div>

          {/* Immersive Victory Announcement Overlay */}
          {roundWinner && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`px-12 py-8 rounded-lg border text-center shadow-[0_10px_50px_rgba(0,0,0,0.9)] max-w-sm w-full mx-4 ${
                  roundWinner === "p1"
                    ? "bg-[#0066ff]/10 border-[#0066ff]/30 shadow-[#0066ff]/20 text-[#0066ff]"
                    : roundWinner === "p2"
                    ? "bg-[#ff6600]/10 border-[#ff6600]/30 shadow-[#ff6600]/20 text-[#ff6600]"
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-black/40 border border-white/10">
                  <Zap size={20} className={roundWinner === "p1" ? "text-blue-500" : roundWinner === "p2" ? "text-orange-500" : "text-white"} />
                </div>
                <h2 className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-60 mb-2 font-mono">
                  {lang === "zh" ? "戰鬥結束" : "MATCH ENDED"}
                </h2>
                <h1 className="text-2xl font-black italic tracking-wider uppercase font-sans">
                  {roundWinner === "draw"
                    ? (lang === "zh" ? "雙方平手！" : "ROUND DRAW!")
                    : roundWinner === "p1"
                    ? (lang === "zh" ? "藍色陀螺 獲勝！" : "BLUE BEYBLADE WINS!")
                    : (lang === "zh" ? "橘色陀螺 獲勝！" : "ORANGE BEYBLADE WINS!")
                  }
                </h1>
                <p className="text-[9px] text-gray-500 mt-5 tracking-[0.2em] uppercase font-mono">
                  {lang === "zh" ? "即將重新發射..." : "NEXT LAUNCH INCOMING..."}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Main Canvas Viewport */}
          <div className="absolute inset-0 z-0">
            <Canvas shadows key={gameId}>
              <Experience 
                mode={mode} 
                p1Config={p1Config}
                p2Config={p2Config}
                onMatchEnd={(winner) => {
                  setStats(prev => ({
                    ...prev,
                    p1Wins: winner === "p1" ? prev.p1Wins + 1 : prev.p1Wins,
                    p2Wins: winner === "p2" ? prev.p2Wins + 1 : prev.p2Wins,
                    draws: winner === "draw" ? prev.draws + 1 : prev.draws,
                  }));
                  
                  setRoundWinner(winner);
                  const delay = mode === "sim" ? 1000 : 3000;
                  setTimeout(() => {
                    setRoundWinner(null);
                    resetGame();
                  }, delay);
                }} 
              />
            </Canvas>
          </div>
          
          {/* Viewport Labels */}
          <div className="absolute bottom-8 left-8 text-[10px] font-mono text-gray-500 pointer-events-none z-10">
            {t.gridX}: 102.4 <br /> 
            {t.gridY}: -42.9 <br /> 
            {t.zGravity}: -15.00m/s²
          </div>
          <div className="absolute top-8 right-8 flex gap-2 z-10">
            <button className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] rounded hover:bg-white/10 transition-colors pointer-events-auto flex items-center gap-2">
              <Cpu size={12} /> {t.wireframe}
            </button>
            <button className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] rounded hover:bg-white/10 transition-colors pointer-events-auto flex items-center gap-2">
              <Activity size={12} /> {t.vectors}
            </button>
          </div>
        </div>

        {/* Right Sidebar: Physics Telemetry */}
        <aside className="hidden lg:flex w-72 border-l border-white/10 p-6 flex-col gap-6 bg-[#0D0F12]/50 font-mono z-10">
          <h3 className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] font-sans">{t.liveTelemetry}</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[11px] mb-2">
                <span className="text-gray-400 flex items-center gap-1"><Gauge size={12} /> {t.angularVel}</span>
                <span className="text-white">12,482 RPM</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: ["85%", "90%", "87%"] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-2">
                <span className="text-gray-400 flex items-center gap-1"><Shield size={12} /> {t.stabilityIndex}</span>
                <span className="text-white">0.92</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: "92%" }} className="h-full bg-green-500 rounded-full" />
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-red-400">{t.burstThreshold}</span>
                <span className="text-red-400 font-bold uppercase">{t.burstCrit}</span>
              </div>
              <div className="text-[24px] text-red-500 font-bold tracking-tight">74.2%</div>
              <div className="text-[9px] text-red-400/60 mt-1 uppercase">{t.burstNextDesc}</div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="text-[10px] text-gray-500 mb-3 uppercase tracking-wider font-sans">{t.collisionLog}</div>
              <div className="text-[10px] space-y-2 text-gray-400">
                <div className="flex gap-2 items-center"><span className="text-blue-400 tabular-nums">12:04:22</span> <span className="opacity-50">{t.impulse}:</span> 12.4N</div>
                <div className="flex gap-2 items-center"><span className="text-blue-400 tabular-nums">12:04:24</span> <span className="opacity-50">{t.impulse}:</span> 8.9N</div>
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
            {t.letItRip}
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            onClick={resetGame}
            className="h-12 px-8 border border-white/10 text-white font-bold rounded-sm text-xs tracking-widest uppercase transition-colors flex items-center gap-3"
          >
            <RefreshCw size={14} /> {t.resetArena}
          </motion.button>
        </div>
        
        <div className="hidden xl:flex items-center gap-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">{t.damping}</span>
            <input type="range" className="accent-orange-500 w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">{t.friction}</span>
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
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{t.realtimeSim}</span>
        </div>
      </footer>

      {/* Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
    </div>
  );
}
