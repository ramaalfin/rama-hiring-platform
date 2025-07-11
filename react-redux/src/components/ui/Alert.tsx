import React from 'react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', children, className = '' }) => {
  const baseClasses = 'p-4 rounded-md border';

  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const classes = `${baseClasses} ${variants[type]} ${className}`;

  return (
    <div className={classes}>
      <div className="flex items-center">
        <span className="mr-2 font-semibold">{icons[type]}</span>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Alert;