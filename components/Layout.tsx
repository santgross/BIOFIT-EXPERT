import React from 'react';
import { GameState } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';
import { Home, LogOut } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  gameState: GameState;
  onGoHome: () => void;
  onLogout: () => void;
}

export const Layout: React.FC<Props> = ({ children, gameState, onGoHome, onLogout }) => {
  const getLevelName = (points: number): string => {
    if (points >= LEVEL_THRESHOLDS.MAESTRO) return 'MAESTRO BIOFIT';
    if (points >= LEVEL_THRESHOLDS.EXPERTO) return 'EXPERTO BIOFIT';
    if (points >= LEVEL_THRESHOLDS.AVANZADO) return 'AVANZADO';
    return 'PRINCIPIANTE';
  };

  const getLevelColor = (points: number): string => {
    if (points >= LEVEL_THRESHOLDS.MAESTRO) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (points >= LEVEL_THRESHOLDS.EXPERTO) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    if (points >= LEVEL_THRESHOLDS.AVANZADO) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-green-500 to-emerald-500';
  };

  const currentLevel = getLevelName(gameState.points);
  const levelColor = getLevelColor(gameState.points);
  const progressPercentage = Math.min((gameState.points / 2300) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#00965E] to-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">BIOFIT</h1>
            </div>

            {/* Right: Points, Home, Logout */}
            <div className="flex items-center gap-3">
              {/* Points Badge */}
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <span className="font-bold text-lg">{gameState.points}</span>
              </div>

              {/* Home Button */}
              <button
                onClick={onGoHome}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-200"
                title="Volver al inicio"
              >
                <Home size={20} />
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-200"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Level Badge and Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <div className={`${levelColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                {currentLevel}
              </div>
              <span className="text-sm text-white/90 font-semibold">{gameState.points} / 2410</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/30 rounded-full h-3 backdrop-blur-sm overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="h-full w-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 PharmaBrand. Entrenamiento Interno.
          </p>
        </div>
      </footer>
    </div>
  );
};
