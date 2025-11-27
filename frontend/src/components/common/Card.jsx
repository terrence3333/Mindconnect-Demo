import React from 'react';

const Card = ({ title, icon, description, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:-translate-y-1 transition-transform ${className}`}>
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <span className="text-3xl mr-3">{icon}</span>}
          {title && <h3 className="text-xl font-bold text-gray-800">{title}</h3>}
        </div>
      )}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
};

export default Card;
