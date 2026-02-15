import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  INITIAL_VILLAGE_GOAL_LEVEL,
  INITIAL_WOOD_GOAL,
  INITIAL_WOOD_GOAL_REWARD_GOLD,
} from "@/shared/config/gameBalance";
import { getFirstStoryGoal } from "@/shared/config/storyGoals";

export interface Goal {
  id: string;
  description: string;
  kind?: "repeatable" | "story";
  storyKey?: string;
  requirement: {
    resource?: { type: "wood" | "stone" | "food" | "gold"; amount: number };
    villageLevel?: number;
  };
  reward: { gold?: number; food?: number; wood?: number; stone?: number };
  completed: boolean;
}

interface GoalsState {
  list: Goal[];
  counter: number;
}

function generateUniqueId(prefix: string = "goal") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function ensureUniqueId(list: Goal[], prefix: string = "goal"): string {
  let id: string;
  do {
    id = generateUniqueId(prefix);
  } while (list.some((goal) => goal.id === id));
  return id;
}

function createInitialGoals(): Goal[] {
  const list: Goal[] = [];

  list.push({
    id: ensureUniqueId(list),
    description: `Накопи ${INITIAL_WOOD_GOAL} дерева`,
    kind: "repeatable",
    requirement: { resource: { type: "wood", amount: INITIAL_WOOD_GOAL } },
    reward: { gold: INITIAL_WOOD_GOAL_REWARD_GOLD },
    completed: false,
  });

  list.push({
    id: ensureUniqueId(list),
    description: `Подними деревню до ${INITIAL_VILLAGE_GOAL_LEVEL} уровня`,
    kind: "repeatable",
    requirement: { villageLevel: INITIAL_VILLAGE_GOAL_LEVEL },
    reward: { gold: 10, food: 10 },
    completed: false,
  });

  const firstStoryGoal = getFirstStoryGoal();
  list.push({
    id: ensureUniqueId(list),
    description: firstStoryGoal.description,
    kind: "story",
    storyKey: firstStoryGoal.key,
    requirement: firstStoryGoal.requirement,
    reward: firstStoryGoal.reward,
    completed: false,
  });

  return list;
}

const initialState: GoalsState = {
  list: createInitialGoals(),
  counter: 3,
};

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    completeGoal: (state, action: PayloadAction<string>) => {
      const goal = state.list.find((item) => item.id === action.payload);
      if (goal && !goal.completed) {
        goal.completed = true;
      }
    },
    addGoal: (state, action: PayloadAction<Omit<Goal, "id">>) => {
      const newGoal = { ...action.payload, id: ensureUniqueId(state.list) };

      const exists = state.list.some(
        (goal) =>
          (newGoal.storyKey && goal.storyKey === newGoal.storyKey) ||
          (!newGoal.storyKey &&
            !goal.storyKey &&
            JSON.stringify(goal.requirement) === JSON.stringify(newGoal.requirement))
      );

      if (!exists) {
        state.list.push(newGoal);
      }
    },
    resetGoals: (state) => {
      state.list = createInitialGoals();
      state.counter = initialState.counter;
    },
  },
});

export const { completeGoal, addGoal, resetGoals } = goalsSlice.actions;
export default goalsSlice.reducer;
