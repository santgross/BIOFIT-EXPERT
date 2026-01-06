import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './screens/Home';
import { TrueFalseGame } from './screens/TrueFalseGame';
import { MatchGame } from './screens/MatchGame';
import { ScenarioGame } from './screens/ScenarioGame';
import { TriviaGame } from './screens/TriviaGame';
import { BadgesScreen } from './screens/Badges';
import { Register } from './screens/Register';
import { Login } from './screens/Login';
import { PrivacyConsent } from './components/PrivacyConsent';
import { AdminDashboard } from './screens/AdminDashboard';
import { Certificate } from './screens/Certificate';
import { GameState, Screen, User } from './types';
import { BADGES, LEVEL_THRESHOLDS } from './constants';
import { supabase } from './supabaseClient';

const TOTAL_MAX_POINTS = 1170;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    points: 0,
    level: 1,
    badges: [],
    completedGames: []
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [showLogin, setShowLogin] = useState(true);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [loading, setLoading] = useState(true);

  const getCurrentLevel = (points: number): 1 | 2 | 3 => {
    if (points >= LEVEL_THRESHOLDS.EXPERTO) return 3;
    if (points >= LEVEL_THRESHOLDS.AVANZADO) return 2;
    return 1;
  };

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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

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

      const currentPoints = gameData.points || 0;
      const currentLevel = getCurrentLevel(currentPoints);

      setGameState({
        points: currentPoints,
        level: currentLevel,
        badges: gameData.badges || [],
        completedGames: gameData.completed_games || []
      });

      setIsAdmin(profile.is_admin || false);

      if (!profile.privacy_accepted) {
        setShowPrivacyConsent(true);
      }

      // Verificar si completó todo para mostrar certificado
      checkForCertificate(gameData.completed_games || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkForCertificate = (completed: string[]) => {
    const allModulesCompleted = [
      'true-false-complete',
      'match-level-1', 'match-level-2', 'match-level-3',
      'scenario-level-1', 'scenario-level-2', 'scenario-level-3',
      'trivia-level-1', 'trivia-level-2', 'trivia-level-3'
    ].every(id => completed.includes(id));

    if (allModulesCompleted) {
      setCurrentScreen(Screen.CERTIFICATE);
    }
  };

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

  const handleLogin = async (userId: string) => {
    await loadUserData(userId);
  };

  const handlePrivacyAccept = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ privacy_accepted: true })
        .eq('user_id', user.id);

      if (error) throw error;
      setShowPrivacyConsent(false);
    } catch (error) {
      console.error('Error accepting privacy policy:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
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
    if (!user) {
      setCurrentScreen(Screen.HOME);
      return;
    }

    // Recargar datos desde Supabase para obtener puntos actualizados
    await loadUserData(user.id);
    
    // Navegar al home
    setCurrentScreen(Screen.HOME);
  };

  const userLevel = getCurrentLevel(gameState.points);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return (
          <Home 
            onNavigate={setCurrentScreen} 
            unlockedBadges={gameState.badges} 
            completedGames={gameState.completedGames}
            user={user} 
            isAdmin={isAdmin} 
          />
        );
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
      case Screen.ADMIN:
        return <AdminDashboard onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.CERTIFICATE:
        return <Certificate userName={user?.name || 'Usuario'} onBack={() => setCurrentScreen(Screen.HOME)} />;
      default:
        return (
          <Home 
            onNavigate={setCurrentScreen} 
            unlockedBadges={gameState.badges} 
            completedGames={gameState.completedGames}
            user={user} 
            isAdmin={isAdmin} 
          />
        );
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
    return showLogin ? (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setShowLogin(false)} 
      />
    ) : (
      <Register 
        onRegister={handleRegister} 
        onSwitchToLogin={() => setShowLogin(true)} 
      />
    );
  }

  if (user && showPrivacyConsent) {
    return <PrivacyConsent onAccept={handlePrivacyAccept} />;
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
