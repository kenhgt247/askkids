import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

// --- Counting Game ---
export const CountingGame: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);

  const generateGame = () => {
    const num = Math.floor(Math.random() * 9) + 1; // 1-9 apples
    setTargetNumber(num);
    
    const opts = new Set<number>();
    opts.add(num);
    while (opts.size < 3) {
      opts.add(Math.floor(Math.random() * 9) + 1);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setGameState('playing');
  };

  useEffect(() => {
    generateGame();
  }, []);

  const handleGuess = (guess: number) => {
    if (gameState !== 'playing') return;
    if (guess === targetNumber) {
      setGameState('won');
      setScore(s => s + 10);
    } else {
      setGameState('lost');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-emerald-200">
      <div className="bg-emerald-100 p-4 flex justify-between items-center">
        <h3 className="font-bold text-emerald-800 text-lg">Bé học đếm số</h3>
        <div className="px-3 py-1 bg-white rounded-full text-emerald-600 font-bold text-sm shadow-sm">
          Điểm: {score}
        </div>
      </div>
      
      <div className="p-8 flex flex-col items-center min-h-[300px] justify-center relative">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
           {Array.from({ length: targetNumber }).map((_, i) => (
             <div key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
               <span className="text-4xl filter drop-shadow-md">🍎</span>
             </div>
           ))}
        </div>

        <p className="text-slate-500 mb-6 font-medium">Có bao nhiêu quả táo?</p>
        
        <div className="flex gap-4 w-full justify-center">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleGuess(opt)}
              className={`w-16 h-16 rounded-2xl text-2xl font-bold shadow-lg transform transition-all active:scale-95
                ${gameState === 'playing' ? 'bg-white hover:bg-emerald-50 text-slate-700 border-2 border-slate-200' : ''}
                ${gameState === 'won' && opt === targetNumber ? 'bg-emerald-500 text-white border-none scale-110' : ''}
                ${gameState === 'lost' && opt !== targetNumber ? 'opacity-50' : ''}
                ${gameState === 'lost' && opt === targetNumber ? 'bg-emerald-500 text-white' : ''}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {gameState !== 'playing' && (
           <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
             {gameState === 'won' ? (
               <div className="text-center">
                 <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-2" />
                 <p className="text-2xl font-bold text-emerald-600">Hoan hô! Bé giỏi quá!</p>
               </div>
             ) : (
               <div className="text-center">
                 <XCircle size={64} className="text-rose-500 mx-auto mb-2" />
                 <p className="text-xl font-bold text-rose-500">Sai rồi, thử lại nhé!</p>
               </div>
             )}
             <button 
               onClick={generateGame}
               className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-full font-bold shadow-lg hover:bg-emerald-600 flex items-center gap-2"
             >
               <RefreshCw size={18} /> Chơi tiếp
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Coloring Game ---
export const ColoringGame: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  // Simple state for parts of the SVG
  const [colors, setColors] = useState({
    sky: '#e0f2fe',
    sun: '#fcd34d',
    grass: '#86efac',
    houseBody: '#ffffff',
    roof: '#ffffff',
    door: '#ffffff'
  });

  const palette = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#ffffff', // White
    '#94a3b8', // Gray
    '#475569', // Slate
  ];

  const handleColor = (part: keyof typeof colors) => {
    setColors(prev => ({ ...prev, [part]: selectedColor }));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-rose-200">
      <div className="bg-rose-100 p-4">
        <h3 className="font-bold text-rose-800 text-lg">Bé tập tô màu</h3>
      </div>
      
      <div className="p-4">
        <div className="aspect-square w-full border-2 border-dashed border-slate-200 rounded-xl mb-4 overflow-hidden relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Sky */}
            <rect x="0" y="0" width="100" height="80" fill={colors.sky} onClick={() => handleColor('sky')} className="cursor-pointer hover:opacity-90 transition-opacity" />
            {/* Grass */}
            <rect x="0" y="80" width="100" height="20" fill={colors.grass} onClick={() => handleColor('grass')} className="cursor-pointer hover:opacity-90 transition-opacity" />
            {/* Sun */}
            <circle cx="85" cy="15" r="8" fill={colors.sun} onClick={() => handleColor('sun')} className="cursor-pointer hover:opacity-90 transition-opacity" />
            
            {/* House */}
            <path d="M20,80 L20,50 L50,50 L50,80 Z" fill={colors.houseBody} stroke="#334155" strokeWidth="1" onClick={() => handleColor('houseBody')} className="cursor-pointer hover:opacity-90 transition-opacity" />
            {/* Roof */}
            <path d="M15,50 L35,30 L55,50 Z" fill={colors.roof} stroke="#334155" strokeWidth="1" onClick={() => handleColor('roof')} className="cursor-pointer hover:opacity-90 transition-opacity" />
            {/* Door */}
            <rect x="30" y="65" width="10" height="15" fill={colors.door} stroke="#334155" strokeWidth="1" onClick={() => handleColor('door')} className="cursor-pointer hover:opacity-90 transition-opacity" />
          </svg>
          <div className="absolute top-2 left-2 pointer-events-none bg-white/50 px-2 rounded text-xs text-slate-500">
            Chạm vào hình để tô
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {palette.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${selectedColor === c ? 'border-slate-800 scale-110' : 'border-slate-200'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
