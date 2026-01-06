import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { DATA_BY_LEVEL, GAME_IDS } from '../constants';
import { supabase } from '../supabaseClient';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const TriviaGame: React.FC<Props> = ({ level: userLevel, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentTriviaLevel, setCurrentTriviaLevel] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    loadTriviaProgress();
    return () => stopTimer();
  }, []);

  const loadTriviaProgress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentTriviaLevel(1);
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
      let levelToPlay: 1 | 2 | 3 = 1;
      
      if (completed.includes('trivia-level-1') && completed.includes('trivia-level-2')) {
        levelToPlay = 3;
      } else if (completed.includes('trivia-level-1')) {
        levelToPlay = 2;
      } else {
        levelToPlay = 1;
      }

      setCurrentTriviaLevel(levelToPlay);
      setLoading(false);
    } catch (error) {
      console.error('Error loading trivia progress:', error);
      setCurrentTriviaLevel(1);
      setLoading(false);
    }
  };

  const questions = DATA_BY_LEVEL.TRIVIA[currentTriviaLevel];
  const currentQ = questions[index];

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startGame = () => {
    setIsGameActive(true);
    startTimer();
  };

  const finishGame = () => {
    stopTimer();
    setIsGameActive(false);
    setIsFinished(true);
  };

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
        setScore(s => s + 50);
    }
    
    if (index < questions.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      finishGame();
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
      const gameId = GAME_IDS.TRIVIA[currentTriviaLevel];

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
      console.error('Error saving trivia progress:', error);
      onComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando trivia...</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
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
                  <Star className="text-purple-400" size={20 + Math.random() * 20} fill="currentColor" />
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
          <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-600 mb-4">
            <Timer size={48} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ¡Nivel {currentTriviaLevel} Completado!
          </h2>
          
          <div className="text-left max-w-xs mx-auto bg-gray-50 p-4 rounded-lg mb-6">
            <p className="flex justify-between mb-2"><span>Nivel:</span> <span className="font-bold">{currentTriviaLevel}</span></p>
            <p className="flex justify-between mb-2"><span>Preguntas:</span> <span className="font-bold">{index + 1}/{questions.length}</span></p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
            <p className="text-gray-700 text-lg mb-2 font-semibold">Puntos Ganados</p>
            <p className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {score}
            </p>
          </div>

          <Button onClick={handleComplete} fullWidth className="shadow-lg">
            Recoger Puntos
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

  if (!isGameActive) {
    return (
      <div className="text-center py-12 space-y-8">
        <div className="inline-block p-6 rounded-full bg-purple-100 text-purple-600 mb-2 animate-pulse">
          <Zap size={64} />
        </div>
        <div>
            <div className="text-xs font-bold uppercase text-purple-600 bg-purple-100 inline-block px-2 py-1 rounded mb-2">Nivel {currentTriviaLevel}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Trivia Flash BIOFIT</h2>
            <p className="text-gray-600">Tienes 30 segundos para responder tantas preguntas como puedas.</p>
        </div>
        <Button onClick={startGame} fullWidth className="text-lg h-14 bg-purple-600 hover:bg-purple-700">
          ¡Empezar Ya!
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center font-bold text-gray-500 text-sm">
            <span>Nivel {currentTriviaLevel} - Pregunta {index + 1}</span>
            <span className={`${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-purple-600'} flex items-center gap-1`}>
                <Timer size={16} /> {timeLeft}s
            </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-linear" 
                style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 flex-grow flex items-center justify-center">
        <h3 className="text-xl font-bold text-center text-gray-800">{currentQ.question}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map((opt, i) => (
            <button 
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full bg-white border-2 border-gray-100 p-4 rounded-xl text-left font-semibold text-gray-700 hover:bg-purple-50 hover:border-purple-200 active:scale-98 transition-all"
            >
                {opt}
            </button>
        ))}
      </div>
    </div>
  );
};
