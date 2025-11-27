import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const typeStyles = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`${typeStyles[type]} border-l-4 p-4 rounded mb-4 flex justify-between items-center fade-in`}>
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icons[type]}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold hover:opacity-70">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
