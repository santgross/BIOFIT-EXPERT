export enum Screen {
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  TRUE_FALSE = 'TRUE_FALSE',
  MATCH = 'MATCH',
  SCENARIO = 'SCENARIO',
  TRIVIA = 'TRIVIA',
  BADGES = 'BADGES',
  ADMIN = 'admin',
  CERTIFICATE = 'CERTIFICATE'
}

export interface User {
   id: string;
  name: string;
  email: string;
}

export interface GameState {
  points: number;
  level: number; // 1 = Principiante, 2 = Avanzado, 3 = Experto
  badges: string[];
  completedGames: string[];
}

export interface QuestionTF {
  id: number;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface MatchItem {
  id: string;
  text: string;
  type: 'benefit' | 'system';
  matchId: string;
}

export interface Scenario {
  id: number;
  customer: string;
  clerkResponse: string;
  isCorrect: boolean;
  correctAction: string; // If clerk is wrong, what should they have said?
  feedback: string;
}

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
}
