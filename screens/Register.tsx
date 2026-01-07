import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, Building, Users } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pharmacy: '',
    representative: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pharmacy: '',
    representative: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      pharmacy: '',
      representative: '',
      password: ''
    };

    let isValid = true;

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
      isValid = false;
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
      isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    // Validar celular (10 dígitos, empieza con 0)
    const phoneRegex = /^0\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'El celular es requerido';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Celular inválido (10 dígitos, empieza con 0)';
      isValid = false;
    }

    // Validar farmacia
    if (!formData.pharmacy.trim()) {
      newErrors.pharmacy = 'El nombre de la farmacia es requerido';
      isValid = false;
    }

    // Validar representante
    if (!formData.representative.trim()) {
      newErrors.representative = 'El nombre del representante es requerido';
      isValid = false;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // 2. Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          pharmacy_name: formData.pharmacy,
          representative_name: formData.representative,
          privacy_accepted: true,
          privacy_accepted_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // 3. Inicializar game_state
      const { error: gameError } = await supabase
        .from('game_state')
        .insert({
          user_id: authData.user.id,
          points: 0,
          level: 1,
          badges: []
        });

      if (gameError) throw gameError;

      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      onSwitchToLogin();

    } catch (error: any) {
      console.error('Error en registro:', error);
      if (error.message.includes('already registered')) {
        alert('Este email ya está registrado. Intenta con otro email.');
      } else {
        alert('Error al registrarse: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario escribe
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/LOGO-BIOFIT-SIN-FONDO.png"
            alt="BIOFIT Logo"
            className="h-20 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
          <p className="text-gray-600 mt-2">Únete a BIOFIT TRIVIA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Tu nombre"
              />
            </div>
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Tu apellido"
              />
            </div>
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Celular */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Celular
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className={`w-full pl-10 pr-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="0987654321"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Farmacia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farmacia
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="pharmacy"
                value={formData.pharmacy}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${errors.pharmacy ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Nombre de la farmacia"
              />
            </div>
            {errors.pharmacy && <p className="text-red-500 text-sm mt-1">{errors.pharmacy}</p>}
          </div>

          {/* Representante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Representante
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="representative"
                value={formData.representative}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${errors.representative ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Nombre del visitador"
              />
            </div>
            {errors.representative && <p className="text-red-500 text-sm mt-1">{errors.representative}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Registrando...'
            ) : (
              <>
                <UserPlus size={20} />
                Crear Cuenta
              </>
            )}
          </button>
        </form>

        {/* Link a Login */}
        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-green-600 hover:underline font-semibold"
          >
            Inicia Sesión
          </button>
        </p>
      </div>
    </div>
  );
}
