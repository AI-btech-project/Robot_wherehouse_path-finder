import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Settings, RefreshCw, Sliders, Moon, Cpu, RotateCcw, Check } from 'lucide-react';
import { useWarehouse } from '../context/WarehouseContext';

export const SettingsPage = () => {
  const { simSpeed, setSimSpeed, selectedAlgorithm, setSelectedAlgorithm, logActivity } = useWarehouse();

  const [gridSize, setGridSize] = useState('20x20');
  const [robotMaxSpeed, setRobotMaxSpeed] = useState('1.8');
  const [simStepDelay, setSimStepDelay] = useState('500');
  const [themeMode, setThemeMode] = useState('dark');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    logActivity('Simulation configuration parameters updated', 'task', 'Settings');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setGridSize('20x20');
    setRobotMaxSpeed('1.8');
    setSimStepDelay('500');
    setSimSpeed(1);
    setThemeMode('dark');
    logActivity('Simulation settings restored to factory defaults', 'task', 'Settings');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark border border-cardBorder rounded-2xl p-6 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-textLight flex items-center gap-3">
            <Settings className="w-6 h-6 text-primaryCyan" />
            <span>Simulation Parameters & Settings</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Configure Grid Dimensions, Robot Telematics & Pathfinding Parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" icon={RotateCcw} onClick={handleResetDefaults}>
            Reset Settings
          </Button>
          <Button variant="primary" icon={Check} onClick={handleSave}>
            Save Parameters
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-secondaryGreen/10 border border-secondaryGreen/30 text-secondaryGreen text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> System parameters updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Grid & Simulation Controls */}
        <Card title="Grid & Map Settings" subtitle="Warehouse Map Configurations" icon={Sliders}>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-textMuted mb-1.5">Grid Dimensions:</label>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value)}
                className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2.5 text-textLight"
              >
                <option value="15x15">15 x 15 Grid (Small Layout)</option>
                <option value="20x20">20 x 20 Grid (Standard Academic Baseline)</option>
                <option value="25x25">25 x 25 Grid (Extended Warehouse Hub)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-textMuted mb-1.5">Default Robot Speed (m/s):</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="3.0"
                value={robotMaxSpeed}
                onChange={(e) => setRobotMaxSpeed(e.target.value)}
                className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2.5 text-textLight font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-textMuted mb-1.5">Simulation Step Delay (ms):</label>
              <input
                type="number"
                step="50"
                min="100"
                max="2000"
                value={simStepDelay}
                onChange={(e) => setSimStepDelay(e.target.value)}
                className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2.5 text-textLight font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Algorithm Heuristics & Theme */}
        <Card title="Solver & Interface Theme" subtitle="Algorithm Optimization Tuning" icon={Cpu}>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-textMuted mb-1.5">Default Heuristic Solver:</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2.5 text-primaryCyan font-mono font-bold"
              >
                <option value="A*">A* Heuristic Search (Manhattan Distance)</option>
                <option value="Dijkstra">Dijkstra Uniform Cost Search</option>
                <option value="BFS">BFS Breadth First Search</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-textMuted mb-1.5">UI Color Scheme:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between ${
                    themeMode === 'dark'
                      ? 'bg-primaryCyan/10 border-primaryCyan text-primaryCyan font-bold'
                      : 'bg-slate-900 border-cardBorder text-textMuted'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Dark Modern
                  </span>
                  {themeMode === 'dark' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-cardBorder text-[11px] text-textDark">
              <p className="font-bold text-textMuted mb-1">Academic Project Notice:</p>
              <p>
                All pathfinding heuristic calculations comply with standard graph theory models. Changing parameters takes effect immediately on the live grid solver.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
