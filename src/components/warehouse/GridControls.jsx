import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { Button } from '../common/Button';
import { ALGORITHMS } from '../../utils/pathfinding';
import {
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';

export const GridControls = () => {
  const {
    isRunning,
    isPaused,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    simSpeed,
    setSimSpeed,
    zoomLevel,
    setZoomLevel,
    selectedAlgorithm,
    setSelectedAlgorithm,
    generateObstacles,
    triggerCollisionScenario,
    extraObstacles
  } = useWarehouse();

  return (
    <div className="bg-cardDark border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-card">
      {/* Simulation Play Controls */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <Button size="sm" variant="primary" icon={Play} onClick={startSimulation}>
            Start Simulation
          </Button>
        ) : isPaused ? (
          <Button size="sm" variant="secondary" icon={Play} onClick={resumeSimulation}>
            Resume
          </Button>
        ) : (
          <Button size="sm" variant="warning" icon={Pause} onClick={pauseSimulation}>
            Pause
          </Button>
        )}

        <Button size="sm" variant="outline" icon={RotateCcw} onClick={resetSimulation}>
          Reset
        </Button>
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
        <Sliders className="w-4 h-4 text-primaryCyan" />
        <span className="text-textDark font-medium">Speed:</span>
        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={simSpeed}
          onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
          className="w-20 accent-primaryCyan cursor-pointer"
        />
        <span className="font-mono font-semibold text-primaryCyan w-8">{simSpeed}x</span>
      </div>

      {/* Algorithm Selector Dropdown */}
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
        <Layers className="w-4 h-4 text-primaryCyan" />
        <span className="text-textDark font-medium">Algorithm:</span>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          className="bg-transparent text-primaryCyan font-mono font-semibold focus:outline-none cursor-pointer"
        >
          <option value={ALGORITHMS.ASTAR} className="bg-cardDark text-textLight">A* (Heuristic)</option>
          <option value={ALGORITHMS.DIJKSTRA} className="bg-cardDark text-textLight">Dijkstra (Uniform Cost)</option>
          <option value={ALGORITHMS.BFS} className="bg-cardDark text-textLight">BFS (Breadth First)</option>
        </select>
      </div>

      {/* Scenario Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={extraObstacles.length > 0 ? 'warning' : 'outline'}
          icon={ShieldAlert}
          onClick={generateObstacles}
        >
          {extraObstacles.length > 0 ? 'Clear Obstacles' : 'Add Obstacles'}
        </Button>

        <Button
          size="sm"
          variant="danger"
          icon={Sparkles}
          onClick={triggerCollisionScenario}
        >
          Demo MAPF Priority Replan
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1.5 border-l border-white/5 pl-3">
        <button
          onClick={() => setZoomLevel(z => Math.min(1.6, z + 0.1))}
          className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-textMuted hover:text-primaryCyan hover:border-white/10 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-textDark px-1">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={() => setZoomLevel(z => Math.max(0.8, z - 0.1))}
          className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-textMuted hover:text-primaryCyan hover:border-white/10 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

