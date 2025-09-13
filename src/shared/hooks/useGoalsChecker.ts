import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import {
  completeGoal,
  addGoal,
  type Goal,
} from "@/entities/goals/model/goalSlice";
import { addResource } from "@/entities/resource/model/resourceSlice";
import { addNotification } from "@/entities/notifications/model/notificationSlice";

export function useGoalsChecker() {
  const dispatch = useDispatch();
  const resources = useSelector((state: RootState) => state.resources);
  const village = useSelector((state: RootState) => state.village);
  const goals = useSelector((state: RootState) => state.goals.list);

  // 🛑 чтобы не зациклилось — храним последний обработанный goal
  const lastProcessedId = useRef<string | null>(null);

  useEffect(() => {
    const nextGoal = goals.find((goal: Goal) => {
      if (goal.completed) return false;

      if (goal.requirement.resource) {
        const { type, amount } = goal.requirement.resource;
        return resources[type] >= amount;
      }

      if (goal.requirement.villageLevel) {
        return village.level >= goal.requirement.villageLevel;
      }

      return false;
    });

    // нет выполненной цели или уже обработали — выходим
    if (!nextGoal || nextGoal.id === lastProcessedId.current) return;

    // запоминаем, чтобы не зациклиться
    lastProcessedId.current = nextGoal.id;

    // ✅ помечаем цель выполненной
    dispatch(completeGoal(nextGoal.id));

    // ✅ выдаём награды
    if (nextGoal.reward.wood) {
      dispatch(addResource({ type: "wood", amount: nextGoal.reward.wood }));
    }
    if (nextGoal.reward.stone) {
      dispatch(addResource({ type: "stone", amount: nextGoal.reward.stone }));
    }
    if (nextGoal.reward.food) {
      dispatch(addResource({ type: "food", amount: nextGoal.reward.food }));
    }
    if (nextGoal.reward.gold) {
      dispatch(addResource({ type: "gold", amount: nextGoal.reward.gold }));
    }

    // ✅ уведомление о выполнении
    dispatch(
      addNotification({
        message: `🎉 Цель выполнена: ${nextGoal.description}`,
        type: "achievement",
      })
    );

    // ✅ добавляем новую цель (id сгенерируется в slice)
    if (nextGoal.requirement.resource) {
      const { type, amount } = nextGoal.requirement.resource;
      dispatch(
        addGoal({
          description: `Собрать ${amount * 2} ${type}`,
          requirement: { resource: { type, amount: amount * 2 } },
          reward: { gold: Math.floor(amount / 10) },
          completed: false,
        })
      );
    } else if (nextGoal.requirement.villageLevel) {
      dispatch(
        addGoal({
          description: `Достичь уровня деревни ${
            nextGoal.requirement.villageLevel + 1
          }`,
          requirement: { villageLevel: nextGoal.requirement.villageLevel + 1 },
          reward: { gold: 50 },
          completed: false,
        })
      );
    }
  }, [resources, village, goals, dispatch]);
}
