
import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { User } from '../types';
import { LOGO_URL } from '../constants';

interface Props {
  onRegister: (user: User) => void;
}

export const Register: React.FC<Props> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }
    // Simple mock validation/registration logic
    onRegister({
      name: formData.name,
      email: formData.email
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <div className="text-center mb-8 flex flex-col items-center">
         {/* Logo Image */}
         <img 
            src={LOGO_URL} 
            alt="BIOFIT" 
            className="h-16 object-contain mb-4" 
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
         />
         {/* Fallback */}
         <div className="hidden text-4xl font-black text-[#00965E] italic tracking-tighter mb-2">BIOFIT<sup className="text-lg not-italic">®</sup></div>
         
         <p className="text-gray-500 font-medium text-lg">BIOTrivia</p>
      </div>

      <div className="w-full space-y-6">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
          <h2 className="font-bold text-gray-800 text-lg mb-1">Registro de Usuario</h2>
          <p className="text-sm text-gray-600">Ingresa tus datos para iniciar tu entrenamiento.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Nombre Completo</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                        name="name"
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#00965E] focus:ring-2 focus:ring-green-100 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#00965E] focus:ring-2 focus:ring-green-100 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Clave de Acceso</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                        name="password"
                        type="password"
                        placeholder="******"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#00965E] focus:ring-2 focus:ring-green-100 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" fullWidth className="shadow-lg shadow-green-200">
                    Comenzar Entrenamiento
                </Button>
            </div>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 text-center">
        © 2025 PharmaBrand. Uso exclusivo interno.
      </p>
    </div>
  );
};
