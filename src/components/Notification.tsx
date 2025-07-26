import React, { useEffect, useState } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-green-900',
      border: 'border-green-700',
      icon: '✓',
      iconColor: 'text-green-400'
    },
    error: {
      bg: 'bg-red-900',
      border: 'border-red-700',
      icon: '✗',
      iconColor: 'text-red-400'
    },
    info: {
      bg: 'bg-blue-900',
      border: 'border-blue-700',
      icon: 'ℹ',
      iconColor: 'text-blue-400'
    }
  };

  const config = typeConfig[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full ${config.bg} ${config.border} border rounded-lg p-4 shadow-lg backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`text-lg ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-100 text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}; 