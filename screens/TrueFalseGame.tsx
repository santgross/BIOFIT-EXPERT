
import React, { useState, useMemo } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { DATA_BY_LEVEL } from '../constants';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const TrueFalseGame: React.FC<Props> = ({ level, onComplete }) => {
  const questions = useMemo(() => {
    const all = DATA_BY_LEVEL.TF[level];
    return [...all].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [level]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (userSaysTrue: boolean) => {
    const correct = userSaysTrue === currentQuestion.isTrue;
    if (correct) {
      setScore(s => s + 25);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="inline-block p-4 rounded-full bg-green-100 text-[#00965E] mb-4">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-bold text-[#00965E]">¡Visita Completada!</h2>
        <p className="text-xl text-gray-600">Has ganado <span className="font-bold text-gray-900">{score}</span> puntos para tu certificación.</p>
        <Button onClick={() => onComplete(score)} fullWidth>Volver al Menú</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
        <span>Módulo BIOFIT Nivel {level}</span>
        <span>Pregunta {currentIndex + 1}/4</span>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center text-center space-y-8">
        <div className={`p-8 bg-white rounded-2xl shadow-lg border-2 ${showFeedback ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-transparent'} transition-all w-full`}>
            <h3 className="text-xl font-bold text-gray-800 leading-relaxed">
              {currentQuestion.statement}
            </h3>
        </div>

        {!showFeedback ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            <button onClick={() => handleAnswer(true)} className="p-6 rounded-xl bg-green-100 text-[#00965E] font-bold flex flex-col items-center gap-2">
              <Check size={32} /> VERDADERO
            </button>
            <button onClick={() => handleAnswer(false)} className="p-6 rounded-xl bg-red-100 text-[#E11D48] font-bold flex flex-col items-center gap-2">
              <X size={32} /> FALSO
            </button>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-bold mb-1">{isCorrect ? '¡Excelente!' : '¡Atención!'}</p>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
            <Button onClick={handleNext} fullWidth className="flex items-center justify-center gap-2">
              Siguiente Desafío <ArrowRight size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
