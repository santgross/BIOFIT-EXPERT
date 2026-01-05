import React, { useState, useMemo } from 'react';
import { User, MessageCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DATA_BY_LEVEL, GAME_IDS } from '../constants';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const ScenarioGame: React.FC<Props> = ({ level, onComplete }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Seleccionar 4 escenarios aleatorios del nivel o todos si son menos de 4
  const scenarios = useMemo(() => {
    const all = DATA_BY_LEVEL.SCENARIO[level];
    if (all.length === 0) return [];
    return [...all].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [level]);

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-10 space-y-6 bg-white rounded-2xl p-8 shadow-sm">
        <AlertTriangle size={48} className="mx-auto text-orange-400" />
        <h2 className="text-xl font-bold text-gray-800">Contenido en preparación</h2>
        <p className="text-gray-600">Este nivel aún no tiene simulaciones disponibles. ¡Sigue ganando puntos en otros juegos!</p>
        <Button onClick={() => onComplete(0)} fullWidth>Volver</Button>
      </div>
    );
  }

  const scenario = scenarios[currentScenarioIndex];

  const handleChoice = (identifiedAsCorrect: boolean) => {
    const userGuessedCorrectly = identifiedAsCorrect === scenario.isCorrect;
    
    if (userGuessedCorrectly) {
      setScore(s => s + 50); // Puntos por acierto en escenario
      setUserIsCorrect(true);
    } else {
      setUserIsCorrect(false);
    }
    setShowResult(true);
  };

  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(p => p + 1);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleComplete = async () => {
    // Guardar progreso en Supabase
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onComplete(score);
        return;
      }

      // Obtener estado actual
      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      const gameId = GAME_IDS.SCENARIO[level];

      // Solo agregar si no está completado
      if (!completed.includes(gameId)) {
        const newCompleted = [...completed, gameId];
        
        await supabase
          .from('game_state')
          .update({ completed_games: newCompleted })
          .eq('user_id', session.user.id);
      }

      onComplete(score);
    } catch (error) {
      console.error('Error saving scenario progress:', error);
      onComplete(score);
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-10 space-y-6 bg-white rounded-2xl p-8 shadow-sm">
        <div className="inline-block p-4 rounded-full bg-green-100 text-[#00965E] mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Simulación Completada</h2>
        <p className="text-gray-600">Has demostrado gran criterio en el mostrador.</p>
        <p className="text-2xl font-bold text-[#00965E]">+{score} Puntos</p>
        <Button onClick={handleComplete} fullWidth>
          Finalizar Visita
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
       <div className="flex justify-between items-center">
          <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">
             Simulación Mostrador Lvl {level}
          </div>
          <div className="text-xs font-bold text-gray-400">
             CASO {currentScenarioIndex + 1} / {scenarios.length}
          </div>
       </div>

       <div className="space-y-4 flex-grow">
          {/* Customer Bubble */}
          <div className="flex items-start gap-3">
            <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
                <User size={20} className="text-gray-500"/>
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none text-gray-800 text-sm shadow-sm border border-gray-100 relative">
                <div className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
                <p className="text-gray-700 leading-relaxed italic">"{scenario.customer}"</p>
            </div>
          </div>

          {/* Clerk Bubble */}
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-[#00965E] p-4 rounded-2xl rounded-tr-none text-white text-sm shadow-md relative">
                <div className="absolute -right-2 top-0 w-0 h-0 border-t-[10px] border-t-[#00965E] border-r-[10px] border-r-transparent"></div>
                <p className="leading-relaxed font-medium">{scenario.clerkResponse}</p>
            </div>
            <div className="bg-[#00965E] p-2 rounded-full flex-shrink-0 shadow-sm">
                <MessageCircle size={20} className="text-white"/>
            </div>
          </div>
       </div>

       {!showResult ? (
         <div className="bg-gray-100 p-5 rounded-2xl border-t-4 border-[#00965E] shadow-inner">
            <h3 className="text-center font-bold text-sm mb-4 text-gray-600 uppercase tracking-tight">¿Evaluación de la respuesta?</h3>
            <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleChoice(true)}
                  className="bg-white border-2 border-green-500 text-green-600 p-3 rounded-xl font-bold text-xs hover:bg-green-50 transition-colors shadow-sm active:scale-95"
                >
                    CORRECTO 👍
                </button>
                <button 
                  onClick={() => handleChoice(false)}
                  className="bg-white border-2 border-red-500 text-red-600 p-3 rounded-xl font-bold text-xs hover:bg-red-50 transition-colors shadow-sm active:scale-95"
                >
                    TIENE ERROR 👎
                </button>
            </div>
         </div>
       ) : (
         <div className={`p-6 rounded-2xl border-2 animate-in slide-in-from-bottom-4 duration-300 ${userIsCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`font-black text-lg mb-2 flex items-center gap-2 ${userIsCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {userIsCorrect ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                {userIsCorrect ? '¡BIEN HECHO!' : 'HAY QUE MEJORAR'}
            </h3>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed font-medium">{scenario.feedback}</p>
            
            {!scenario.isCorrect && (
                <div className="bg-white p-3 rounded-xl border border-red-100 mb-4 shadow-sm">
                    <span className="font-bold text-[10px] text-red-400 uppercase tracking-widest block mb-1">Criterio experto:</span>
                    <p className="text-gray-800 text-xs italic">{scenario.correctAction}</p>
                </div>
            )}

            <Button onClick={nextScenario} fullWidth className="shadow-md">
                Siguiente Caso
            </Button>
         </div>
       )}
    </div>
  );
};
