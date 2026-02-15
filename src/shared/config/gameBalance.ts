export type ResourceType = "wood" | "stone" | "food" | "gold";

export const DAY_FOOD_BONUS = 1;
export const NIGHT_GOLD_BONUS = 1;

export const HIRE_BASE_FOOD_COST = 10;
export const HIRE_COST_STEP = 2;

export const VILLAGE_BASE_WORKER_CAPACITY = 3;
export const VILLAGE_WORKER_CAPACITY_PER_LEVEL = 2;

export const VILLAGE_UPGRADE_WOOD_PER_LEVEL = 100;
export const VILLAGE_UPGRADE_STONE_PER_LEVEL = 100;
export const VILLAGE_UPGRADE_GOLD_PER_LEVEL = 50;

export const INITIAL_WOOD_GOAL = 20;
export const INITIAL_VILLAGE_GOAL_LEVEL = 2;
export const INITIAL_WOOD_GOAL_REWARD_GOLD = 5;

export const RESOURCE_GOAL_MULTIPLIER = 2;
export const RESOURCE_GOAL_GOLD_REWARD_DIVISOR = 10;
export const VILLAGE_GOAL_NEXT_REWARD_GOLD = 50;

const resourceGenitive: Record<ResourceType, string> = {
  wood: "дерева",
  stone: "камня",
  food: "еды",
  gold: "золота",
};

export function getHireCost(workerCount: number): number {
  return HIRE_BASE_FOOD_COST + workerCount * HIRE_COST_STEP;
}

export function getVillageMaxWorkers(level: number): number {
  return VILLAGE_BASE_WORKER_CAPACITY + (level - 1) * VILLAGE_WORKER_CAPACITY_PER_LEVEL;
}

export function getVillageUpgradeCost(level: number) {
  return {
    wood: VILLAGE_UPGRADE_WOOD_PER_LEVEL * level,
    stone: VILLAGE_UPGRADE_STONE_PER_LEVEL * level,
    gold: level > 1 ? VILLAGE_UPGRADE_GOLD_PER_LEVEL * (level - 1) : 0,
  };
}

export function getNextResourceGoalAmount(currentAmount: number): number {
  return currentAmount * RESOURCE_GOAL_MULTIPLIER;
}

export function getResourceGoalRewardGold(currentAmount: number): number {
  return Math.max(1, Math.floor(currentAmount / RESOURCE_GOAL_GOLD_REWARD_DIVISOR));
}

export function formatResourceGoalDescription(type: ResourceType, amount: number): string {
  return `Собери ${amount} ${resourceGenitive[type]}`;
}

export function getGatherAmount(type: ResourceType, isNight: boolean): number {
  let amount = 1;

  if (!isNight && type === "food") {
    amount += DAY_FOOD_BONUS;
  }

  if (isNight && type === "gold") {
    amount += NIGHT_GOLD_BONUS;
  }

  return amount;
}
