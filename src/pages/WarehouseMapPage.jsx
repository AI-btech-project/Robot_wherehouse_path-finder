import React from 'react';
import { motion } from 'framer-motion';
import { useWarehouse } from '../context/WarehouseContext';
import { WarehouseGrid } from '../components/warehouse/WarehouseGrid';
import { GridControls } from '../components/warehouse/GridControls';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { BatteryIndicator } from '../components/common/BatteryIndicator';
import { Button } from '../components/common/Button';
import { Bot, MapPin, Navigation, Zap, Clock, ShieldCheck, Target } from 'lucide-react';

export const WarehouseMapPage = () => {
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
    simStats,
    collisionAlert
  } = useWarehouse();

  const handleCellClick = (cell) => {
    setDestinationForRobot(selectedRobotId, { x: cell.x, y: cell.y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark/90 backdrop-blur-md border border-cardBorder rounded-2xl p-6 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-textLight flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primaryCyan" />
            <span>Interactive Warehouse Map</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            20x20 Floor Plan Grid • Select Robot & Click Cell to Command Destination Trajectory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-textDark font-mono">Algorithm:</span>
          <span className="px-3 py-1 rounded-lg bg-primaryCyan/10 border border-primaryCyan/30 text-primaryCyan font-mono font-bold text-xs">
            {selectedAlgorithm}
          </span>
        </div>
      </div>

      {/* Grid Controls */}
      <GridControls />

      {/* Grid & Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* 20x20 Grid Display */}
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

        {/* Right Sidebar Inspector */}
        <div className="space-y-6">
          <Card title="Robot Fleet Selector" subtitle="Choose AGV to Teleoperate" icon={Bot}>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-textMuted">Active Fleet AGV:</label>
              <select
                value={selectedRobotId}
                onChange={(e) => setSelectedRobotId(e.target.value)}
                className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2.5 text-xs text-textLight font-mono focus:border-primaryCyan focus:outline-none"
              >
                {robots.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.id} - {r.name} ({r.status})
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {selectedRobot && (
            <Card
              title={`AGV Telemetry: ${selectedRobot.id}`}
              subtitle={selectedRobot.name}
              icon={Navigation}
            >
              <div className="space-y-3 text-xs font-sans">
                <div className="flex items-center justify-between py-1.5 border-b border-cardBorder/60">
                  <span className="text-textDark">Operational Status:</span>
                  <StatusBadge status={selectedRobot.status} />
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-cardBorder/60">
                  <span className="text-textDark">Battery Telematics:</span>
                  <BatteryIndicator level={selectedRobot.battery} isCharging={selectedRobot.status === 'charging'} />
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-cardBorder/60">
                  <span className="text-textDark">Current Cell Position:</span>
                  <span className="font-mono font-bold text-primaryCyan">
                    ({selectedRobot.pos.x}, {selectedRobot.pos.y})
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-cardBorder/60">
                  <span className="text-textDark">Target Destination:</span>
                  <span className="font-mono font-bold text-warningAmber flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    {selectedRobot.target ? `(${selectedRobot.target.x}, ${selectedRobot.target.y})` : 'None'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-cardBorder/60">
                  <span className="text-textDark">Estimated Travel Time:</span>
                  <span className="font-mono text-textLight">{selectedRobot.eta || 'N/A'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-cardBorder space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-textDark">Algorithm Exec Time:</span>
                    <span className="font-mono text-primaryCyan">{simStats.executionTimeMs} ms</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-textDark">Nodes Explored:</span>
                    <span className="font-mono text-secondaryGreen">{simStats.nodesVisited}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-textDark">Path Length:</span>
                    <span className="font-mono text-warningAmber">{selectedRobot.path?.length || 0} cells</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="p-4 rounded-xl bg-slate-900 border border-cardBorder text-xs text-textMuted space-y-2">
            <p className="font-bold text-textLight flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-warningAmber" /> Map Teleoperation Note:
            </p>
            <p>
              Selecting a target cell immediately invokes the active algorithm (<strong>{selectedAlgorithm}</strong>) to calculate a collision-free path.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
