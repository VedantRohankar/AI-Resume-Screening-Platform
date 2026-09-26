import React from 'react';
import { Check, X, Tag } from 'lucide-react';

/**
 * SkillTag displays a matched, missing, or neutral skill pill
 * type: 'matched' | 'missing' | 'neutral' | 'default'
 */
const SkillTag = ({ name, type = 'default', size = 'sm' }) => {
  const styles = {
    matched: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20',
    missing: 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-600',
    default: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20',
  };

  const currentStyle = styles[type] || styles.default;
  const sizeClasses = size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  // Safely extract string if name is an object (e.g. { skill: 'React' } or { name: 'React' })
  const displayName = typeof name === 'string'
    ? name
    : typeof name === 'object' && name !== null
    ? name.name || name.skill || name.title || Object.values(name)[0] || JSON.stringify(name)
    : String(name || '');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors ${sizeClasses} ${currentStyle}`}
    >
      {type === 'matched' && <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
      {type === 'missing' && <X className="w-3 h-3 text-rose-400 flex-shrink-0" />}
      {type === 'default' && <Tag className="w-3 h-3 text-indigo-400 opacity-60 flex-shrink-0" />}
      <span className="truncate max-w-[200px]">{displayName}</span>
    </span>
  );
};

export default SkillTag;
