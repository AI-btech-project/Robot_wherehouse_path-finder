import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { Menu, Activity, Cpu } from 'lucide-react';

export const Navbar = ({ onOpenMobileMenu }) => {
  const {
    isRunning,
    isPaused,
    selectedAlgorithm,
    collisionAlert
  } = useWarehouse();

  // Compute live simulation status label
  const simStatus = !isRunning
    ? { label: 'SIM STANDBY', bg: 'bg-white/5 text-textMuted border-white/10' }
    : isPaused
    ? { label: 'SIM PAUSED', bg: 'bg-warningAmber/15 text-warningAmber border-warningAmber/30' }
    : { label: 'SIM RUNNING', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };

  return (
    <header className="sticky top-0 z-30 h-16 bg-sidebarDark border-b border-white/5 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* 1. Mobile Menu Toggle & Project Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-textMuted hover:text-textLight hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primaryCyan/10 text-primaryCyan border border-primaryCyan/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-xs sm:text-sm text-textLight leading-tight tracking-tight">
              CPS Multi-Agent Path Planner
            </h1>
            <p className="text-[10px] text-textDark font-mono hidden sm:block">
              {selectedAlgorithm} Space-Time Solver
            </p>
          </div>
        </div>
      </div>

      {/* 2. Simulation Status & Active MAPF Yielding Alert */}
      <div className="flex items-center gap-3">
        {collisionAlert && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yielding: {collisionAlert.r1} & {collisionAlert.r2}</span>
          </div>
        )}

        <div className={`px-3 py-1 rounded-full border text-[11px] font-mono font-semibold flex items-center gap-2 ${simStatus.bg}`}>
          <span className={`w-2 h-2 rounded-full ${isRunning && !isPaused ? 'bg-emerald-500 animate-pulse' : isPaused ? 'bg-warningAmber' : 'bg-textMuted'}`} />
          <span>{simStatus.label}</span>
        </div>
      </div>
    </header>
  );
};



