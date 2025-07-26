import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Generating your video...",
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {/* Animated Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin`} />
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full" />
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-green-400 rounded-full" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-gray-300 font-medium">{message}</p>
        <p className="text-gray-500 text-sm mt-1">This may take a few moments...</p>
      </div>

      {/* Progress dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </div>
    </div>
  );
}; 