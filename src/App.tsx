import React, { useState } from "react";
import Resources from "@/entities/resource/ui/Resources";
import Workers from "@/entities/worker/ui/Worker";
import VillageUpgrade from "@/features/village/ui/VillageUpgrade";
import Goals from "@/entities/goals/ui/Goals";
import GatherButtons from "@/features/gather/ui/GatherButtons";
import HireWorkers from "@/features/hire/ui/HireWorkers";
import ResetButton from "@/features/reset/ui/ResetButton";
import Notifications from "@/entities/notifications/ui/Notifications";
import { useAutoGather } from "@/shared/hooks/useAutoGather";
import { useGoalsChecker } from "@/shared/hooks/useGoalsChecker";
import "./App.css";

const App: React.FC = () => {
  useAutoGather();
  useGoalsChecker();

  const [isNight, setIsNight] = useState(false);

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Симулятор деревни</p>
          <h1 className="title">Entrils: Idle Village</h1>
        </div>
        <div className="heroActions">
          <button className="modeButton" onClick={() => setIsNight((prev) => !prev)}>
            {isNight ? "Переключить на день" : "Переключить на ночь"}
          </button>
          <ResetButton />
        </div>
      </header>

      <main className="board">
        <section className={`section sectionScene ${isNight ? "night" : "day"}`}>
          <div className="sceneOverlay">
            <div className="panelSection">
              <h2 className="section-title">Ресурсы</h2>
              <Resources />
            </div>

            <div className="panelSection">
              <h2 className="section-title">Добыча</h2>
              <GatherButtons />
            </div>
          </div>
        </section>

        <section className="sidebar">
          <div className="section">
            <h2 className="section-title">Рабочие</h2>
            <Workers />
            <HireWorkers />
          </div>

          <div className="section">
            <h2 className="section-title">Деревня</h2>
            <VillageUpgrade />
          </div>
        </section>

        <section className="section section-goals">
          <h2 className="section-title">Цели и достижения</h2>
          <Goals />
        </section>
      </main>

      <Notifications />
    </div>
  );
};

export default App;
