import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Phone, Building, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { User } from '../types';
import { LOGO_URL } from '../constants';
import { supabase } from '../supabaseClient';

interface Props {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<Props> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    farmacia: '',
    nombre_visitador: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateCelular = (celular: string): boolean => {
    const celularRegex = /^0[0-9]{9}$/;
    return celularRegex.test(celular);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.celular || 
        !formData.farmacia || !formData.nombre_visitador || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!validateCelular(formData.celular)) {
      setError('El celular debe tener 10 dígitos y empezar con 0 (ej: 0985689501)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // Crear perfil del usuario con todos los datos
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            full_name: `${formData.nombre} ${formData.apellido}`,
            email: formData.email,
            apellido: formData.apellido,
            celular: formData.celular,
            farmacia: formData.farmacia,
            nombre_visitador: formData.nombre_visitador,
          }
        ]);

      if (profileError) throw profileError;

      // Crear estado inicial del juego
      const { error: gameStateError } = await supabase
        .from('game_state')
        .insert([
          {
            user_id: authData.user.id,
            points: 0,
            level: 1,
            badges: [],
            completed_games: []
          }
        ]);

      if (gameStateError) throw gameStateError;

      // Crear objeto de usuario para la app
      const newUser: User = {
        id: authData.user.id,
        name: `${formData.nombre} ${formData.apellido}`,
        email: formData.email
      };

      onRegister(newUser);
    } catch (err: any) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="BIOFIT Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold biofit-green mb-2">BIOTrivia</h1>
          <p className="text-gray-600">Registro de Dependientes de Farmacia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej. Juan"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej. Pérez"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Celular
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0985689501"
                maxLength={10}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farmacia
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="farmacia"
                value={formData.farmacia}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej. Farmacia Cruz Azul"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Visitador
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="nombre_visitador"
                value={formData.nombre_visitador}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej. María González"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            className="w-full py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Comenzar Entrenamiento'}
          </Button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="biofit-green font-semibold hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
