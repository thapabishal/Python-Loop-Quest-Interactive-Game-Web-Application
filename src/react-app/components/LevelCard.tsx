import { motion } from 'framer-motion';
import { Lock, Check, Star } from 'lucide-react';

interface LevelCardProps {
  level: number;
  title: string;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export default function LevelCard({
  level,
  title,
  isCompleted,
  isLocked,
  isCurrent,
  onClick,
}: LevelCardProps) {
  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={isLocked}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        isLocked
          ? 'bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-50'
          : isCurrent
          ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400 shadow-lg shadow-purple-500/50'
          : isCompleted
          ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-400 shadow-lg shadow-emerald-500/30'
          : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-purple-400'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-white">Level {level}</span>
        {isLocked && <Lock className="w-5 h-5 text-slate-400" />}
        {isCompleted && !isCurrent && <Check className="w-6 h-6 text-white" />}
        {isCurrent && <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />}
      </div>
      <p className="text-sm text-white/90 font-medium">{title}</p>
    </motion.button>
  );
}
