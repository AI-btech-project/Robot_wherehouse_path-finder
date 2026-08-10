import React from 'react';
import { Battery, BatteryCharging, BatteryWarning, Zap } from 'lucide-react';

export const BatteryIndicator = ({ level, isCharging = false, showLabel = true, size = 'md' }) => {
  const pct = Math.min(100, Math.max(0, level));

  let colorClass = 'bg-secondaryGreen text-secondaryGreen shadow-green-glow';
  let borderClass = 'border-secondaryGreen/40';
  let isLow = false;

  if (pct < 20) {
    colorClass = 'bg-dangerRed text-dangerRed shadow-red-glow animate-pulse';
    borderClass = 'border-dangerRed/60';
    isLow = true;
  } else if (pct < 50) {
    colorClass = 'bg-warningAmber text-warningAmber shadow-amber-glow';
    borderClass = 'border-warningAmber/40';
  }

  const widthClass = size === 'sm' ? 'w-10 h-4' : size === 'lg' ? 'w-16 h-6' : 'w-12 h-5';

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${widthClass} rounded-md border ${borderClass} bg-slate-950 p-0.5 flex items-center shadow-inner overflow-hidden`}>
        {/* Progress Bar Fill */}
        <div
          className={`h-full rounded-sm transition-all duration-700 ease-out ${colorClass.split(' ')[0]} ${colorClass.split(' ')[2] || ''}`}
          style={{ width: `${pct}%` }}
        />

        {/* Battery Terminal Tip */}
        <div className="absolute -right-1 top-1.5 w-1 h-2 rounded-r bg-slate-700" />
      </div>

      {showLabel && (
        <span className={`text-xs font-mono font-bold flex items-center gap-1 ${colorClass.split(' ')[1]}`}>
          {isCharging ? (
            <>
              <Zap className="w-3.5 h-3.5 text-secondaryGreen animate-bounce" />
              <span>{pct}%</span>
            </>
          ) : isLow ? (
            <>
              <BatteryWarning className="w-3.5 h-3.5 text-dangerRed animate-pulse" />
              <span>{pct}%</span>
            </>
          ) : (
            `${pct}%`
          )}
        </span>
      )}
    </div>
  );
};
