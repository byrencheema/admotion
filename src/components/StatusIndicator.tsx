import React from 'react';

interface StatusIndicatorProps {
  status: 'idle' | 'generating' | 'success' | 'error';
  message?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  message 
}) => {
  const statusConfig = {
    idle: {
      color: 'bg-gray-500',
      icon: '●',
      text: 'Ready to generate'
    },
    generating: {
      color: 'bg-blue-500',
      icon: '⟳',
      text: 'Generating video...'
    },
    success: {
      color: 'bg-green-500',
      icon: '✓',
      text: 'Video generated!'
    },
    error: {
      color: 'bg-red-500',
      icon: '✗',
      text: 'Generation failed'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
      <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`} />
      <span className="text-sm text-gray-300">
        {message || config.text}
      </span>
    </div>
  );
}; 