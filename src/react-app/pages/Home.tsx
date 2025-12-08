import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lightbulb, ArrowLeft, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { useGameState } from '@/react-app/hooks/useGameState';
import { levels } from '@/react-app/data/levels';
import Header from '@/react-app/components/Header';
import LevelCard from '@/react-app/components/LevelCard';
import CodeEditor from '@/react-app/components/CodeEditor';
import OutputDisplay from '@/react-app/components/OutputDisplay';
import { executePythonCode } from '@/react-app/utils/pythonExecutor';

type GameMode = 'menu' | 'playing' | 'victory';

export default function Home() {
  const { gameState, updateGameState, resetGame, completeLevel } = useGameState();
  const [mode, setMode] = useState<GameMode>('menu');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [levelStartTime, setLevelStartTime] = useState<number>(Date.now());

  const currentLevel = levels[currentLevelIndex];
  const isLevelCompleted = gameState.completedLevels.includes(currentLevel?.id);
  

  useEffect(() => {
    if (currentLevel) {
      setUserCode(currentLevel.starterCode);
      setOutput([]);
      setIsCorrect(null);
      setShowHint(false);
      setLevelStartTime(Date.now());
    }
  }, [currentLevelIndex, currentLevel]);

  

  const handleRunCode = () => {
    setIsRunning(true);
    setIsCorrect(null);
    
    setTimeout(() => {
      const { output: codeOutput, error } = executePythonCode(userCode);
      
      if (error) {
        setOutput([`Error: ${error}`]);
        setIsCorrect(false);
        setIsRunning(false);
        return;
      }
      
      setOutput(codeOutput);
      
      const correct = 
        codeOutput.length === currentLevel.expectedOutput.length &&
        codeOutput.every((line, i) => line === currentLevel.expectedOutput[i]);
      
      setIsCorrect(correct);
      setIsRunning(false);
      
      if (correct && !isLevelCompleted) {
        const timeElapsed = (Date.now() - levelStartTime) / 1000;
        const timeBonus = timeElapsed < currentLevel.timeLimit ? 50 : 0;
        const hintPenalty = showHint ? 25 : 0;
        const finalPoints = currentLevel.points + timeBonus - hintPenalty;
        
        setTimeout(() => {
          completeLevel(currentLevel.id, finalPoints);
          updateGameState({ currentLevel: currentLevel.id });
        }, 1000);
      }
    }, 500);
  };

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true);
      updateGameState({ hintsUsed: gameState.hintsUsed + 1 });
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  };

  const handleLevelSelect = (levelIndex: number) => {
    if (levelIndex === 0 || gameState.completedLevels.includes(levels[levelIndex - 1].id)) {
      setCurrentLevelIndex(levelIndex);
      setMode('playing');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      resetGame();
      setMode('menu');
      setCurrentLevelIndex(0);
    }
  };

  if (mode === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <Header score={gameState.score} hintsUsed={gameState.hintsUsed} onReset={handleReset} />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-2xl text-center border-2 border-white/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Trophy className="w-32 h-32 text-yellow-400" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-4">Quest Complete!</h1>
            <p className="text-2xl text-white/90 mb-6">
              You've mastered Python loops!
            </p>
            <div className="bg-white/20 rounded-xl p-6 mb-8">
              <p className="text-xl text-white font-bold mb-2">Final Score</p>
              <p className="text-6xl font-bold text-yellow-400">{gameState.score}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('menu')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
            >
              Review Levels
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <Header score={gameState.score} hintsUsed={gameState.hintsUsed} onReset={handleReset} />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Quest</h2>
            <p className="text-xl text-white/80">
              Complete all levels to become a loop master!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {levels.map((level, index) => (
              <LevelCard
                key={level.id}
                level={level.id}
                title={level.title}
                isCompleted={gameState.completedLevels.includes(level.id)}
                isLocked={index > 0 && !gameState.completedLevels.includes(levels[index - 1].id)}
                isCurrent={index === gameState.currentLevel}
                onClick={() => handleLevelSelect(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <Header score={gameState.score} hintsUsed={gameState.hintsUsed} onReset={handleReset} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => setMode('menu')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Levels
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Level {currentLevel.id}: {currentLevel.title}
                  </h2>
                  <p className="text-white/80">{currentLevel.description}</p>
                </div>
                {isLevelCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-emerald-500/20 p-2 rounded-full"
                  >
                    <Trophy className="w-6 h-6 text-emerald-400" />
                  </motion.div>
                )}
              </div>

              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <p className="text-sm text-white/60 mb-2">CHALLENGE:</p>
                <p className="text-white font-medium">{currentLevel.challenge}</p>
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4"
                  >
                    <p className="text-sm text-yellow-300 mb-1 font-medium">💡 HINT:</p>
                    <p className="text-yellow-100">{currentLevel.hint}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg transition-all"
                >
                  <Play className="w-5 h-5" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowHint}
                  disabled={showHint}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-6 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 border border-yellow-500/30 transition-all"
                >
                  <Lightbulb className="w-5 h-5" />
                  Hint
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserCode(currentLevel.starterCode)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 border border-white/20 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            <CodeEditor initialCode={currentLevel.starterCode} onCodeChange={setUserCode} />
          </div>

          <div className="space-y-6">
            <OutputDisplay output={output} isRunning={isRunning} isCorrect={isCorrect} />

            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 border-2 border-emerald-400 shadow-lg shadow-emerald-500/50"
              >
                <h3 className="text-2xl font-bold text-white mb-2">🎉 Level Complete!</h3>
                <p className="text-white/90 mb-4">
                  Great job! You've earned {currentLevel.points} points!
                </p>
                {currentLevelIndex < levels.length - 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextLevel}
                    className="w-full bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Next Level
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
                {currentLevelIndex === levels.length - 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode('victory')}
                    className="w-full bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    View Results
                    <Trophy className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevLevel}
                disabled={currentLevelIndex === 0}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-30 border border-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextLevel}
                disabled={currentLevelIndex === levels.length - 1}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-30 border border-white/20 transition-all"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
