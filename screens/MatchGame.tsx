import React, { useState, useEffect } from 'react';
import { DATA_BY_LEVEL, GAME_IDS } from '../constants';
import { MatchItem } from '../types';
import { Button } from '../components/Button';
import { Shuffle, Star, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const MatchGame: React.FC<Props> = ({ level, onComplete }) => {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const levelItems = DATA_BY_LEVEL.MATCH[level];
    const shuffled = [...levelItems].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setMatchedIds([]);
    setAttempts(0);
  }, [level]);

  const handleItemClick = (id: string) => {
    if (matchedIds.includes(id) || wrongPair.length > 0) return;

    if (selectedId === null) {
      setSelectedId(id);
    } else {
      if (selectedId === id) return;

      setAttempts(prev => prev + 1);
      const firstItem = items.find(i => i.id === selectedId);
      const secondItem = items.find(i => i.id === id);

      if (firstItem && secondItem && firstItem.matchId === secondItem.id) {
        setMatchedIds(prev => [...prev, firstItem.id, secondItem.id]);
        setSelectedId(null);
      } else {
        setWrongPair([selectedId, id]);
        setTimeout(() => {
          setWrongPair([]);
          setSelectedId(null);
        }, 1000);
      }
    }
  };

  const allMatched = items.length > 0 && matchedIds.length === items.length;

  const handleComplete = async () => {
    const minAttempts = items.length / 2;
    const penalty = Math.max(0, (attempts - minAttempts) * 10);
    const baseScore = level === 3 ? 150 : (level === 2 ? 120 : 100); 
    const finalScore = Math.max(20, baseScore - penalty);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onComplete(finalScore);
        return;
      }

      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      const gameId = GAME_IDS.MATCH[level];

      if (!completed.includes(gameId)) {
        const newCompleted = [...completed, gameId];
        
        await supabase
          .from('game_state')
          .update({ completed_games: newCompleted })
          .eq('user_id', session.user.id);
      }

      setShowCelebration(true);
      setTimeout(() => {
        onComplete(finalScore);
      }, 2000);
    } catch (error) {
      console.error('Error saving match progress:', error);
      onComplete(finalScore);
    }
  };

  if (allMatched) {
    const minAttempts = items.length / 2;
    const penalty = Math.max(0, (attempts - minAttempts) * 10);
    const baseScore = level === 3 ? 150 : (level === 2 ? 120 : 100); 
    const finalScore = Math.max(20, baseScore - penalty);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Stars */}
        {showCelebration && (
          <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  <Star className="text-yellow-400" size={20 + Math.random() * 20} fill="currentColor" />
                </div>
              ))}
            </div>
            <style>{`
              @keyframes float {
                0% {
                  transform: translateY(0) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(100vh) rotate(360deg);
                  opacity: 0;
                }
              }
              .animate-float {
                animation: float linear forwards;
              }
            `}</style>
          </>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10 transform animate-bounce-in">
          <div className="inline-block p-4 rounded-full bg-yellow-100 text-yellow-600 mb-4 animate-bounce">
            <Shuffle size={48} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            ¡Nivel {level} Completado!
          </h2>
          <p className="text-gray-600 mb-4">Intentos: {attempts}</p>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-yellow-200">
            <p className="text-gray-700 text-lg mb-2 font-semibold">Puntos Ganados</p>
            <p className="text-6xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              {finalScore}
            </p>
          </div>

          <Button onClick={handleComplete} fullWidth className="shadow-lg">
            Continuar al Menú
          </Button>
        </div>

        <style>{`
          @keyframes bounce-in {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold uppercase text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Nivel {level}</span>
        <h3 className="text-gray-600 font-medium">Selecciona pares</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          const isMatched = matchedIds.includes(item.id);
          const isWrong = wrongPair.includes(item.id);

          let itemStyle = "bg-white border-gray-200 text-gray-600";
          if (isSelected) itemStyle = "bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-200";
          if (isMatched) itemStyle = "bg-green-100 border-green-400 text-green-800 opacity-50 scale-95";
          if (isWrong) itemStyle = "bg-red-100 border-red-400 text-red-800 animate-pulse";

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              disabled={isMatched}
              className={`
                p-4 rounded-xl border-2 font-bold text-sm md:text-base shadow-sm transition-all duration-200
                min-h-[80px] flex items-center justify-center text-center break-words
                ${itemStyle}
              `}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};
