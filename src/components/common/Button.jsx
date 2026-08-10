import React from 'react';

export const Button = ({
  children,
  onClick,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'warning', 'outline', 'ghost'
  size = 'md',        // 'sm', 'md', 'lg'
  icon: Icon,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-primaryCyan text-bgDark hover:bg-[#FFE175] font-semibold focus:ring-primaryCyan/50',
    secondary: 'bg-emerald-600 text-white hover:bg-emerald-500 font-semibold focus:ring-emerald-500/50',
    danger: 'bg-red-600 text-white hover:bg-red-500 font-semibold focus:ring-red-500/50',
    warning: 'bg-amber-500 text-bgDark hover:bg-amber-400 font-semibold focus:ring-amber-500/50',
    outline: 'border border-white/10 bg-white/5 text-textLight hover:text-white hover:border-white/20 hover:bg-white/10',
    ghost: 'text-textMuted hover:text-textLight hover:bg-white/5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
};


