import React from 'react';
import { Lock } from 'lucide-react';
import { BADGES } from '../constants';
import { Button } from '../components/Button';
import { GameState } from '../types';

interface Props {
  gameState: GameState;
  onBack: () => void;
}

export const BadgesScreen: React.FC<Props> = ({ gameState, onBack }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tus Logros</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {BADGES.map((badge) => {
          const isUnlocked = gameState.badges.includes(badge.id) || gameState.points >= badge.requiredPoints;
          
          return (
            <div 
              key={badge.id}
              className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                isUnlocked 
                  ? 'bg-white border-[#00965E]/30 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0
                ${isUnlocked ? 'bg-green-100' : 'bg-gray-200'}
              `}>
                {isUnlocked ? badge.icon : <Lock size={24} className="text-gray-400" />}
              </div>
              
              <div>
                <h4 className={`font-bold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className="text-sm text-gray-500 leading-tight mb-1">
                  {badge.description}
                </p>
                {!isUnlocked && (
                  <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                    Requiere {badge.requiredPoints} pts
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" fullWidth onClick={onBack}>
        Volver
      </Button>
    </div>
  );
};