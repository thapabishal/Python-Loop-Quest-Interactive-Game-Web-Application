import { useState, useEffect } from 'react';
import { GameState } from '@/react-app/types/game';

const STORAGE_KEY = 'loopquest_gamestate';

const initialGameState: GameState = {
  currentLevel: 0,
  score: 0,
  completedLevels: [],
  hintsUsed: 0,
  startTime: null,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialGameState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const completeLevel = (levelId: number, earnedPoints: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + earnedPoints,
      completedLevels: [...new Set([...prev.completedLevels, levelId])],
      currentLevel: Math.max(prev.currentLevel, levelId),
    }));
  };

  return { gameState, updateGameState, resetGame, completeLevel };
}
