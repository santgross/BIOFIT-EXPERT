import React, { useState, useEffect } from 'react';
import { DATA_BY_LEVEL, GAME_IDS } from '../constants';
import { MatchItem } from '../types';
import { Button } from '../components/Button';
import { Shuffle } from 'lucide-react';
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

  useEffect(() => {
    const levelItems = DATA_BY_LEVEL.MATCH[level];
    // Simple shuffle
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
      if (selectedId === id) return; // Clicked same item

      setAttempts(prev => prev + 1);
      const firstItem = items.find(i => i.id === selectedId);
      const secondItem = items.find(i => i.id === id);

      if (firstItem && secondItem && firstItem.matchId === secondItem.id) {
        // Match found
        setMatchedIds(prev => [...prev, firstItem.id, secondItem.id]);
        setSelectedId(null);
      } else {
        // Wrong match
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
    // Calcular puntos
    const minAttempts = items.length / 2;
    const penalty = Math.max(0, (attempts - minAttempts) * 10);
    const baseScore = level === 3 ? 150 : (level === 2 ? 120 : 100); 
    const finalScore = Math.max(20, baseScore - penalty);

    // Guardar progreso en Supabase
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onComplete(finalScore);
        return;
      }

      // Obtener estado actual
      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      const gameId = GAME_IDS.MATCH[level];

      // Solo agregar si no está completado
      if (!completed.includes(gameId)) {
        const newCompleted = [...completed, gameId];
        
        await supabase
          .from('game_state')
          .update({ completed_games: newCompleted })
          .eq('user_id', session.user.id);
      }

      onComplete(finalScore);
    } catch (error) {
      console.error('Error saving match progress:', error);
      onComplete(finalScore);
    }
  };

  if (allMatched) {
    // Score calculation based on difficulty level
    const minAttempts = items.length / 2;
    const penalty = Math.max(0, (attempts - minAttempts) * 10);
    const baseScore = level === 3 ? 150 : (level === 2 ? 120 : 100); 
    const finalScore = Math.max(20, baseScore - penalty);

    return (
      <div className="text-center py-10 space-y-6">
        <div className="inline-block p-4 rounded-full bg-yellow-100 text-yellow-600 mb-4 animate-bounce">
          <Shuffle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">¡Conexiones Nivel {level}!</h2>
        <p className="text-gray-600">Intentos: {attempts}</p>
        <p className="text-xl font-bold text-[#00965E]">Puntos: +{finalScore}</p>
        <Button onClick={handleComplete} fullWidth>
          Continuar
        </Button>
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

          let itemStyle = "bg-white border-gray-200 text-gray-600"; // Default
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
