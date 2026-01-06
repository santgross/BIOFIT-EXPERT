import React, { useState, useEffect, useMemo } from 'react';
import { User, MessageCircle, AlertTriangle, CheckCircle2, Star } from 'lucide-react';
import { DATA_BY_LEVEL, GAME_IDS } from '../constants';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const ScenarioGame: React.FC<Props> = ({ level: userLevel, onComplete }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentScenarioLevel, setCurrentScenarioLevel] = useState<1 | 2 | 3>(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenarioProgress();
  }, []);

  const loadScenarioProgress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentScenarioLevel(2); // Nivel 2 por defecto (no hay nivel 1)
        setLoading(false);
        return;
      }

      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];

      // Determinar qué nivel debe jugar
      let levelToPlay: 2 | 3 = 2;
      
      if (completed.includes('scenario-level-2')) {
        levelToPlay = 3; // Si completó nivel 2, juega nivel 3
      } else {
        levelToPlay = 2; // Primera vez, juega nivel 2
      }

      setCurrentScenarioLevel(levelToPlay);
      setLoading(false);
    } catch (error) {
      console.error('Error loading scenario progress:', error);
      setCurrentScenarioLevel(2);
      setLoading(false);
    }
  };

  const scenarios = useMemo(() => {
    const all = DATA_BY_LEVEL.SCENARIO[currentScenarioLevel];
    if (all.length === 0) return [];
    return [...all].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [currentScenarioLevel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando casos...</p>
        </div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-10 space-y-6 bg-white rounded-2xl p-8 shadow-sm">
        <div className="inline-block p-4 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">¡Felicidades!</h2>
        <p className="text-gray-600">Has completado todos los casos de mostrador disponibles.</p>
        <Button onClick={() => onComplete(0)} fullWidth>
          Volver al Menú
        </Button>
      </div>
    );
  }

  const scenario = scenarios[currentScenarioIndex];

  const handleChoice = (identifiedAsCorrect: boolean) => {
    const userGuessedCorrectly = identifiedAsCorrect === scenario.isCorrect;
    
    if (userGuessedCorrectly) {
      setScore(s => s + 50);
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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        onComplete(score);
        return;
      }

      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      const gameId = GAME_IDS.SCENARIO[currentScenarioLevel];

      if (!completed.includes(gameId)) {
        const newCompleted = [...completed, gameId];
        
        await supabase
          .from('game_state')
          .update({ completed_games: newCompleted })
          .eq('user_id', session.user.id);
      }

      setShowCelebration(true);
      setTimeout(() => {
        onComplete(score);
      }, 2000);
    } catch (error) {
      console.error('Error saving scenario progress:', error);
      onComplete(score);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
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
                  <Star className="text-red-400" size={20 + Math.random() * 20} fill="currentColor" />
                </div>
              ))}
            </div>
            <style>{`
              @keyframes float {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
              }
              .animate-float { animation: float linear forwards; }
            `}</style>
          </>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10 transform animate-bounce-in">
          <div className="inline-block p-4 rounded-full bg-green-100 text-[#00965E] mb-4">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            ¡Nivel {currentScenarioLevel} Completado!
          </h2>
          <p className="text-gray-600 mb-4">Has demostrado gran criterio en el mostrador.</p>
          
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-red-200">
            <p className="text-gray-700 text-lg mb-2 font-semibold">Puntos Ganados</p>
            <p className="text-6xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {score}
            </p>
          </div>

          <Button onClick={handleComplete} fullWidth className="shadow-lg">
            Finalizar Visita
          </Button>
        </div>

        <style>{`
          @keyframes bounce-in {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
       <div className="flex justify-between items-center">
          <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">
             Simulación Mostrador Nivel {currentScenarioLevel}
          </div>
          <div className="text-xs font-bold text-gray-400">
             CASO {currentScenarioIndex + 1} / {scenarios.length}
          </div>
       </div>

       <div className="space-y-4 flex-grow">
          <div className="flex items-start gap-3">
            <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
                <User size={20} className="text-gray-500"/>
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none text-gray-800 text-sm shadow-sm border border-gray-100 relative">
                <div className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
                <p className="text-gray-700 leading-relaxed italic">"{scenario.customer}"</p>
            </div>
          </div>

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
