import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { upgradeVillage } from "@/entities/village/model/villageSlice";
import { addNotification } from "@/entities/notifications/model/notificationSlice";
import styles from "./VillageUpgrade.module.css";

const getUpgradeCost = (level: number) => ({
  wood: 100 * level,
  stone: 100 * level,
  gold: level > 1 ? 50 * (level - 1) : 0,
});

const resourceIcons = {
  wood: "/assets/resources/wood.png",
  stone: "/assets/resources/stone.png",
  gold: "/assets/resources/gold.png",
} as const;

const VillageUpgrade: React.FC = () => {
  const dispatch = useDispatch();
  const resources = useSelector((state: RootState) => state.resources);
  const village = useSelector((state: RootState) => state.village);

  const cost = getUpgradeCost(village.level);

  const hasWood = resources.wood >= cost.wood;
  const hasStone = resources.stone >= cost.stone;
  const hasGold = resources.gold >= cost.gold;

  const canUpgrade = hasWood && hasStone && hasGold;

  const requirements = [
    {
      key: "wood",
      label: "Дерево",
      icon: resourceIcons.wood,
      current: resources.wood,
      need: cost.wood,
      done: hasWood,
    },
    {
      key: "stone",
      label: "Камень",
      icon: resourceIcons.stone,
      current: resources.stone,
      need: cost.stone,
      done: hasStone,
    },
    {
      key: "gold",
      label: "Золото",
      icon: resourceIcons.gold,
      current: resources.gold,
      need: cost.gold,
      done: hasGold,
    },
  ] as const;

  const activeRequirements = requirements.filter((item) => item.need > 0);

  const totalProgress =
    activeRequirements.reduce((acc, item) => {
      if (item.need === 0) return acc + 1;
      return acc + Math.min(item.current / item.need, 1);
    }, 0) / activeRequirements.length;

  const progressPercent = Math.round(totalProgress * 100);

  const handleUpgrade = () => {
    if (!canUpgrade) {
      dispatch(
        addNotification({
          message: "Недостаточно ресурсов для улучшения.",
          type: "error",
        })
      );
      return;
    }

    dispatch(upgradeVillage());
    dispatch(
      addNotification({
        message: `Деревня улучшена до уровня ${village.level + 1}.`,
        type: "success",
      })
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.villageCard}>
        <div className={styles.badge}>Ур. {village.level}</div>
        <div className={styles.villageSilhouette} aria-hidden="true" />
        <p className={styles.level}>Уровень поселения: {village.level}</p>
        <p className={styles.capacity}>Лимит работников: {village.maxWorkers}</p>
      </div>

      <div className={styles.progressBlock}>
        <div className={styles.progressMeta}>
          <span>Готовность улучшения</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <ul className={styles.requirements}>
        {activeRequirements.map((item) => (
          <li
            key={item.key}
            className={`${styles.requirementItem} ${
              item.done ? styles.requirementDone : styles.requirementMissing
            }`}
          >
            <span className={styles.requirementLabel}>
              <img src={item.icon} alt={item.label} className={styles.requirementIcon} />
              {item.label}
            </span>
            <span className={styles.requirementValue}>
              {item.current}/{item.need}
            </span>
          </li>
        ))}
      </ul>

      <button className={styles.upgradeButton} onClick={handleUpgrade} disabled={!canUpgrade}>
        Улучшить деревню
      </button>
    </div>
  );
};

export default VillageUpgrade;
