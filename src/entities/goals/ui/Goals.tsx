import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import styles from "./Goals.module.css";

const Goals: React.FC = () => {
  const goalsRaw = useSelector((state: RootState) => state.goals.list);
  const resources = useSelector((state: RootState) => state.resources);
  const village = useSelector((state: RootState) => state.village);

  const [showAchievements, setShowAchievements] = useState(false);

  // 🔑 убираем дубликаты по id
  const goals = useMemo(() => {
    const seen = new Set<string>();
    return goalsRaw.filter((g) => {
      if (seen.has(g.id)) return false;
      seen.add(g.id);
      return true;
    });
  }, [goalsRaw]);

  const currentGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const renderGoal = (goal: typeof goals[number]) => {
    let progress = 0;
    if (goal.requirement.resource) {
      const { type, amount } = goal.requirement.resource;
      progress = Math.min((resources[type] / amount) * 100, 100);
    } else if (goal.requirement.villageLevel) {
      progress = Math.min(
        (village.level / goal.requirement.villageLevel) * 100,
        100
      );
    }

    const rewardText = Object.entries(goal.reward)
      .map(([res, val]) => `${val} ${res}`)
      .join(", ");

    return (
      <li key={goal.id} className={styles.goalItem}>
        <div className={styles.goalText}>
          {goal.description} {goal.completed ? "✅" : ""}
        </div>
        <div className={styles.reward}>🏆 Награда: {rewardText}</div>
        {!goal.completed && (
          <div className={styles.progressBarContainer}>
            <div
              className={`${styles.progressBar} ${
                goal.completed
                  ? styles.progressComplete
                  : styles.progressInProgress
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div>
      <ul>{currentGoals.map(renderGoal)}</ul>

      <button
        className={styles.achievementsButton}
        onClick={() => setShowAchievements((prev) => !prev)}
      >
        🏅 {showAchievements ? "Скрыть достижения" : "Показать достижения"}
      </button>

      {showAchievements && (
        <div className={styles.achievementsList}>
          <h3>🏆 Достижения</h3>
          <ul>{completedGoals.map(renderGoal)}</ul>
        </div>
      )}
    </div>
  );
};

export default Goals;
