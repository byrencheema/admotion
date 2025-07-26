import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  const IconMark = () => (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="relative">
        {/* Spark/Play triangle */}
        <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm transform rotate-45 shadow-lg" />
        {/* Motion trail */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-500 rounded-full opacity-40" />
      </div>
    </div>
  );

  if (variant === 'icon') {
    return <IconMark />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconMark />
      <span className="font-semibold text-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Admotion
      </span>
    </div>
  );
}; 