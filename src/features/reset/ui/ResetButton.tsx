import React from "react";
import { useDispatch } from "react-redux";
import { resetResources } from "@/entities/resource/model/resourceSlice";
import { resetWorkers } from "@/entities/worker/model/workerSlice";
import { resetVillage } from "@/entities/village/model/villageSlice";
import { resetGoals } from "@/entities/goals/model/goalSlice";
import { resetNotifications, addNotification } from "@/entities/notifications/model/notificationSlice";

const ResetButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetResources());
    dispatch(resetWorkers());
    dispatch(resetVillage());
    dispatch(resetGoals());
    dispatch(resetNotifications());
    dispatch(addNotification({ message: "🔄 Игра сброшена!", type: "info" }));
  };

  return (
    <button
      onClick={handleReset}
      style={{
        marginBottom: "20px",
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        background: "darkred",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      🔄 Сбросить прогресс
    </button>
  );
};

export default ResetButton;