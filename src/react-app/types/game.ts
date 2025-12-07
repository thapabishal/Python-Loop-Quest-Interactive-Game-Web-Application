export interface Level {
  id: number;
  title: string;
  description: string;
  challenge: string;
  expectedOutput: string[];
  starterCode: string;
  solution: string;
  hint: string;
  points: number;
  timeLimit: number; // seconds for bonus
}

export interface GameState {
  currentLevel: number;
  score: number;
  completedLevels: number[];
  hintsUsed: number;
  startTime: number | null;
}
