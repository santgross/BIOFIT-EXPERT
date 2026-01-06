import React, { useState, useEffect, useMemo } from 'react';
import { Timer, Star, CheckCircle2 } from 'lucide-react';
import { DATA_BY_LEVEL, GAME_IDS } from '../constants';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const TriviaGame: React.FC<Props> = ({ level, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentTriviaLevel, setCurrentTriviaLevel] = useState(1);

  useEffect(() => {
    loadTriviaProgress();
  }, []);

  const loadTriviaProgress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentTriviaLevel(1);
        return;
      }

      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      
      let levelToLoad = 1;
      if (completed.includes('trivia-level-1') && completed.includes('trivia-level-2')) {
        levelToLoad = 3;
      } else if (completed.includes('trivia-level-1')) {
        levelToLoad = 2;
      }

      setCurrentTriviaLevel(levelToLoad);
    } catch (error) {
      console.error('Error loading trivia progress:', error);
      setCurrentTriviaLevel(1);
    }
  };

  const questions = useMemo(() => {
    return DATA_BY_LEVEL.TRIVIA[currentTriviaLevel] || [];
  }, [currentTriviaLevel]);

  useEffect(() => {
    if (showResult || isFinished || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult, isFinished, timeLeft]);

  const handleTimeout = () => {
    setShowResult(true);
  };

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    if (isCorrect) {
      setScore(s => s + 50);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setTimeLeft(30);
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
        .select('completed_games, points')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      const gameId = GAME_IDS.TRIVIA[currentTriviaLevel];
      const alreadyCompleted = completed.includes(gameId);

      if (!alreadyCompleted) {
        const newCompleted = [...completed, gameId];
        const currentPoints = gameState?.points || 0;
        
        await supabase
          .from('game_state')
          .update({ 
            completed_games: newCompleted,
            points: currentPoints + score
          })
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Cargando preguntas...</p>
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
          <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-600 mb-4">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ¡Nivel {currentTriviaLevel} Completado!
          </h2>
          <p className="text-gray-600 mb-4">Has demostrado tu conocimiento sobre BIOFIT</p>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
            <p className="text-gray-700 text-lg mb-2 font-semibold">Puntos Ganados</p>
            <p className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {score}
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

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.correctIndex;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase text-purple-600 bg-purple-100 px-3 py-1 rounded">
          Nivel {currentTriviaLevel} - Pregunta {currentQuestionIndex + 1}/{questions.length}
        </span>
        <div className={`flex items-center gap-2 px-3 py-1 rounded font-bold ${
          timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          <Timer size={16} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-inner border-2 border-purple-100">
        <p className="text-lg font-medium text-gray-800 text-center leading-relaxed">
          {currentQuestion.question}
        </p>
      </div>

      <div className="space-y-3 flex-grow">
        {currentQuestion.options.map((option, index) => {
          let buttonStyle = "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50";
          
          if (showResult) {
            if (index === currentQuestion.correctIndex) {
              buttonStyle = "bg-green-100 border-2 border-green-500 text-green-800";
            } else if (index === selectedOption) {
              buttonStyle = "bg-red-100 border-2 border-red-500 text-red-800";
            } else {
              buttonStyle = "bg-gray-100 border-2 border-gray-200 text-gray-500 opacity-50";
            }
          } else if (selectedOption === index) {
            buttonStyle = "bg-purple-100 border-2 border-purple-500 text-purple-800 ring-2 ring-purple-200";
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl font-medium text-left transition-all duration-200 ${buttonStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!showResult ? (
        <Button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          fullWidth
          className="shadow-lg"
        >
          Confirmar Respuesta
        </Button>
      ) : (
        <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-center font-bold mb-3 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '¡Correcto! +50 puntos' : 'Incorrecto - Respuesta correcta marcada'}
          </p>
          <Button onClick={handleNext} fullWidth>
            {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
          </Button>
        </div>
      )}
    </div>
  );
};
