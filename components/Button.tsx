import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  
  const variants = {
    primary: "bg-[#00965E] text-white hover:bg-[#007a4d] border border-transparent",
    secondary: "bg-[#F59E0B] text-white hover:bg-[#d97706] border border-transparent", // Orange accent
    danger: "bg-[#E11D48] text-white hover:bg-[#be123c] border border-transparent", // Strawberry accent
    outline: "bg-white text-[#00965E] border-2 border-[#00965E] hover:bg-green-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};