<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌀 Metal Blade: X-Digital (數位版戰鬥陀螺)

> **極致寫實的 3D 數位戰鬥陀螺物理模擬器。**  
> 基於 **React 19**, **Vite**, **React Three Fiber (R3F)** 與 **Rapier 3D** 物理引擎構建，完美還原戰鬥陀螺的旋轉、碰撞、X-Dash 極速衝刺以及爆裂系統。

[Game](https://toydogcat.github.io/ai-beyblade/)

---

## 🌟 核心特色 (Core Features)

### 1. ⚙️ 極致寫實的陀螺物理 (Realistic Physics)
*   **陀螺儀穩定效應 (Gyroscopic Stabilization)**: 程式內部實現了動態修正力矩（Torque Impulse），能隨着陀螺的旋轉角速度（RPM）動態修正傾斜度，使陀螺在旋轉時維持直立，並在低轉速時逐漸搖晃、失效。
*   **角速度動態消耗 (Angular Damping)**: 還原真實摩擦力與空氣阻力造成的能量漸進式衰減。
*   **低摩擦軸心設計 (Low-Friction Bits)**: 對陀螺底端的軸心進行高擬真摩擦力配置，讓陀螺移動滑順且持久。

### 2. 💥 擬真彈鬥戰鬥碰撞 (Premium Elastic Combat)
*   **高彈性碰撞機制 (High Restitution Bounding)**: 透過單獨為每個陀螺的裝甲、阻力外環與軸心設定手動碰撞體（Cylinder Colliders），並配置高彈力係數（`restitution = 0.85`）與超低碰撞摩擦，陀螺碰撞時會產生極具震撼感的劇烈彈開與反彈（彈鬥）。
*   **爆裂系統 (Burst System)**: 當兩隻陀螺劇烈碰撞產生的碰撞力道（Impact Force）超過爆裂閾值（Burst Threshold）時，陀螺會瞬間瓦解爆裂成「戰神晶片/軸心 (Bit)」、「鐵環/鋼鐵輪盤 (Ratchet)」與「結晶輪盤/攻擊刃 (Blade)」碎片，四處飛散，重現戰鬥陀螺 X 最震撼的 Burst 瞬間！

### 3. ⚡ X-Dash 極速齒輪軌道衝刺 (Extreme X-Dash Rail)
*   **精密軌道範圍判定**: 修正了傳統圓柱感應器將整個賽場覆蓋的 Bug，只有當陀螺移動至賽場最外側的齒輪軌道區域（`8.2 <= 半徑 <= 9.6`）時才會觸發 X-Line。
*   **動態能量轉換**: 當陀螺在高速旋轉下觸發 X-Dash 時，會將自身的**旋轉動能（轉速減損 2%）**完美轉化為**線性衝刺初速度（Impulse Boost）**，以驚人的切線速度沿著軌道狂飆並朝賽場中央發動極速奇襲！

### 4. 📊 雙模 telemetry 實驗室 (Double Simulation Modes)
*   **慢動作特寫鏡頭 (Cinematic Lab Mode)**: 陀螺在彼此極度接近時，系統會自動切換為平滑的慢動作特寫鏡頭（Slo-Mo Zoom），讓玩家能近距離、高幀率觀察碰撞的精彩細節。
*   **數據賽局模擬 (Analysis/Sim Mode)**: 高速背景賽局計算與自動重啟，詳細記錄兩名選手的勝率、勝負盤數與 X-Dash 觸發次數，用於分析陀螺配件在不同物理配置下的勝率曲線。

---

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架**: React 19 + TypeScript
*   **構建工具**: Vite 6
*   **3D 渲染**: Three.js + `@react-three/fiber` (R3F) + `@react-three/drei`
*   **物理引擎**: `@react-three/rapier` (Rapier 3D 物理系統，高幀率連續碰撞 CCD 偵測)
*   **動畫效果**: `motion` (Framer Motion React)
*   **樣式設計**: Tailwind CSS 4 + Lucide Icons


