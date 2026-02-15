import type { ResourceType } from "@/shared/config/gameBalance";

type StoryGoalRequirement = {
  resource?: { type: ResourceType; amount: number };
  villageLevel?: number;
};

type StoryGoalReward = {
  gold?: number;
  food?: number;
  wood?: number;
  stone?: number;
};

export type StoryGoalTemplate = {
  key: string;
  description: string;
  requirement: StoryGoalRequirement;
  reward: StoryGoalReward;
  nextKey?: string;
};

const storyGoals: StoryGoalTemplate[] = [
  {
    key: "story-01",
    description: "Староста просит расчистить тропу: собери 30 дерева",
    requirement: { resource: { type: "wood", amount: 30 } },
    reward: { gold: 12, food: 8 },
    nextKey: "story-02",
  },
  {
    key: "story-02",
    description: "Каменщик готовит фундамент: собери 25 камня",
    requirement: { resource: { type: "stone", amount: 25 } },
    reward: { gold: 12, wood: 10 },
    nextKey: "story-03",
  },
  {
    key: "story-03",
    description: "Охотники вернулись с картой угодий: собери 35 еды",
    requirement: { resource: { type: "food", amount: 35 } },
    reward: { gold: 15 },
    nextKey: "story-04",
  },
  {
    key: "story-04",
    description: "Подними деревню до 2 уровня и открой склад",
    requirement: { villageLevel: 2 },
    reward: { wood: 20, stone: 20, gold: 20 },
    nextKey: "story-05",
  },
  {
    key: "story-05",
    description: "Купцы ждут товар: накопи 40 дерева",
    requirement: { resource: { type: "wood", amount: 40 } },
    reward: { gold: 18, food: 12 },
    nextKey: "story-06",
  },
  {
    key: "story-06",
    description: "Для кузни нужен камень: накопи 45 камня",
    requirement: { resource: { type: "stone", amount: 45 } },
    reward: { gold: 20 },
    nextKey: "story-07",
  },
  {
    key: "story-07",
    description: "Накорми рабочих перед походом: накопи 55 еды",
    requirement: { resource: { type: "food", amount: 55 } },
    reward: { gold: 22, wood: 15 },
    nextKey: "story-08",
  },
  {
    key: "story-08",
    description: "Ночной караван просит монеты: накопи 25 золота",
    requirement: { resource: { type: "gold", amount: 25 } },
    reward: { food: 25, stone: 15 },
    nextKey: "story-09",
  },
  {
    key: "story-09",
    description: "Подними деревню до 3 уровня и укрепи стену",
    requirement: { villageLevel: 3 },
    reward: { gold: 30, wood: 20, stone: 20 },
    nextKey: "story-10",
  },
  {
    key: "story-10",
    description: "Лесничий открывает дальний лес: накопи 90 дерева",
    requirement: { resource: { type: "wood", amount: 90 } },
    reward: { gold: 28, food: 20 },
    nextKey: "story-11",
  },
  {
    key: "story-11",
    description: "Горняки нашли новую жилу: накопи 95 камня",
    requirement: { resource: { type: "stone", amount: 95 } },
    reward: { gold: 30 },
    nextKey: "story-12",
  },
  {
    key: "story-12",
    description: "Заполни амбары к ярмарке: накопи 110 еды",
    requirement: { resource: { type: "food", amount: 110 } },
    reward: { gold: 32, wood: 25 },
    nextKey: "story-13",
  },
  {
    key: "story-13",
    description: "Заплати охране перевала: накопи 55 золота",
    requirement: { resource: { type: "gold", amount: 55 } },
    reward: { stone: 35, food: 25 },
    nextKey: "story-14",
  },
  {
    key: "story-14",
    description: "Подними деревню до 4 уровня и построй башню",
    requirement: { villageLevel: 4 },
    reward: { gold: 45, wood: 30, stone: 30 },
    nextKey: "story-15",
  },
  {
    key: "story-15",
    description: "Приготовь запасы к зиме: накопи 180 еды",
    requirement: { resource: { type: "food", amount: 180 } },
    reward: { gold: 45, wood: 40 },
    nextKey: "story-16",
  },
  {
    key: "story-16",
    description: "Финал главы: накопи 120 золота и созови совет",
    requirement: { resource: { type: "gold", amount: 120 } },
    reward: { gold: 80, wood: 50, stone: 50, food: 50 },
  },
];

const storyGoalsByKey = new Map(storyGoals.map((goal) => [goal.key, goal]));

export function getFirstStoryGoal(): StoryGoalTemplate {
  return storyGoals[0];
}

export function getStoryGoalByKey(key: string): StoryGoalTemplate | undefined {
  return storyGoalsByKey.get(key);
}

export function getNextStoryGoal(key: string): StoryGoalTemplate | undefined {
  const current = getStoryGoalByKey(key);
  if (!current?.nextKey) return undefined;
  return getStoryGoalByKey(current.nextKey);
}
