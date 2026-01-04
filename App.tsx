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
import { supabase } from './supabaseClient';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    points: 0,
    level: 1,
    badges: [],
    completedGames: []
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [loading, setLoading] = useState(true);

  const getCurrentLevel = (points: number): 1 | 2 | 3 => {
    if (points >= LEVEL_THRESHOLDS.EXPERTO) return 3;
    if (points >= LEVEL_THRESHOLDS.AVANZADO) return 2;
    return 1;
  };

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Cargar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Cargar estado del juego
      const { data: gameData, error: gameError } = await supabase
        .from('game_state')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (gameError) throw gameError;

      setUser({
        id: userId,
        name: profile.full_name,
        email: profile.email
      });

      setGameState({
        points: gameData.points || 0,
        level: gameData.level || 1,
        badges: gameData.badges || [],
        completedGames: gameData.completed_games || []
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Actualizar nivel cuando cambien los puntos
  useEffect(() => {
    if (!user) return;

    const calculatedLevel = getCurrentLevel(gameState.points);
    if (calculatedLevel !== gameState.level) {
      setGameState(prev => ({ ...prev, level: calculatedLevel }));
      updateGameStateInDB({ ...gameState, level: calculatedLevel });
    }
  }, [gameState.points, user]);

  // Actualizar badges cuando cambien los puntos
  useEffect(() => {
    if (!user) return;

    const newBadges: string[] = [];
    BADGES.forEach(badge => {
      if (!gameState.badges.includes(badge.id) && gameState.points >= badge.requiredPoints) {
        newBadges.push(badge.id);
      }
    });

    if (newBadges.length > 0) {
      const updatedBadges = [...gameState.badges, ...newBadges];
      setGameState(prev => ({ ...prev, badges: updatedBadges }));
      updateGameStateInDB({ ...gameState, badges: updatedBadges });
    }
  }, [gameState.points, user]);

  const updateGameStateInDB = async (state: GameState) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('game_state')
        .update({
          points: state.points,
          level: state.level,
          badges: state.badges,
          completed_games: state.completedGames,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating game state:', error);
    }
  };

  const handleRegister = async (newUser: User) => {
    setUser(newUser);
    await loadUserData(newUser.id);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setGameState({
        points: 0,
        level: 1,
        badges: [],
        completedGames: []
      });
      setCurrentScreen(Screen.HOME);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGameComplete = async (pointsEarned: number) => {
    const newPoints = gameState.points + pointsEarned;
    const updatedState = { ...gameState, points: newPoints };
    
    setGameState(updatedState);
    await updateGameStateInDB(updatedState);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-2xl font-bold biofit-green">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Register onRegister={handleRegister} />;
  }

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
