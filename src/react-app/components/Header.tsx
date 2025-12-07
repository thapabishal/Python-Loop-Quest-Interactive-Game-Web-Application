import { motion } from 'framer-motion';
import { Code2, Trophy, Lightbulb } from 'lucide-react';

interface HeaderProps {
  score: number;
  hintsUsed: number;
  onReset: () => void;
}

export default function Header({ score, hintsUsed, onReset }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"
            >
              <Code2 className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bishal's Python Loops Quest</h1>
              <p className="text-sm text-white/80">The Python Adventure</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{score}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Lightbulb className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold">{hintsUsed}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm text-white font-medium transition-colors"
            >
              Reset Progress
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
