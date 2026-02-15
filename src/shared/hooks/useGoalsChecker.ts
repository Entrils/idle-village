import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { completeGoal, addGoal, type Goal } from "@/entities/goals/model/goalSlice";
import { addResource } from "@/entities/resource/model/resourceSlice";
import { addNotification } from "@/entities/notifications/model/notificationSlice";
import {
  formatResourceGoalDescription,
  getNextResourceGoalAmount,
  getResourceGoalRewardGold,
  VILLAGE_GOAL_NEXT_REWARD_GOLD,
} from "@/shared/config/gameBalance";
import { getNextStoryGoal } from "@/shared/config/storyGoals";
import { playSfx } from "@/shared/lib/sfx";

export function useGoalsChecker() {
  const dispatch = useDispatch();
  const resources = useSelector((state: RootState) => state.resources);
  const village = useSelector((state: RootState) => state.village);
  const goals = useSelector((state: RootState) => state.goals.list);

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

    if (!nextGoal || nextGoal.id === lastProcessedId.current) return;

    lastProcessedId.current = nextGoal.id;
    dispatch(completeGoal(nextGoal.id));

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

    playSfx("achievement");
    dispatch(
      addNotification({
        message: `Цель выполнена: ${nextGoal.description}`,
        type: "achievement",
      })
    );

    if (nextGoal.kind === "story" && nextGoal.storyKey) {
      const nextStoryGoal = getNextStoryGoal(nextGoal.storyKey);
      if (!nextStoryGoal) {
        return;
      }

      dispatch(
        addGoal({
          description: nextStoryGoal.description,
          kind: "story",
          storyKey: nextStoryGoal.key,
          requirement: nextStoryGoal.requirement,
          reward: nextStoryGoal.reward,
          completed: false,
        })
      );
      return;
    }

    if (nextGoal.requirement.resource) {
      const { type, amount } = nextGoal.requirement.resource;
      const nextAmount = getNextResourceGoalAmount(amount);
      dispatch(
        addGoal({
          description: formatResourceGoalDescription(type, nextAmount),
          kind: "repeatable",
          requirement: { resource: { type, amount: nextAmount } },
          reward: { gold: getResourceGoalRewardGold(amount) },
          completed: false,
        })
      );
      return;
    }

    if (nextGoal.requirement.villageLevel) {
      dispatch(
        addGoal({
          description: `Подними деревню до ${nextGoal.requirement.villageLevel + 1} уровня`,
          kind: "repeatable",
          requirement: { villageLevel: nextGoal.requirement.villageLevel + 1 },
          reward: { gold: VILLAGE_GOAL_NEXT_REWARD_GOLD },
          completed: false,
        })
      );
    }
  }, [resources, village, goals, dispatch]);
}
