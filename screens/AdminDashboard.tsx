import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, ArrowLeft, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

interface UserData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pharmacy_name: string;
  representative_name: string;
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

      // Obtener todos los perfiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Obtener todos los game_state de una sola vez
      const { data: gameStates, error: gameStateError } = await supabase
        .from('game_state')
        .select('*');

      if (gameStateError) throw gameStateError;

      // Crear un mapa de game_state por user_id
      const gameStateMap = new Map();
      (gameStates || []).forEach((gs: any) => {
        gameStateMap.set(gs.user_id, gs);
      });

      // Combinar los datos
      const usersWithProgress = profiles.map((profile) => {
        const gameState = gameStateMap.get(profile.user_id);

        return {
          id: profile.user_id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone || 'N/A',
          pharmacy_name: profile.pharmacy_name || 'N/A',
          representative_name: profile.representative_name || 'N/A',
          created_at: profile.created_at,
          points: gameState?.points || 0,
          level: gameState?.level || 1,
          badges: gameState?.badges || []
        };
      });

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

  const exportToExcel = () => {
    // Crear datos para Excel
    const excelData = users.map(u => ({
      'Nombre': u.full_name,
      'Email': u.email,
      'Teléfono': u.phone,
      'Farmacia': u.pharmacy_name,
      'Visitador': u.representative_name,
      'Puntos': u.points,
      'Nivel': u.level === 1 ? 'Principiante' : u.level === 2 ? 'Avanzado' : 'Experto',
      'Badges': u.badges.length,
      'Fecha Registro': new Date(u.created_at).toLocaleDateString('es-EC')
    }));

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 25 }, // Nombre
      { wch: 30 }, // Email
      { wch: 15 }, // Teléfono
      { wch: 30 }, // Farmacia
      { wch: 25 }, // Visitador
      { wch: 10 }, // Puntos
      { wch: 15 }, // Nivel
      { wch: 10 }, // Badges
      { wch: 15 }  // Fecha Registro
    ];
    ws['!cols'] = colWidths;

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios BIOTrivia');

    // Generar nombre de archivo con fecha
    const fecha = new Date().toISOString().split('T')[0];
    const fileName = `BIOTrivia-Usuarios-${fecha}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, fileName);
  };

  const getLevelBadge = (level: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800 border border-green-200',
      2: 'bg-blue-100 text-blue-800 border border-blue-200',
      3: 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    const labels = {
      1: 'Principiante',
      2: 'Avanzado',
      3: 'Experto'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[level as keyof typeof colors]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-white rounded-lg transition shadow-sm"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dashboard de Administración</h1>
              <p className="text-gray-600 mt-1">Panel de control y estadísticas de BIOTrivia</p>
            </div>
          </div>
          <Button onClick={exportToExcel} className="flex items-center justify-center shadow-lg whitespace-nowrap">
            <Download size={20} className="mr-2" />
            Exportar Excel
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Users className="text-blue-500 mb-3" size={40} />
              <p className="text-gray-500 text-sm font-medium mb-2">Total Usuarios</p>
              <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="text-green-500 mb-3" size={40} />
              <p className="text-gray-500 text-sm font-medium mb-2">Principiantes</p>
              <p className="text-4xl font-bold text-green-600">{stats.principiantes}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="text-blue-500 mb-3" size={40} />
              <p className="text-gray-500 text-sm font-medium mb-2">Avanzados</p>
              <p className="text-4xl font-bold text-blue-600">{stats.avanzados}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Award className="text-purple-500 mb-3" size={40} />
              <p className="text-gray-500 text-sm font-medium mb-2">Expertos</p>
              <p className="text-4xl font-bold text-purple-600">{stats.expertos}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Award className="text-orange-500 mb-3" size={40} />
              <p className="text-gray-500 text-sm font-medium mb-2">Promedio Puntos</p>
              <p className="text-4xl font-bold text-orange-600">{stats.promedioPoints}</p>
            </div>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-800">Usuarios Registrados</h2>
            <p className="text-gray-600 mt-1">Lista completa de dependientes de farmacia</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Farmacia</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Visitador</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Puntos</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Nivel</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Badges</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Registro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No hay usuarios registrados todavía
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{user.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{user.pharmacy_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{user.representative_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-lg font-bold text-gray-900">{user.points}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getLevelBadge(user.level)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-bold text-sm">
                          {user.badges.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString('es-EC', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
