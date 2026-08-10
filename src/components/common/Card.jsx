import React from 'react';

export const Card = ({ title, subtitle, icon: Icon, action, children, className = '' }) => {
  return (
    <div className={`bg-cardDark border border-white/5 rounded-2xl p-5 sm:p-6 shadow-card transition-all duration-200 hover:border-white/10 ${className}`}>
      {(title || Icon || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-white/5 text-primaryCyan border border-white/5">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-textLight text-sm sm:text-base leading-snug">{title}</h3>}
              {subtitle && <p className="text-xs text-textDark mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};


