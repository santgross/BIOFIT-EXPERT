
import React from 'react';
import { Screen, User } from '../types';
import { LOGO_URL } from '../constants';

interface Props {
  onNavigate: (screen: Screen) => void;
  unlockedBadges: string[];
  user: User | null;
  isAdmin?: boolean;
}

export const Home: React.FC<Props> = ({ onNavigate, unlockedBadges, user, isAdmin = false }) => {
  const games = [
    {
      id: Screen.TRUE_FALSE,
      title: 'Verdadero o Falso',
      description: 'Mitos y Realidades BIOFIT',
      icon: '✓',
      color: 'from-blue-500 to-blue-600',
      available: true
    },
    {
      id: Screen.MATCH,
      title: 'Match de Conceptos',
      description: 'Precio, Beneficios y Acción',
      icon: '⚡',
      color: 'from-orange-500 to-orange-600',
      available: true
    },
    {
      id: Screen.SCENARIO,
      title: 'Casos de Mostrador',
      description: 'Simulación de Venta',
      icon: '⚠',
      color: 'from-red-500 to-red-600',
      available: true
    },
    {
      id: Screen.TRIVIA,
      title: 'Trivia BIOFIT',
      description: 'Conocimiento General',
      icon: '🎯',
      color: 'from-purple-500 to-purple-600',
      available: unlockedBadges.includes('trivia-master')
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
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => game.available && onNavigate(game.id)}
                disabled={!game.available}
                className={`
                  bg-white rounded-xl shadow-md p-6 text-left transition-all duration-200
                  ${game.available 
                    ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} 
                    flex items-center justify-center text-3xl mr-4
                  `}>
                    {game.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {game.title}
                    </h3>
                    <p className="text-gray-600">{game.description}</p>
                    {!game.available && (
                      <p className="text-sm text-orange-600 mt-1">
                        🔒 Desbloquea completando otros módulos
                      </p>
                    )}
                  </div>
                  {game.available && (
                    <div className="text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

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
