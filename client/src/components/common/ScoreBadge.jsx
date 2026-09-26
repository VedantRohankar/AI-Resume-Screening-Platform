import React from 'react';
import { Sparkles, CheckCircle, AlertTriangle, XCircle, Trophy } from 'lucide-react';

/**
 * ScoreBadge renders a futuristic AI match score badge with dynamic colors and icons.
 * Score 90-100: Emerald / Elite Match
 * Score 75-89: Cyan / Strong Match
 * Score 60-74: Amber / Moderate Match
 * Score <60: Rose / Low Match
 */
const ScoreBadge = ({ score = 0, size = 'md', showLabel = true, variant = 'pill' }) => {
  const numScore = Math.round(Number(score) || 0);

  const getTier = (s) => {
    if (s >= 90) return { label: 'Elite Match', color: 'emerald', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' };
    if (s >= 75) return { label: 'Strong Match', color: 'cyan', text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' };
    if (s >= 60) return { label: 'Moderate Match', color: 'amber', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' };
    return { label: 'Low Match', color: 'rose', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', glow: 'shadow-rose-500/20' };
  };

  const tier = getTier(numScore);

  if (variant === 'circular') {
    const radius = size === 'lg' ? 36 : size === 'sm' ? 20 : 28;
    const strokeWidth = size === 'lg' ? 6 : size === 'sm' ? 4 : 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (numScore / 100) * circumference;
    const svgSize = (radius + strokeWidth) * 2;

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center" style={{ width: svgSize, height: svgSize }}>
          <svg className="transform -rotate-90" width={svgSize} height={svgSize}>
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${tier.text} transition-all duration-1000 ease-out`}
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`font-bold font-mono ${tier.text} ${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-sm'}`}>
              {numScore}%
            </span>
          </div>
        </div>
        {showLabel && (
          <span className={`mt-1 font-medium tracking-wide ${tier.text} ${size === 'lg' ? 'text-xs' : 'text-[10px]'}`}>
            {tier.label}
          </span>
        )}
      </div>
    );
  }

  // Pill variant
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${tier.bg} ${tier.border} ${tier.text} ${tier.glow} shadow-sm backdrop-blur-md`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span className="font-mono font-bold text-xs">{numScore}%</span>
      {showLabel && (
        <span className="text-[11px] font-medium border-l border-current/20 pl-1.5 opacity-90">
          {tier.label}
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
