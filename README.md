# 🌀 Metal Blade: X-Digital (數位版戰鬥陀螺)

> **極致寫實的 3D 數位戰鬥陀螺物理模擬器。**  
> 基於 **React 19**, **Vite**, **React Three Fiber (R3F)** 與 **Rapier 3D** 物理引擎構建，完美還原戰鬥陀螺的旋轉、碰撞、X-Dash 極速衝刺以及爆裂系統。
>
> **A high-fidelity 3D digital Beyblade physics simulator.**  
> Built with **React 19**, **Vite**, **React Three Fiber (R3F)**, and the **Rapier 3D** physics engine, perfectly recreating realistic spinning, collisions, X-Dash extreme rail dashes, and burst systems.

---

### [🎮 Play Game Live / 線上即刻遊玩](https://toydogcat.github.io/ai-beyblade/)

---

## 🌟 核心特色 (Core Features)

### 1. ⚙️ 極致寫實的陀螺物理 (Realistic Physics)
*   **陀螺儀穩定效應 (Gyroscopic Stabilization)**
    *   **中文**: 程式內部實現了動態修正力矩（Torque Impulse），能隨著陀螺的旋轉角速度（RPM）動態修正傾斜度，使陀螺在旋轉時維持直立，並在低轉速時逐漸搖晃、失效。
    *   **English**: Implements dynamic torque corrections (Torque Impulse) based on the angular velocity (RPM) to maintain an upright spin, realistically introducing instability and tilt as rotational speed decreases.
*   **角速度動態消耗 (Angular Damping)**
    *   **中文**: 還原真實摩擦力與空氣阻力造成的能量漸進式衰減。
    *   **English**: Models the gradual energy decay caused by friction, aerodynamic drag, and stadium boundary contact.
*   **低摩擦軸心設計 (Low-Friction Bits)**
    *   **中文**: 對陀螺底端的軸心進行高擬真摩擦力配置，讓陀螺移動滑順且持久。
    *   **English**: Features authentic low-friction profiling for the bottom tip (Bit), allowing smooth, enduring, and fluid orbit movements.

### 2. 💥 擬真彈鬥戰鬥碰撞 (Premium Elastic Combat)
*   **高彈性碰撞機制 (High Restitution Bounding)**
    *   **中文**: 透過單獨為每個陀螺的裝甲、阻力外環與軸心設定手動碰撞體（Cylinder Colliders），並配置高彈力係數（`restitution = 0.85`）與超低碰撞摩擦，陀螺碰撞時會產生極具震撼感的劇烈彈開與反彈（彈鬥）。
    *   **English**: Defines manual colliders for each part (Bit, Ratchet, and Blade) with high restitution (`restitution = 0.85`) and low contact friction, making tops bounce away with massive cinematic force upon impacts.
*   **爆裂系統 (Burst System)**
    *   **中文**: 當兩隻陀螺劇烈碰撞產生的碰撞力道（Impact Force）超過爆裂閾值（Burst Threshold）時，陀螺會瞬間瓦解爆裂成「戰神晶片/軸心 (Bit)」、「鐵環/鋼鐵輪盤 (Ratchet)」與「結晶輪盤/攻擊刃 (Blade)」碎片，四處飛散，重現戰鬥陀螺 X 最震撼的 Burst 瞬間！
    *   **English**: When impact force exceeds the burst threshold, the top instantaneously disintegrates into flyaway fragments (Bit, Ratchet, and Blade), perfectly recreating the ultimate dramatic Burst moments!

### 3. ⚡ X-Dash 極速齒輪軌道衝刺 (Extreme X-Dash Rail)
*   **精密軌道範圍判定 (Precise Rail Gating)**
    *   **中文**: 修正了傳統圓柱感應器將整個賽場覆蓋的 Bug，只有當陀螺移動至賽場最外側的齒輪軌道區域（`8.2 <= 半徑 <= 9.6`）時才會觸發 X-Line。
    *   **English**: Restricts X-Dash triggering to the golden outer circumference gear rail (`8.2 <= radius <= 9.6`), resolving sensor overlap.
*   **動態能量轉換 (Kinetic Energy Conversion)**
    *   **中文**: 當陀螺在高速旋轉下觸發 X-Dash 時，會將自身的**旋轉動能（轉速減損 2%）**完美轉化為**線性衝刺初速度（Impulse Boost）**，以驚人的切線速度沿著軌道狂飆並朝賽場中央發動極速奇襲！
    *   **English**: During dash, rotational kinetic energy is converted to linear velocity (rotational speed is reduced by 2% per frame for a massive tangential impulse boost along the outer rail).

### 4. 📊 雙模 Telemetry 實驗室 (Double Simulation Modes)
*   **慢動作特寫鏡頭 (Cinematic Lab Mode)**
    *   **中文**: 陀螺在彼此極度接近時，系統會自動切換為平滑的慢動作特寫鏡頭（Slo-Mo Zoom），讓玩家能近距離、高幀率觀察碰撞的精彩細節。
    *   **English**: Automatically triggers slow-motion time scaling (Slo-Mo Zoom) on close impacts for high-fidelity observation of collision details.
*   **數據賽局模擬 (Analysis/Sim Mode)**
    *   **中文**: 高速背景賽局計算與自動重啟，詳細記錄兩名選手的勝率、勝負盤數與 X-Dash 觸發次數，用於分析陀螺配件在不同物理配置下的勝率曲線。
    *   **English**: Enables fast-paced background simulation and automatic reset, logging wins, losses, win rates, and parts telemetry over time to analyze part combinations.


---

## 🏆 專業戰鬥陀螺 X 勝負規則 (Official Beyblade X Victory Rules)

本模擬器高度還原了最新世代 **戰鬥陀螺 X (Beyblade X)** 大賽的官方勝負判定系統，採取先獲得 **4 分** 者勝出的點數機制：

### 1. 旋轉結束 (Spin Finish / 擊停勝) — 🌟 1 分
*   **規則**: 雙方陀螺在場內對決，其中一顆陀螺旋轉動能耗盡先行停止，而另一顆陀螺依然在旋轉，旋轉時間較長者獲勝。
*   **Stamina Win**: Decided when one Beyblade stops spinning while the other continues rotating. Awards 1 point.

### 2. 擊飛出場 (Over Finish / 擊出場外) — 🌟🌟 2 分
*   **規則**: 陀螺受到強力衝撞，飛出賽場界限或掉入競技場邊緣的「出界口袋 (Over Zone)」。
*   **Knockout Win**: Triggered when a Beyblade is knocked out of bounds or falls into the over zones. Awards 2 points.

### 3. 爆裂結束 (Burst Finish / 擊爆勝) — 🌟🌟 2 分
*   **規則**: 陀螺承受強烈碰撞力道，超過其防爆鎖扣承受上限，在空中瞬間「解體」分裂成晶片、鐵環與底軸碎片。
*   **Burst Win**: Decided when high impact forces disassemble the opponent's Beyblade into its discrete components (Blade, Ratchet, and Bit). Awards 2 points.

### 4. 極限結束 (Extreme Finish / 極限擊飛) — 🌟🌟🌟 3 分
*   **規則**: 最震撼的致命一擊！當陀螺卡住邊緣齒輪軌道產生超高速 X-Dash 衝刺後，將對手以毀滅性速度撞入正前方的「極限深槽 (Extreme Zone)」。
*   **Extreme Win**: The ultimate signature move! Decided when a Beyblade uses X-Dash tangential momentum to blast the opponent through the front Extreme Zone. Awards 3 points.

---

## 🛠️ 技術棧 (Tech Stack)

*   **前端框架 (Frontend)**: React 19 + TypeScript
*   **構建工具 (Build)**: Vite 6
*   **3D 渲染 (3D Graphics)**: Three.js + `@react-three/fiber` (R3F) + `@react-three/drei`
*   **物理引擎 (Physics)**: `@react-three/rapier` (Rapier 3D, CCD continuous collision detection)
*   **動畫效果 (Animations)**: `motion` (Framer Motion React)
*   **樣式設計 (Styling)**: Tailwind CSS 4 + Lucide Icons

---

## 🚀 本地開發運行 (Local Development)

### 先決條件 (Prerequisites)
*   **Node.js** (建議 v18 或更新版本 / v18+ recommended)
*   **npm** 或 **yarn**

### 步驟 (Steps)
1.  **安裝依賴項目 (Install dependencies)**:
    ```bash
    npm install
    ```
2.  **運行本地伺服器 (Run local server)**:
    ```bash
    npm run dev
    ```
    打開瀏覽器訪問 `http://localhost:3000` (或終端輸出的連接埠) 即可開始體驗！
    Open your browser and navigate to `http://localhost:3000` (or the terminal output port) to start!

---

## 🤖 GitHub Actions 自動化部署 (CI/CD Deployment)

本專案已完美配置 **GitHub Actions 整合**！當您將代碼推送到 `main` 分支時，GitHub 運作流程會自動編譯專案，並直接託管發佈至 **GitHub Pages**。

This project is configured with **GitHub Actions**! Pushing commits to the `main` branch automatically triggers compilation and direct deployment to **GitHub Pages**.

*   **Workflow 配置路徑 (Workflow Path)**: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
*   **自動化流程特色 (CI/CD Features)**:
    *   直接讀取設定好的 `Vite Base Path` (`/ai-beyblade/`)，確保發布後靜態資源（CSS、JS、3D Mesh、分包）路徑解析無 404 錯誤。
    *   使用最現代的 GitHub Actions v2 靜態網頁上傳技術，安全快速，無需創建繁瑣的 `gh-pages` 分支。
    *   配置 Concurrency 鎖定機制，防止多個 commit 同時編譯部署造成衝突。
    *   Resolves assets via the custom `Vite Base Path` (`/ai-beyblade/`), ensuring absolute chunk resolution without any 404 errors.
    *   Leverages modern GitHub Pages deployment actions without cluttering the repository with temporary build branches.
