import React, { useState } from 'react';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import { LOGO_URL } from '../constants';

interface Props {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<Props> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    apellido: '',
    email: '',
    celular: '',
    farmacia: '',
    nombreVisita: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    const phoneRegex = /^0\d{9}$/;
    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    } else if (!phoneRegex.test(formData.celular)) {
      newErrors.celular = 'El celular debe tener 10 dígitos y empezar con 0';
    }

    if (!formData.farmacia.trim()) {
      newErrors.farmacia = 'El nombre de la farmacia es requerido';
    }

    if (!formData.nombreVisita.trim()) {
      newErrors.nombreVisita = 'El nombre del visitador es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // 1. Crear usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      const userId = authData.user.id;

      // 2. Crear perfil con los nombres CORRECTOS de las columnas
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          user_id: userId,
          full_name: formData.fullName,
          apellido: formData.apellido,
          email: formData.email,
          celular: formData.celular,
          farmacia: formData.farmacia,
          nombre_visita: formData.nombreVisita,
          privacy_accepted: false,
          is_admin: false
        }]);

      if (profileError) throw profileError;

      // 3. Crear game_state
      const { error: gameError } = await supabase
        .from('game_state')
        .insert([{
          user_id: userId,
          points: 0,
          level: 1,
          badges: [],
          completed_games: []
        }]);

      if (gameError) {
        console.error('Game state error:', gameError);
      }

      // 4. Iniciar sesión
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      // 5. Éxito
      onRegister({
        id: userId,
        name: `${formData.fullName} ${formData.apellido}`,
        email: formData.email
      });

    } catch (error: any) {
      console.error('Error:', error);
      setErrors({ 
        general: error.message || 'Error al registrar usuario'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img src={LOGO_URL} alt="BIOFIT Logo" className="h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold biofit-green mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Regístrate para comenzar tu entrenamiento</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Juan"
              disabled={loading}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => handleChange('apellido', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.apellido ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Pérez"
              disabled={loading}
            />
            {errors.apellido && (
              <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ejemplo@farmacia.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Celular *
            </label>
            <input
              type="tel"
              value={formData.celular}
              onChange={(e) => handleChange('celular', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.celular ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0987654321"
              maxLength={10}
              disabled={loading}
            />
            {errors.celular && (
              <p className="text-red-500 text-xs mt-1">{errors.celular}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Farmacia *
            </label>
            <input
              type="text"
              value={formData.farmacia}
              onChange={(e) => handleChange('farmacia', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.farmacia ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Farmacia Cruz Azul"
              disabled={loading}
            />
            {errors.farmacia && (
              <p className="text-red-500 text-xs mt-1">{errors.farmacia}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Visitador/Representante *
            </label>
            <input
              type="text"
              value={formData.nombreVisita}
              onChange={(e) => handleChange('nombreVisita', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.nombreVisita ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="María García"
              disabled={loading}
            />
            {errors.nombreVisita && (
              <p className="text-red-500 text-xs mt-1">{errors.nombreVisita}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Repite tu contraseña"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="mt-6"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#00965E] font-semibold hover:underline"
              disabled={loading}
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
