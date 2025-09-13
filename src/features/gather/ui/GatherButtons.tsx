import React from "react";
import { useDispatch } from "react-redux";
import { addResource } from "@/entities/resource/model/resourceSlice";
import { addNotification } from "@/entities/notifications/model/notificationSlice";

const GatherButtons: React.FC = () => {
  const dispatch = useDispatch();

  const handleGather = (type: "wood" | "stone" | "food" | "gold", emoji: string) => {
    dispatch(addResource({ type, amount: 1 }));
    dispatch(addNotification({ message: `${emoji} Вы добыли ${type}`, type: "info" }));
  };

  return (
    <div>
      <button onClick={() => handleGather("wood", "🌲")}>Добыть дерево</button>
      <button onClick={() => handleGather("stone", "🪨")}>Добыть камень</button>
      <button onClick={() => handleGather("food", "🍖")}>Добыть еду</button>
      <button onClick={() => handleGather("gold", "💰")}>Добыть золото</button>
    </div>
  );
};

export default GatherButtons;