import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, ArrowLeft, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';

interface UserData {
  id: string;
  full_name: string;
  email: string;
  celular: string;
  farmacia: string;
  nombre_visitador: string;
  created_at: string;
  points: number;
  level: number;
  badges: string[];
}

interface Props {
  onBack: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    principiantes: 0,
    avanzados: 0,
    expertos: 0,
    promedioPoints: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Obtener todos los usuarios con su progreso
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Obtener el progreso de cada usuario
      const usersWithProgress = await Promise.all(
        profiles.map(async (profile) => {
          const { data: gameState } = await supabase
            .from('game_state')
            .select('points, level, badges')
            .eq('user_id', profile.user_id)
            .single();

          return {
            id: profile.user_id,
            full_name: profile.full_name,
            email: profile.email,
            celular: profile.celular || 'N/A',
            farmacia: profile.farmacia || 'N/A',
            nombre_visitador: profile.nombre_visitador || 'N/A',
            created_at: profile.created_at,
            points: gameState?.points || 0,
            level: gameState?.level || 1,
            badges: gameState?.badges || []
          };
        })
      );

      setUsers(usersWithProgress);

      // Calcular estadísticas
      const total = usersWithProgress.length;
      const principiantes = usersWithProgress.filter(u => u.level === 1).length;
      const avanzados = usersWithProgress.filter(u => u.level === 2).length;
      const expertos = usersWithProgress.filter(u => u.level === 3).length;
      const promedioPoints = total > 0 
        ? Math.round(usersWithProgress.reduce((sum, u) => sum + u.points, 0) / total)
        : 0;

      setStats({ total, principiantes, avanzados, expertos, promedioPoints });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Email', 'Celular', 'Farmacia', 'Visitador', 'Puntos', 'Nivel', 'Badges', 'Fecha Registro'];
    const rows = users.map(u => [
      u.full_name,
      u.email,
      u.celular,
      u.farmacia,
      u.nombre_visitador,
      u.points,
      u.level === 1 ? 'Principiante' : u.level === 2 ? 'Avanzado' : 'Experto',
      u.badges.length,
      new Date(u.created_at).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biotrivia-usuarios-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getLevelBadge = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      1: 'Principiante',
      2: 'Avanzado',
      3: 'Experto'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[level as keyof typeof colors]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard de Administración</h1>
          </div>
          <Button onClick={exportToCSV} className="flex items-center">
            <Download size={20} className="mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Users className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Principiantes</p>
                <p className="text-3xl font-bold text-green-600">{stats.principiantes}</p>
              </div>
              <TrendingUp className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avanzados</p>
                <p className="text-3xl font-bold text-blue-600">{stats.avanzados}</p>
              </div>
              <TrendingUp className="text-blue-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Expertos</p>
                <p className="text-3xl font-bold text-purple-600">{stats.expertos}</p>
              </div>
              <Award className="text-purple-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Promedio Puntos</p>
                <p className="text-3xl font-bold text-orange-600">{stats.promedioPoints}</p>
              </div>
              <Award className="text-orange-500" size={40} />
            </div>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Usuarios Registrados</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Celular</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmacia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puntos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badges</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.celular}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.farmacia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.nombre_visitador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {user.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLevelBadge(user.level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.badges.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
