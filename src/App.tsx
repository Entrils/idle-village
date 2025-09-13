import React from "react";
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

  return (
    <div className="app">
      <h1 className="title">🏕️ Entrils Idle Village</h1>

      <ResetButton />

      <h2 className="section-title">📦 Ресурсы</h2>
      <Resources />
      <GatherButtons />

      <h2 className="section-title">👷 Рабочие</h2>
      <Workers />
      <HireWorkers />

      <h2 className="section-title">🏰 Деревня</h2>
      <VillageUpgrade />

      <h2 className="section-title">🎯 Цели</h2>
      <Goals />

      <Notifications />
    </div>
  );
};

export default App;
