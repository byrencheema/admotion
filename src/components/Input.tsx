import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error,
  className = '',
  multiline = false,
  rows = 3
}) => {
  const baseClasses = 'w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  if (multiline) {
    return (
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={classes}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={classes}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};
