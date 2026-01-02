
import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { DATA_BY_LEVEL } from '../constants';

interface Props {
  level: 1 | 2 | 3;
  onComplete: (score: number) => void;
}

export const TriviaGame: React.FC<Props> = ({ level, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<number | null>(null);

  const questions = DATA_BY_LEVEL.TRIVIA[level];
  const currentQ = questions[index];

  useEffect(() => {
    return () => stopTimer();
  }, []);

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
        setScore(s => s + 50); // High reward for speed
    }
    
    if (index < questions.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      finishGame();
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-600 mb-4">
          <Timer size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">¡Tiempo Agotado!</h2>
        <div className="text-left max-w-xs mx-auto bg-gray-50 p-4 rounded-lg">
            <p className="flex justify-between mb-2"><span>Nivel:</span> <span className="font-bold">{level}</span></p>
            <p className="flex justify-between mb-2"><span>Preguntas:</span> <span className="font-bold">{index + 1}/{questions.length}</span></p>
            <p className="flex justify-between text-lg"><span>Puntaje:</span> <span className="font-bold text-[#00965E]">{score}</span></p>
        </div>
        <Button onClick={() => onComplete(score)} fullWidth>
          Recoger Puntos
        </Button>
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
            <div className="text-xs font-bold uppercase text-purple-600 bg-purple-100 inline-block px-2 py-1 rounded mb-2">Nivel {level}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Trivia Flash</h2>
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
      {/* Timer Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center font-bold text-gray-500 text-sm">
            <span>Nivel {level} - Pregunta {index + 1}</span>
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
