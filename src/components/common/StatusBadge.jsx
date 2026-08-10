import React from 'react';

export const ROBOT_STATES = {
  IDLE: 'Idle',
  MOVING: 'Moving',
  WAITING: 'Waiting',
  REPLANNING: 'Replanning',
  CHARGING: 'Charging',
  EMERGENCY: 'Emergency',
  COMPLETED: 'Completed'
};

export const StatusBadge = ({ status }) => {
  const s = String(status).toLowerCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (s === 'moving' || s === 'in-transit' || s === 'active') {
    styles = 'bg-primaryCyan/10 text-primaryCyan border-primaryCyan/30';
    dotColor = 'bg-primaryCyan';
  } else if (s === 'charging') {
    styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (s === 'completed' || s === 'delivered') {
    styles = 'bg-secondaryGreen/10 text-secondaryGreen border-secondaryGreen/30';
    dotColor = 'bg-secondaryGreen';
  } else if (s === 'idle' || s === 'pending') {
    styles = 'bg-slate-800 text-slate-400 border-slate-700';
    dotColor = 'bg-slate-400';
  } else if (s === 'waiting') {
    styles = 'bg-warningAmber/15 text-warningAmber border-warningAmber/40 ring-1 ring-warningAmber/30';
    dotColor = 'bg-warningAmber';
  } else if (s === 'replanning') {
    styles = 'bg-purple-950/60 text-purple-300 border-purple-400/50 ring-1 ring-purple-400/40 animate-pulse';
    dotColor = 'bg-purple-400';
  } else if (s === 'emergency' || s === 'error' || s === 'cancelled') {
    styles = 'bg-dangerRed/15 text-dangerRed border-dangerRed/40 ring-1 ring-dangerRed/40 animate-pulse';
    dotColor = 'bg-dangerRed';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

