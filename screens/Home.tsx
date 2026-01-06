import React from 'react';
import { Screen, User } from '../types';
import { LOGO_URL } from '../constants';
import { CheckCircle, Lock } from 'lucide-react';

interface Props {
  onNavigate: (screen: Screen) => void;
  unlockedBadges: string[];
  completedGames: string[];
  user: User | null;
  isAdmin?: boolean;
}

export const Home: React.FC<Props> = ({ onNavigate, unlockedBadges, completedGames, user, isAdmin = false }) => {
  // IDs de preguntas/actividades por módulo
  const MODULE_QUESTIONS = {
    [Screen.TRUE_FALSE]: ['tf1', 'tf2', 'tf3', 'tf4', 'tf5', 'tf6'],
    [Screen.MATCH]: ['match-level-1', 'match-level-2', 'match-level-3'],
    [Screen.SCENARIO]: ['scenario-level-1', 'scenario-level-2', 'scenario-level-3'],
    [Screen.TRIVIA]: ['trivia-level-1', 'trivia-level-2', 'trivia-level-3']
  };

  // Función para verificar si un módulo está completado
  const isModuleCompleted = (gameId: Screen) => {
    const questionIds = MODULE_QUESTIONS[gameId as keyof typeof MODULE_QUESTIONS];
    if (!questionIds || questionIds.length === 0) return false;
    
    // Para TRUE_FALSE, verificar si existe el ID del módulo completo
    if (gameId === Screen.TRUE_FALSE) {
      return completedGames.includes('true-false-complete');
    }
    
    // Para otros módulos, verificar si TODAS las preguntas están completadas
    return questionIds.every(qId => completedGames.includes(qId));
  };

  // Función para contar preguntas completadas
  const getCompletedCount = (gameId: Screen) => {
    // Para TRUE_FALSE, verificar si está completado el módulo
    if (gameId === Screen.TRUE_FALSE) {
      if (completedGames.includes('true-false-complete')) {
        return 6; // Todas completadas
      }
      // Contar preguntas individuales
      const tfQuestions = ['tf1', 'tf2', 'tf3', 'tf4', 'tf5', 'tf6'];
      return tfQuestions.filter(qId => completedGames.includes(qId)).length;
    }
    
    const questionIds = MODULE_QUESTIONS[gameId as keyof typeof MODULE_QUESTIONS];
    if (!questionIds || questionIds.length === 0) return 0;
    
    // Contar cuántas preguntas del módulo están completadas
    return questionIds.filter(qId => completedGames.includes(qId)).length;
  };

  // Función para verificar si un módulo está disponible
  const isModuleAvailable = (gameId: Screen) => {
    // TRUE_FALSE siempre está disponible (primer módulo)
    if (gameId === Screen.TRUE_FALSE) return true;
    
    // MATCH requiere TRUE_FALSE completado
    if (gameId === Screen.MATCH) {
      return isModuleCompleted(Screen.TRUE_FALSE);
    }
    
    // SCENARIO requiere MATCH completado
    if (gameId === Screen.SCENARIO) {
      return isModuleCompleted(Screen.MATCH);
    }
    
    // TRIVIA requiere SCENARIO completado
    if (gameId === Screen.TRIVIA) {
      return isModuleCompleted(Screen.SCENARIO);
    }
    
    return false;
  };

  const games = [
    {
      id: Screen.TRUE_FALSE,
      title: 'Verdadero o Falso',
      description: 'Mitos y Realidades BIOFIT',
      icon: '✓',
      color: 'from-blue-500 to-blue-600',
      available: isModuleAvailable(Screen.TRUE_FALSE),
      totalQuestions: 6
    },
    {
      id: Screen.MATCH,
      title: 'Match de Conceptos',
      description: 'Precio, Beneficios y Acción',
      icon: '⚡',
      color: 'from-orange-500 to-orange-600',
      available: isModuleAvailable(Screen.MATCH),
      totalQuestions: 3
    },
    {
      id: Screen.SCENARIO,
      title: 'Casos de Mostrador',
      description: 'Simulación de Venta',
      icon: '⚠',
      color: 'from-red-500 to-red-600',
      available: isModuleAvailable(Screen.SCENARIO),
      totalQuestions: 3
    },
    {
      id: Screen.TRIVIA,
      title: 'Trivia BIOFIT',
      description: 'Conocimiento General',
      icon: '🎯',
      color: 'from-purple-500 to-purple-600',
      available: isModuleAvailable(Screen.TRIVIA),
      totalQuestions: 3
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="BIOFIT Logo" className="h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold biofit-green mb-2">
            ¡Hola, {user?.name?.split(' ')[0] || 'Usuario'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Bienvenido a <strong>BIOTrivia</strong>. Completa los módulos para dominar los beneficios del Psyllium Muciloide.
          </p>
        </div>

        {/* Módulos de Entrenamiento */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold biofit-green mb-4">Módulos de Entrenamiento</h2>
          <div className="grid gap-4">
            {games.map((game) => {
              const completed = isModuleCompleted(game.id);
              const completedCount = getCompletedCount(game.id);

              return (
                <button
                  key={game.id}
                  onClick={() => game.available && onNavigate(game.id)}
                  disabled={!game.available}
                  className={`
                    bg-white rounded-xl shadow-md p-6 text-left transition-all duration-200 relative
                    ${game.available 
                      ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                    ${completed ? 'ring-2 ring-green-500 bg-green-50' : ''}
                  `}
                >
                  {/* Completed Badge */}
                  {completed && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center text-sm font-bold">
                      <CheckCircle size={16} className="mr-1" />
                      Completado
                    </div>
                  )}

                  {/* Lock Badge for unavailable */}
                  {!game.available && (
                    <div className="absolute -top-2 -right-2 bg-gray-400 text-white px-3 py-1 rounded-full shadow-lg flex items-center text-sm font-bold">
                      <Lock size={16} className="mr-1" />
                      Bloqueado
                    </div>
                  )}

                  <div className="flex items-center">
                    <div className={`
                      w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} 
                      flex items-center justify-center text-3xl mr-4 flex-shrink-0
                    `}>
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {game.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{game.description}</p>
                      
                      {/* Progress indicator */}
                      {game.available && game.totalQuestions > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso</span>
                            <span className={`font-semibold ${completed ? 'text-green-600' : ''}`}>
                              {completed ? `✓ Completado` : `${completedCount}/${game.totalQuestions}`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${completed ? 'from-green-500 to-green-600' : game.color} transition-all duration-500`}
                              style={{ width: `${completed ? 100 : (completedCount / game.totalQuestions) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {!game.available && (
                        <p className="text-sm text-orange-600 mt-2">
                          🔒 Completa el módulo anterior para desbloquear
                        </p>
                      )}
                    </div>
                    {game.available && (
                      <div className={`text-gray-400 ml-4 ${completed ? 'text-green-500' : ''}`}>
                        {completed ? (
                          <CheckCircle size={24} />
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón de Certificado (si completó todo) */}
        {(() => {
          const allCompleted = [
            'true-false-complete',
            'match-level-1', 'match-level-2', 'match-level-3',
            'scenario-level-1', 'scenario-level-2', 'scenario-level-3',
            'trivia-level-1', 'trivia-level-2', 'trivia-level-3'
          ].every(id => completedGames.includes(id));

          if (!allCompleted) return null;

          return (
            <div className="mt-8 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl shadow-2xl p-8 text-center border-4 border-yellow-300 animate-pulse">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
                  ¡FELICITACIONES!
                </h2>
                <p className="text-white text-lg mb-6 drop-shadow">
                  Has completado todos los módulos de entrenamiento
                </p>
                <button
                  onClick={() => onNavigate(Screen.CERTIFICATE)}
                  className="bg-white text-yellow-600 font-black text-xl py-4 px-8 rounded-xl shadow-xl hover:scale-110 transform transition-all duration-200 hover:shadow-2xl"
                >
                  🎓 Ver Mi Certificado
                </button>
              </div>
            </div>
          );
        })()}

        {/* Botón de Admin (solo visible para administradores) */}
        {isAdmin && (
          <div className="mt-8">
            <button
              onClick={() => onNavigate(Screen.ADMIN)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard de Administración
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
