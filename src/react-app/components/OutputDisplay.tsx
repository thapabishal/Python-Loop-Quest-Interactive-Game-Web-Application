import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface OutputDisplayProps {
  output: string[];
  isRunning: boolean;
  isCorrect: boolean | null;
}

export default function OutputDisplay({ output, isRunning, isCorrect }: OutputDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="bg-slate-950 rounded-xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-slate-400 font-code">Output</span>
          {isCorrect !== null && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isCorrect ? '✓ Correct!' : '✗ Try Again'}
            </motion.span>
          )}
        </div>
        <div className="p-4 min-h-[200px] font-code text-sm">
          <AnimatePresence mode="popLayout">
            {isRunning ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-400"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Running...
              </motion.div>
            ) : output.length > 0 ? (
              <motion.div
                key="output"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1"
              >
                {output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-emerald-400"
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-slate-600 italic">
                Click "Run Code" to see the output
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
