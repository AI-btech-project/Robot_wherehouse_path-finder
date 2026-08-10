import React from 'react';
import { PackageOpen, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Records Found',
  description = 'Try adjusting your search criteria or resetting active filters.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-cardDark/40 border border-cardBorder/60 rounded-2xl space-y-4 my-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-cardBorder text-primaryCyan shadow-soft-glow">
        <Icon className="w-8 h-8 animate-bounce" />
      </div>

      <div className="max-w-xs space-y-1">
        <h3 className="font-bold text-textLight text-sm">{title}</h3>
        <p className="text-xs text-textDark leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button size="sm" variant="outline" icon={RefreshCw} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
