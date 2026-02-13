import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import styles from "./Goals.module.css";

const resourceLabels = {
  wood: "Дерево",
  stone: "Камень",
  food: "Еда",
  gold: "Золото",
} as const;

const resourceIcons = {
  wood: "/assets/resources/wood.png",
  stone: "/assets/resources/stone.png",
  food: "/assets/resources/food.png",
  gold: "/assets/resources/gold.png",
} as const;

const Goals: React.FC = () => {
  const goalsRaw = useSelector((state: RootState) => state.goals.list);
  const resources = useSelector((state: RootState) => state.resources);
  const village = useSelector((state: RootState) => state.village);

  const [showAchievements, setShowAchievements] = useState(false);

  const goals = useMemo(() => {
    const seen = new Set<string>();
    return goalsRaw.filter((goal) => {
      if (seen.has(goal.id)) return false;
      seen.add(goal.id);
      return true;
    });
  }, [goalsRaw]);

  const currentGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  const renderGoal = (goal: (typeof goals)[number]) => {
    let progress = 0;
    let progressText = "";

    if (goal.requirement.resource) {
      const { type, amount } = goal.requirement.resource;
      const current = resources[type];
      progress = Math.min((current / amount) * 100, 100);
      progressText = `${resourceLabels[type]}: ${current}/${amount}`;
    }

    if (goal.requirement.villageLevel) {
      const need = goal.requirement.villageLevel;
      progress = Math.min((village.level / need) * 100, 100);
      progressText = `Уровень деревни: ${village.level}/${need}`;
    }

    const rewards = Object.entries(goal.reward).filter(([, value]) => Boolean(value));

    return (
      <li key={goal.id} className={`${styles.goalItem} ${goal.completed ? styles.goalDone : ""}`}>
        <div className={styles.goalHead}>
          <p className={styles.goalText}>{goal.description}</p>
          <span className={styles.stateBadge}>{goal.completed ? "Готово" : "В процессе"}</span>
        </div>

        <p className={styles.progressText}>{progressText}</p>

        {!goal.completed && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <div className={styles.rewardRow}>
          {rewards.map(([resource, value]) => (
            <span key={`${goal.id}-${resource}`} className={styles.rewardChip}>
              <img
                src={resourceIcons[resource as keyof typeof resourceIcons]}
                alt={resourceLabels[resource as keyof typeof resourceLabels]}
                className={styles.rewardIcon}
              />
              +{value}
            </span>
          ))}
        </div>
      </li>
    );
  };

  return (
    <div className={styles.questBoard}>
      <ul className={styles.goalList}>
        {currentGoals.length > 0 ? currentGoals.map(renderGoal) : <li className={styles.empty}>Все активные цели выполнены.</li>}
      </ul>

      <button
        className={styles.achievementsButton}
        onClick={() => setShowAchievements((prev) => !prev)}
      >
        {showAchievements ? "Скрыть достижения" : "Показать достижения"}
      </button>

      {showAchievements && (
        <div className={styles.achievementsList}>
          <h3 className={styles.achievementsTitle}>Завершенные задания</h3>
          <ul className={styles.goalList}>
            {completedGoals.length > 0 ? completedGoals.map(renderGoal) : <li className={styles.empty}>Пока нет завершенных заданий.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Goals;
