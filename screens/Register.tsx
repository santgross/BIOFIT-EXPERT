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
    email: '',
    phone: '',
    pharmacyName: '',
    representativeName: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    const phoneRegex = /^0\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos y empezar con 0';
    }

    if (!formData.pharmacyName.trim()) {
      newErrors.pharmacyName = 'El nombre de la farmacia es requerido';
    }

    if (!formData.representativeName.trim()) {
      newErrors.representativeName = 'El nombre del visitador es requerido';
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
      // 1. Registrar usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        if (authError.message.includes('already')) {
          throw new Error('Este email ya está registrado');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      const userId = authData.user.id;

      // 2. Crear perfil
      const profileData = {
        user_id: userId,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        pharmacy_name: formData.pharmacyName,
        representative_name: formData.representativeName
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Error al crear perfil');
      }

      // 3. Crear game_state
      const gameStateData = {
        user_id: userId,
        points: 0,
        level: 1,
        badges: [],
        completed_games: []
      };

      const { error: gameError } = await supabase
        .from('game_state')
        .insert([gameStateData]);

      if (gameError) {
        console.error('Game state error:', gameError);
      }

      // 4. Esperar 1 segundo
      await new Promise(r => setTimeout(r, 1000));

      // 5. Iniciar sesión
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      // 6. Registrar exitoso
      onRegister({
        id: userId,
        name: formData.fullName,
        email: formData.email
      });

    } catch (error: any) {
      console.error('Registration error:', error);
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
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Juan Pérez"
              disabled={loading}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
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
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0987654321"
              maxLength={10}
              disabled={loading}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Farmacia *
            </label>
            <input
              type="text"
              value={formData.pharmacyName}
              onChange={(e) => handleChange('pharmacyName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.pharmacyName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Farmacia Cruz Azul"
              disabled={loading}
            />
            {errors.pharmacyName && (
              <p className="text-red-500 text-xs mt-1">{errors.pharmacyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Visitador/Representante *
            </label>
            <input
              type="text"
              value={formData.representativeName}
              onChange={(e) => handleChange('representativeName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.representativeName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="María García"
              disabled={loading}
            />
            {errors.representativeName && (
              <p className="text-red-500 text-xs mt-1">{errors.representativeName}</p>
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
