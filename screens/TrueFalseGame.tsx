import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Award, Trophy, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';

interface Question {
  id: string;
  statement: string;
  correctAnswer: boolean;
  explanation: string;
  level: 1 | 2 | 3;
}

interface Props {
  level: 1 | 2 | 3;
  onComplete: (points: number) => void;
}

const QUESTIONS: Question[] = [
  {
    id: 'tf1',
    statement: 'El Psyllium debe tomarse con poca agua para mejor absorción',
    correctAnswer: false,
    explanation: 'FALSO. El Psyllium debe tomarse con abundante agua (mínimo 250ml) para formar el gel mucilaginoso correctamente y evitar obstrucciones.',
    level: 1
  },
  {
    id: 'tf2',
    statement: 'BIOFIT puede ayudar a regular el tránsito intestinal tanto en estreñimiento como en diarrea',
    correctAnswer: true,
    explanation: 'VERDADERO. El Psyllium tiene efecto regulador bidireccional: absorbe agua en diarrea y la retiene en estreñimiento.',
    level: 1
  },
  {
    id: 'tf3',
    statement: 'Es seguro tomar BIOFIT durante el embarazo',
    correctAnswer: true,
    explanation: 'VERDADERO. El Psyllium es seguro durante el embarazo ya que no se absorbe sistémicamente y ayuda con el estreñimiento común en esta etapa.',
    level: 1
  },
  {
    id: 'tf4',
    statement: 'BIOFIT se debe tomar junto con otros medicamentos sin ningún intervalo',
    correctAnswer: false,
    explanation: 'FALSO. Se recomienda tomar BIOFIT 2 horas antes o después de otros medicamentos para evitar interferencias en la absorción.',
    level: 2
  },
  {
    id: 'tf5',
    statement: 'El Psyllium ayuda a controlar los niveles de colesterol',
    correctAnswer: true,
    explanation: 'VERDADERO. El Psyllium puede reducir el colesterol LDL hasta un 10% al unirse a los ácidos biliares y promover su excreción.',
    level: 2
  },
  {
    id: 'tf6',
    statement: 'BIOFIT causa dependencia intestinal con el uso prolongado',
    correctAnswer: false,
    explanation: 'FALSO. A diferencia de los laxantes estimulantes, el Psyllium es una fibra natural que no causa dependencia y puede usarse a largo plazo.',
    level: 3
  }
];

export const TrueFalseGame: React.FC<Props> = ({ level, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadCompletedQuestions();
  }, []);

  const loadCompletedQuestions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: gameState } = await supabase
        .from('game_state')
        .select('completed_games')
        .eq('user_id', session.user.id)
        .single();

      const completed = gameState?.completed_games || [];
      setCompletedIds(completed);

      // Filtrar preguntas: del nivel actual o inferior, no completadas
      const filtered = QUESTIONS.filter(q => 
        q.level <= level && !completed.includes(q.id)
      );

      setAvailableQuestions(filtered);

      if (filtered.length === 0) {
        setGameFinished(true);
        setShowCelebration(true);
      }
    } catch (error) {
      console.error('Error loading completed questions:', error);
    }
  };

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    const correct = answer === availableQuestions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 50);
    }
  };

  const handleNext = async () => {
    if (isCorrect) {
      // Marcar pregunta como completada
      const questionId = availableQuestions[currentQuestionIndex].id;
      const newCompleted = [...completedIds, questionId];
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase
            .from('game_state')
            .update({ completed_games: newCompleted })
            .eq('user_id', session.user.id);
        }
      } catch (error) {
        console.error('Error updating completed games:', error);
      }

      setCompletedIds(newCompleted);

      // Remover pregunta de disponibles
      const newAvailable = availableQuestions.filter((_, idx) => idx !== currentQuestionIndex);
      setAvailableQuestions(newAvailable);

      // Verificar si completó TODAS las preguntas del nivel
      const allQuestionsForLevel = QUESTIONS.filter(q => q.level <= level);
      const allCompleted = allQuestionsForLevel.every(q => newCompleted.includes(q.id));

      if (allCompleted) {
        // Marcar el módulo completo como finalizado
        await markModuleComplete(newCompleted);
        setGameFinished(true);
        setShowCelebration(true);
      } else if (newAvailable.length === 0) {
        // Ya no hay más preguntas disponibles en esta sesión
        setGameFinished(true);
        setShowCelebration(true);
      } else {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } else {
      // Si falló, reiniciar para intentar la misma pregunta de nuevo
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const markModuleComplete = async (currentCompleted: string[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Agregar el ID del módulo completo si no existe
      const moduleId = 'true-false-complete';
      if (!currentCompleted.includes(moduleId)) {
        const withModule = [...currentCompleted, moduleId];
        
        await supabase
          .from('game_state')
          .update({ completed_games: withModule })
          .eq('user_id', session.user.id);
      }
    } catch (error) {
      console.error('Error marking module complete:', error);
    }
  };

  const handleFinish = () => {
    onComplete(score);
  };

  if (gameFinished) {
    const allQuestionsForLevel = QUESTIONS.filter(q => q.level <= level);
    const allCompleted = allQuestionsForLevel.every(q => completedIds.includes(q.id));

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
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
          <div className="relative">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {allCompleted ? '¡Módulo Completado!' : '¡Buen Trabajo!'}
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            {allCompleted 
              ? 'Has completado todas las preguntas del módulo' 
              : 'Sigue practicando para completar el módulo'
            }
          </p>
          
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
            <Award className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-gray-700 text-lg mb-2 font-semibold">Puntos Ganados</p>
            <p className="text-6xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {score}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center text-green-600">
              <CheckCircle size={20} className="mr-2" />
              <span className="font-semibold">
                {completedIds.filter(id => QUESTIONS.some(q => q.id === id)).length} de {allQuestionsForLevel.length} preguntas completadas
              </span>
            </div>
            {allCompleted && (
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle size={20} className="mr-2" />
                <span className="font-semibold">Módulo Completado ✓</span>
              </div>
            )}
          </div>

          <Button onClick={handleFinish} className="w-full py-4 text-lg shadow-lg hover:shadow-xl transition-all">
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

  if (availableQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const allQuestionsForLevel = QUESTIONS.filter(q => q.level <= level);
  const progress = ((completedIds.filter(id => QUESTIONS.some(q => q.id === id)).length) / allQuestionsForLevel.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progreso</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completedIds.filter(id => QUESTIONS.some(q => q.id === id)).length} de {allQuestionsForLevel.length} completadas
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {currentQuestion.statement}
          </h2>

          {!showResult ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 px-8 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
              >
                ✓ Verdadero
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-6 px-8 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
              >
                ✗ Falso
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Result Badge */}
              <div className={`flex items-center justify-center p-4 rounded-xl ${
                isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="text-green-600 mr-2" size={28} />
                    <span className="text-2xl font-bold text-green-600">¡Correcto!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-600 mr-2" size={28} />
                    <span className="text-2xl font-bold text-red-600">Incorrecto</span>
                  </>
                )}
              </div>

              {/* Explanation */}
              <div className={`p-6 rounded-xl border-2 ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-gray-700 text-base leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Correct Answer Display for Wrong Answers */}
              {!isCorrect && (
                <div className="bg-white p-6 rounded-xl border-2 border-red-300 shadow-inner">
                  <p className="text-gray-600 text-sm mb-3 text-center">La respuesta correcta es:</p>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg">
                    <p className="text-3xl font-bold text-center tracking-wide">
                      {currentQuestion.correctAnswer ? 'VERDADERO ✓' : 'FALSO ✗'}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button 
                onClick={handleNext}
                className="w-full py-4 text-lg shadow-lg"
              >
                {isCorrect ? 'Siguiente Pregunta →' : '↻ Intentar de Nuevo'}
              </Button>

              {/* Score Display */}
              {isCorrect && (
                <div className="text-center bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Puntos acumulados</p>
                  <p className="text-3xl font-bold text-blue-600">{score}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
