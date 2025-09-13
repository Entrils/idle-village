import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { hireWorker } from "@/entities/worker/model/workerSlice";
import { addResource } from "@/entities/resource/model/resourceSlice";
import { addNotification } from "@/entities/notifications/model/notificationSlice";

const getHireCost = (count: number) => 10 + count * 2;

const HireWorkers: React.FC = () => {
  const dispatch = useDispatch();
  const workers = useSelector((state: RootState) => state.workers);
  const village = useSelector((state: RootState) => state.village);
  const resources = useSelector((state: RootState) => state.resources);

  const maxWorkers = village.level * 5;
  const totalWorkers = workers.lumberjack + workers.miner + workers.hunter;

  const handleHire = (type: "lumberjack" | "miner" | "hunter") => {
    if (totalWorkers >= maxWorkers) {
      dispatch(addNotification({ message: "❌ Достигнут лимит рабочих", type: "error" }));
      return;
    }

    const cost = getHireCost(workers[type]);
    if (resources.food < cost) {
      dispatch(addNotification({ message: "❌ Недостаточно еды для найма", type: "error" }));
      return;
    }

    dispatch(hireWorker({ type }));
    dispatch(addResource({ type: "food", amount: -cost }));
    dispatch(
      addNotification({
        message:
          type === "lumberjack"
            ? "👷 Вы наняли лесоруба"
            : type === "miner"
            ? "⛏️ Вы наняли каменотёса"
            : "🏹 Вы наняли охотника",
        type: "success",
      })
    );
  };

  return (
    <div>
      <button onClick={() => handleHire("lumberjack")}>Нанять лесоруба</button>
      <button onClick={() => handleHire("miner")}>Нанять каменотёса</button>
      <button onClick={() => handleHire("hunter")}>Нанять охотника</button>
    </div>
  );
};

export default HireWorkers;