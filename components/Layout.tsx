import React from 'react';
import { Trophy, LogOut } from 'lucide-react';
import { GameState } from '../types';
import { LEVEL_THRESHOLDS, LOGO_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  gameState: GameState;
  onGoHome: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, gameState, onGoHome, onLogout }) => {
  const getLevelTitle = (points: number) => {
    if (points >= LEVEL_THRESHOLDS.EXPERTO) return "Experto BIOFIT";
    if (points >= LEVEL_THRESHOLDS.AVANZADO) return "Avanzado";
    return "Principiante";
  };

  const progressToNext = () => {
    if (gameState.points >= LEVEL_THRESHOLDS.EXPERTO) return 100;
    if (gameState.points >= LEVEL_THRESHOLDS.AVANZADO) {
        return ((gameState.points - LEVEL_THRESHOLDS.AVANZADO) / (LEVEL_THRESHOLDS.EXPERTO - LEVEL_THRESHOLDS.AVANZADO)) * 100;
    }
    return (gameState.points / LEVEL_THRESHOLDS.AVANZADO) * 100;
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-[#00965E] text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center cursor-pointer" onClick={onGoHome}>
             {/* Logo Image */}
             <img 
                src={LOGO_URL} 
                alt="BIOFIT" 
                className="h-8 object-contain brightness-0 invert" 
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
             />
             {/* Fallback Text if image fails */}
             <div className="hidden font-black text-2xl tracking-tighter italic">BIOFIT<sup className="text-xs font-normal">®</sup></div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                <Trophy size={16} className="text-yellow-300" />
                <span className="font-bold">{gameState.points}</span>
            </div>
            <button 
                onClick={onLogout} 
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Cerrar Sesión"
            >
                <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative pt-1">
            <div className="flex mb-1 items-center justify-between">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#00965E] bg-white">
                    {getLevelTitle(gameState.points)}
                </span>
                <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-white">
                        {gameState.points} / {gameState.points < 300 ? 300 : 800}
                    </span>
                </div>
            </div>
            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-[#007045]">
                <div style={{ width: `${progressToNext()}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400 transition-all duration-500"></div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 bg-gray-50 overflow-y-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-xs text-gray-500 border-t border-gray-200">
        <p>© 2025 PharmaBrand. Entrenamiento Interno.</p>
      </footer>
    </div>
  );
};