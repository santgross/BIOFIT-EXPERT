
import React from 'react';
import { Play, CheckCircle2, AlertTriangle, Zap, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { Screen, User } from '../types';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
  unlockedBadges: string[];
  user: User | null;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, unlockedBadges, user }) => {
  const firstName = user?.name?.split(' ')[0] || 'Colega';
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Hola, {firstName}! 👋</h2>
        <p className="text-gray-600">Bienvenido a <strong>BIOTrivia</strong>. Completa los módulos para dominar los beneficios del Psyllium Muciloide.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <h3 className="font-bold text-lg text-[#00965E] flex items-center gap-2">
           Módulos de Entrenamiento
        </h3>

        <GameCard 
          title="Verdadero o Falso"
          subtitle="Mitos y Realidades BIOFIT"
          icon={<CheckCircle2 className="text-white" size={24} />}
          color="bg-blue-500"
          onClick={() => onNavigate(Screen.TRUE_FALSE)}
        />

        <GameCard 
          title="Match de Conceptos"
          subtitle="Precio, Beneficios y Acción"
          icon={<Zap className="text-white" size={24} />}
          color="bg-[#F59E0B]"
          onClick={() => onNavigate(Screen.MATCH)}
        />

        <GameCard 
          title="Casos de Mostrador"
          subtitle="Simulación de Venta"
          icon={<AlertTriangle className="text-white" size={24} />}
          color="bg-[#E11D48]"
          onClick={() => onNavigate(Screen.SCENARIO)}
        />

        <GameCard 
          title="Trivia Experto"
          subtitle="Demuestra lo que sabes"
          icon={<Play className="text-white" size={24} />}
          color="bg-purple-600"
          onClick={() => onNavigate(Screen.TRIVIA)}
        />
      </div>

      <div className="pt-4">
        <Button 
            variant="outline" 
            fullWidth 
            onClick={() => onNavigate(Screen.BADGES)}
            className="flex items-center justify-center gap-2"
        >
            <Award size={20} />
            Ver mis Certificaciones ({unlockedBadges.length})
        </Button>
      </div>
    </div>
  );
};

interface GameCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, subtitle, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-all active:scale-98 text-left w-full group"
  >
    <div className={`${color} p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="flex-grow">
      <h4 className="font-bold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <div className="text-gray-300 group-hover:text-[#00965E]">
        ▶
    </div>
  </button>
);