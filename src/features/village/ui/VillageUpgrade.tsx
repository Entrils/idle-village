import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { upgradeVillage } from "@/entities/village/model/villageSlice";
import { addNotification } from "@/entities/notifications/model/notificationSlice";

const getUpgradeCost = (level: number) => ({
  wood: 100 * level,
  stone: 100 * level,
  gold: level > 1 ? 50 * (level - 1) : 0,
});

const VillageUpgrade: React.FC = () => {
  const dispatch = useDispatch();
  const resources = useSelector((state: RootState) => state.resources);
  const village = useSelector((state: RootState) => state.village);

  const cost = getUpgradeCost(village.level);

  const handleUpgrade = () => {
    if (resources.wood >= cost.wood && resources.stone >= cost.stone && resources.gold >= cost.gold) {
      dispatch(upgradeVillage(cost));
      dispatch(addNotification({ message: `🏰 Деревня улучшена до уровня ${village.level + 1}`, type: "success" }));
    } else {
      dispatch(addNotification({ message: "❌ Недостаточно ресурсов для улучшения", type: "error" }));
    }
  };

  return (
    <>
      <p>Уровень: {village.level}</p>
      <button onClick={handleUpgrade}>
        Улучшить деревню ({cost.wood} дерева, {cost.stone} камня
        {cost.gold ? `, ${cost.gold} золота` : ""})
      </button>
    </>
  );
};

export default VillageUpgrade;