import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading...', size = 'md' }) => {
  const sizeMap = {
    sm: { circle: 'w-6 h-6', icon: 'w-3 h-3', text: 'text-xs' },
    md: { circle: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-sm' },
    lg: { circle: 'w-16 h-16', icon: 'w-7 h-7', text: 'text-base' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className={`${current.circle} rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin`} />
        <Sparkles className={`${current.icon} text-indigo-400 absolute animate-pulse`} />
      </div>
      {label && <p className={`mt-3 text-slate-400 font-medium ${current.text}`}>{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
