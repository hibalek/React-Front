export type GoalKey = 'sleep' | 'water' | 'sport' | 'meals' | 'weight' | 'imc' | 'dietCompliance';

export type Patient = {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  imc: number;
  progression: Record<GoalKey, number>;
  goals: Record<GoalKey, number>;
  history: Array<{
    date: string;
    sleep: number;
    water: number;
    sport: number;
    meals: number;
    weight: number;
    imc: number;
    dietCompliance: boolean;
  }>;
};