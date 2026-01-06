import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star } from 'lucide-react';
import { DATA_BY_LEVEL } from '../constants';
import { QuestionTF } from '../types';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const TrueFalseGame: React.FC<Props> = ({ level, onComplete }) => {
  const [availableQuestions, setAvailableQuestions] = useState<QuestionTF[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [level]);

  const loadQuestions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const allQuestions = [
          ...DATA_BY_LEVEL.TF[1],
          ...DATA_BY_LEVEL.TF[2],
          ...DATA_BY_LEVEL.TF[3]
        ];
        setAvailableQuestions(allQuestions);
        return;
      }

      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      setCompletedIds(completed);

      const allQuestions = [
        ...DATA_BY_LEVEL.TF[1],
        ...DATA_BY_LEVEL.TF[2],
        ...DATA_BY_LEVEL.TF[3]
      ];

      const remaining = allQuestions.filter(q => !completed.includes(`tf${q.id}`));
      
      if (remaining.length === 0) {
        setAvailableQuestions(allQuestions);
      } else {
        setAvailableQuestions(remaining);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      const allQuestions = [
        ...DATA_BY_LEVEL.TF[1],
        ...DATA_BY_LEVEL.TF[2],
        ...DATA_BY_LEVEL.TF[3]
      ];
      setAvailableQuestions(allQuestions);
    }
  };

  const handleAnswer = (answer: boolean) => {
    if (showResult) return;
    
    const currentQuestion = availableQuestions[currentQuestionIndex];
    const correct = answer === currentQuestion.isTrue;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    if (!isCorrect) {
      setShowResult(false);
      setSelectedAnswer(null);
      return;
    }

    const currentQuestion = availableQuestions[currentQuestionIndex];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Verificar si ya está completada
      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games, points')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      const questionId = `tf${currentQuestion.id}`;
      const alreadyCompleted = completed.includes(questionId);

      // Solo guardar y sumar puntos si NO está completada
      if (!alreadyCompleted) {
        const newCompleted = [...completed, questionId];
        const currentPoints = gameState?.points || 0;

        await supabase
          .from('game_state')
          .update({ 
            completed_games: newCompleted,
            points: currentPoints + 50
          })
          .eq('user_id', session.user.id);

        setScore(s => s + 50);
        setCompletedIds(newCompleted);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }

    if (currentQuestionIndex < availableQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      await markModuleComplete();
    }
  };

  const markModuleComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setGameFinished(true);
        return;
      }

      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      
      if (!completed.includes('true-false-complete')) {
        const newCompleted = [...completed, 'true-false-complete'];
        
        await supabase
          .from('game_state')
          .update({ completed_games: newCompleted })
          .eq('user_id', session.user.id);
      }

      setGameFinished(true);
      setShowCelebration(true);
    } catch (error) {
      console.error('Error marking module complete:', error);
      setGameFinished(true);
    }
  };

  if (availableQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00965E] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
        {showCelebration && (
          <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
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
                  <Star className="text-blue-400" size={20 + Math.random() * 20} fill="currentColor" />
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
          <div className="inline-block p-4 rounded-full bg-green-100 text-[#00965E] mb-4 animate-bounce">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            ¡Módulo Completado!
          </h2>
          <p className="text-gray-600 mb-4">Excelente trabajo dominando los conceptos de BIOFIT</p>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
            <p className="text-gray-700 text-lg mb-2 font-semibold">Puntos Ganados</p>
            <p className="text-6xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {score}
            </p>
          </div>

          <Button onClick={() => onComplete(score)} fullWidth className="shadow-lg">
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

  const currentQuestion = availableQuestions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase text-blue-600 bg-blue-100 px-2 py-1 rounded">
          Pregunta {currentQuestionIndex + 1} de {availableQuestions.length}
        </span>
        <span className="text-sm font-bold text-gray-600">Puntos: {score}</span>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-inner border-2 border-blue-100">
        <p className="text-lg font-medium text-gray-800 text-center leading-relaxed">
          {currentQuestion.statement}
        </p>
      </div>

      {!showResult ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            ✓ VERDADERO
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            ✗ FALSO
          </button>
        </div>
      ) : (
        <div className={`p-6 rounded-2xl border-2 animate-in slide-in-from-bottom-4 duration-300 ${
          isCorrect 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {isCorrect ? (
              <CheckCircle className="text-green-600 flex-shrink-0" size={32} />
            ) : (
              <XCircle className="text-red-600 flex-shrink-0" size={32} />
            )}
            <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </h3>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            {currentQuestion.explanation}
          </p>

          <Button
            onClick={handleNextQuestion}
            fullWidth
            className={isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isCorrect 
              ? (currentQuestionIndex < availableQuestions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Módulo')
              : 'Volver a Intentar'
            }
          </Button>
        </div>
      )}
    </div>
  );
};
