import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  initialCode: string;
  onCodeChange: (code: string) => void;
}

export default function CodeEditor({ initialCode, onCodeChange }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  // Update code when initialCode prop changes (e.g., when switching levels)
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-3 text-sm text-slate-400 font-code">main.py</span>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-3 text-slate-500 font-code text-xs">
            {code.split('\n').map((_, i) => (
              <div key={i} className="h-6 leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={handleChange}
            className="w-full bg-transparent text-slate-100 font-code text-sm p-4 pl-16 resize-none focus:outline-none min-h-[200px]"
            spellCheck={false}
            style={{ lineHeight: '1.5rem' }}
            rows={code.split('\n').length}
          />
        </div>
      </div>
    </motion.div>
  );
}
