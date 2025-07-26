import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-800/50 disabled:cursor-not-allowed border border-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-600/50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 focus:ring-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && (
        <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
