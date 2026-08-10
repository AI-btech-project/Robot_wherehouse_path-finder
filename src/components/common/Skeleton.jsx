import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  let baseStyles = 'animate-pulse bg-slate-800/80 rounded-lg';

  if (variant === 'circle') {
    baseStyles = 'animate-pulse bg-slate-800/80 rounded-full';
  } else if (variant === 'card') {
    baseStyles = 'animate-pulse bg-slate-800/60 border border-cardBorder rounded-2xl';
  }

  return <div className={`${baseStyles} ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="bg-cardDark border border-cardBorder rounded-2xl p-5 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" variant="circle" />
        <div className="space-y-1.5">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <div className="space-y-2 pt-2">
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-3/4 h-3" />
      <Skeleton className="w-1/2 h-3" />
    </div>
    <Skeleton className="w-full h-9 rounded-xl" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-cardDark border border-cardBorder rounded-xl p-4 space-y-3 animate-pulse">
    <div className="flex justify-between items-center pb-2">
      <Skeleton className="w-48 h-9 rounded-xl" />
      <Skeleton className="w-32 h-9 rounded-xl" />
    </div>
    <div className="space-y-2">
      {Array(rows).fill(0).map((_, i) => (
        <Skeleton key={i} className="w-full h-12 rounded-lg" />
      ))}
    </div>
  </div>
);
