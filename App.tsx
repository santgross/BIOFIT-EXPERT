
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './screens/Home';
import { TrueFalseGame } from './screens/TrueFalseGame';
import { MatchGame } from './screens/MatchGame';
import { ScenarioGame } from './screens/ScenarioGame';
import { TriviaGame } from './screens/TriviaGame';
import { BadgesScreen } from './screens/Badges';
import { Register } from './screens/Register';
import { GameState, Screen, User } from './types';
import { BADGES, LEVEL_THRESHOLDS } from './constants';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('biofit_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('biofit_gamestate');
    return saved ? JSON.parse(saved) : {
      points: 0,
      level: 1,
      badges: [],
      completedGames: []
    };
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);

  const getCurrentLevel = (points: number): 1 | 2 | 3 => {
    if (points >= LEVEL_THRESHOLDS.EXPERTO) return 3;
    if (points >= LEVEL_THRESHOLDS.AVANZADO) return 2;
    return 1;
  };

  useEffect(() => {
    const calculatedLevel = getCurrentLevel(gameState.points);
    if (calculatedLevel !== gameState.level) {
        setGameState(prev => ({ ...prev, level: calculatedLevel }));
    }
    localStorage.setItem('biofit_gamestate', JSON.stringify(gameState));
  }, [gameState.points]);

  useEffect(() => {
    const newBadges: string[] = [];
    BADGES.forEach(badge => {
        if (!gameState.badges.includes(badge.id) && gameState.points >= badge.requiredPoints) {
            newBadges.push(badge.id);
        }
    });

    if (newBadges.length > 0) {
        setGameState(prev => ({
            ...prev,
            badges: [...prev.badges, ...newBadges]
        }));
    }
  }, [gameState.points]);

  const handleRegister = (newUser: User) => {
    localStorage.setItem('biofit_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('biofit_user');
    setUser(null);
    setCurrentScreen(Screen.HOME);
  };

  const handleGameComplete = (pointsEarned: number) => {
    setGameState(prev => ({
        ...prev,
        points: prev.points + pointsEarned
    }));
    setCurrentScreen(Screen.HOME);
  };

  const userLevel = getCurrentLevel(gameState.points);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <Home onNavigate={setCurrentScreen} unlockedBadges={gameState.badges} user={user} />;
      case Screen.TRUE_FALSE:
        return <TrueFalseGame level={userLevel} onComplete={handleGameComplete} />;
      case Screen.MATCH:
        return <MatchGame level={userLevel} onComplete={handleGameComplete} />;
      case Screen.SCENARIO:
        return <ScenarioGame level={userLevel} onComplete={handleGameComplete} />;
      case Screen.TRIVIA:
        return <TriviaGame level={userLevel} onComplete={handleGameComplete} />;
      case Screen.BADGES:
        return <BadgesScreen gameState={gameState} onBack={() => setCurrentScreen(Screen.HOME)} />;
      default:
        return <Home onNavigate={setCurrentScreen} unlockedBadges={gameState.badges} user={user} />;
    }
  };

  if (!user) return <Register onRegister={handleRegister} />;

  return (
    <Layout 
      gameState={gameState} 
      onGoHome={() => setCurrentScreen(Screen.HOME)}
      onLogout={handleLogout}
    >
      {renderScreen()}
    </Layout>
  );
}
