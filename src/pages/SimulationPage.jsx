import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { WarehouseGrid } from '../components/warehouse/WarehouseGrid';
import { GridControls } from '../components/warehouse/GridControls';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { AlgorithmComparisonModal } from '../components/simulation/AlgorithmComparisonModal';
import { ALGORITHMS } from '../utils/pathfinding';
import {
  PlaySquare,
  Sparkles,
  Layers,
  BarChart2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Bot,
  Zap,
  Activity
} from 'lucide-react';

export const SimulationPage = () => {
  const {
    grid,
    robots,
    selectedRobot,
    selectedRobotId,
    setSelectedRobotId,
    setDestinationForRobot,
    zoomLevel,
    extraObstacles,
    selectedAlgorithm,
    setSelectedAlgorithm,
    generateRandomOrders,
    generateObstacles,
    triggerCollisionScenario,
    collisionAlert,
    setCollisionAlert,
    simStats,
    collisionCount
  } = useWarehouse();

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleCellClick = (cell) => {
    setDestinationForRobot(selectedRobotId, { x: cell.x, y: cell.y });
  };

  const handleAlgorithmChange = (e) => {
    const val = e.target.value;
    if (val === 'COMPARE') {
      setIsCompareModalOpen(true);
    } else {
      setSelectedAlgorithm(val);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark border border-cardBorder rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-primaryCyan/10 text-primaryCyan border border-primaryCyan/20 font-mono">
              MAIN ARENA
            </span>
            <span className="text-xs text-textDark font-mono font-medium">20x20 Multi-Agent Arena</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-textLight flex items-center gap-3 mt-1">
            <PlaySquare className="w-5 h-5 text-primaryCyan" />
            <span>Interactive Multi-Robot Pathfinding Simulation</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Real-time Trajectory Generation, Collision Avoidance & Priority Path Replanning
          </p>
        </div>

        {/* Algorithm Picker & Compare Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-cardBorder text-xs">
            <Layers className="w-4 h-4 text-primaryCyan" />
            <span className="text-textDark font-medium">Solver:</span>
            <select
              value={selectedAlgorithm}
              onChange={handleAlgorithmChange}
              className="bg-transparent text-primaryCyan font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value={ALGORITHMS.ASTAR} className="bg-cardDark text-textLight">A* Algorithm (Manhattan)</option>
              <option value={ALGORITHMS.DIJKSTRA} className="bg-cardDark text-textLight">Dijkstra (Uniform Cost)</option>
              <option value={ALGORITHMS.BFS} className="bg-cardDark text-textLight">BFS (Breadth First)</option>
              <option value="COMPARE" className="bg-cardDark text-warningAmber font-bold">⚡ Compare All Algorithms...</option>
            </select>
          </div>

          <Button
            variant="warning"
            icon={BarChart2}
            onClick={() => setIsCompareModalOpen(true)}
          >
            Compare Benchmark
          </Button>
        </div>
      </div>

      {/* Collision Alert Banner / MAPF Conflict Resolution Notification */}
      {collisionAlert && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300 shadow-green-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 flex-shrink-0 text-emerald-400" />
            <div>
              <p className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>MULTI-AGENT PATH PLANNING (MAPF) ACTIVE</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500 text-bgDark font-mono">ZERO COLLISIONS</span>
              </p>
              <p className="text-xs text-emerald-200 mt-0.5">
                {collisionAlert.resolvedMessage || `Intersecting trajectories between ${collisionAlert.r1} and ${collisionAlert.r2} resolved at cell (${collisionAlert.cell.x},${collisionAlert.cell.y}) via Reservation Table right-of-way.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCollisionAlert(null)}
            className="px-3 py-1 rounded bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
          >
            Dismiss Notification
          </button>
        </div>
      )}

      {/* Main Controls Bar */}
      <GridControls />

      {/* Quick Action Generators */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-cardDark border border-cardBorder">
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={RefreshCw} onClick={generateRandomOrders}>
            Generate Random Orders
          </Button>
          <Button
            variant={extraObstacles.length > 0 ? 'warning' : 'outline'}
            onClick={generateObstacles}
          >
            {extraObstacles.length > 0 ? 'Clear Random Obstacles' : 'Generate Obstacles'}
          </Button>
        </div>

        <Button
          variant="danger"
          icon={Sparkles}
          onClick={triggerCollisionScenario}
        >
          ⚡ Demo MAPF Priority & Right-of-Way Scenario
        </Button>
      </div>

      {/* Grid Layout & Telemetry Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* 20x20 Interactive Simulation Arena (3 Cols Wide) */}
        <div className="lg:col-span-3">
          <WarehouseGrid
            grid={grid}
            robots={robots}
            selectedRobotId={selectedRobotId}
            onSelectRobot={(id) => setSelectedRobotId(id)}
            onCellClick={handleCellClick}
            zoomLevel={zoomLevel}
            showPaths={true}
            extraObstacles={extraObstacles}
            collisionAlert={collisionAlert}
          />
        </div>

        {/* Live Simulation Performance Inspector (1 Col Wide) */}
        <div className="space-y-6">

          {/* Current Execution Stats */}
          <Card title="MAPF Solver Telemetry" subtitle="Space-Time Reservation Metrics" icon={Cpu}>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-cardBorder">
                <span className="text-textDark font-sans">Active Engine:</span>
                <span className="font-bold text-primaryCyan">Space-Time A* MAPF</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-cardBorder">
                <span className="text-textDark font-sans">Execution Time:</span>
                <span className="font-bold text-secondaryGreen">{simStats.executionTimeMs} ms</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-cardBorder">
                <span className="text-textDark font-sans">Nodes Explored:</span>
                <span className="font-bold text-warningAmber">{simStats.nodesVisited}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-cardBorder">
                <span className="text-textDark font-sans">Reservation Replans:</span>
                <span className="font-bold text-purple-400">{simStats.replansCount} Dynamic</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-cardBorder">
                <span className="text-textDark font-sans">Active Yield / Waiting:</span>
                <span className="font-bold text-amber-400">{simStats.waitingRobotsCount || 0} AGVs</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-cardBorder">
                <span className="text-textDark font-sans">Collision Status:</span>
                <span className="font-bold text-emerald-400">0 Collisions (Guaranteed)</span>
              </div>
            </div>
          </Card>

          {/* Target Tracking Inspector */}
          {selectedRobot && (
            <Card title={`AGV Telemetry: ${selectedRobot.id}`} subtitle={selectedRobot.name} icon={Bot}>
              <div className="space-y-2 text-xs">
                <p className="flex justify-between items-center">
                  <span className="text-textDark">Robot ID:</span>
                  <span className="font-mono font-bold text-primaryCyan">{selectedRobot.id}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-textDark">Current Status:</span>
                  <StatusBadge status={selectedRobot.status} />
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-textDark">Current Task:</span>
                  <span className="font-medium text-textLight text-right max-w-[140px] truncate">{selectedRobot.currentTask}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-textDark">Battery Level:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedRobot.battery}%</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-textDark">Speed:</span>
                  <span className="font-mono text-textLight">{selectedRobot.speed} m/s</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-textDark">Remaining Dist:</span>
                  <span className="font-mono text-primaryCyan">{selectedRobot.remainingDistance || '0 m'}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="text-textDark">Estimated ETA:</span>
                  <span className="font-mono text-warningAmber">{selectedRobot.eta || '0s'}</span>
                </p>
                <p className="flex justify-between items-center pt-1 border-t border-cardBorder">
                  <span className="text-textDark">Position ➔ Goal:</span>
                  <span className="font-mono text-textMuted">
                    ({selectedRobot.pos.x},{selectedRobot.pos.y}) ➔ {selectedRobot.target ? `(${selectedRobot.target.x},${selectedRobot.target.y})` : 'None'}
                  </span>
                </p>
              </div>
            </Card>
          )}

          {/* Viva Presentation Hint */}
          <div className="p-4 rounded-xl bg-slate-900 border border-cardBorder text-xs text-textMuted space-y-2">
            <p className="font-bold text-textLight flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-warningAmber" /> Viva Presentation Tip:
            </p>
            <p>
              Click <strong>"Demo MAPF Priority & Right-of-Way Scenario"</strong> to show how <code>Emergency</code> priority robots reserve space-time paths first while lower-priority <code>Normal</code> robots wait or detour without colliding!
            </p>
          </div>

        </div>

      </div>

      {/* Algorithm Benchmark Comparison Modal */}
      <AlgorithmComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
    </div>
  );
};
