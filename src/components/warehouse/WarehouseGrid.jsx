import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CELL_TYPES } from '../../utils/mockData';
import { BatteryCharging, Package, Truck, ShieldAlert, Bot, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target } from 'lucide-react';

export const WarehouseGrid = ({
  grid,
  robots,
  selectedRobotId,
  onSelectRobot,
  onCellClick,
  zoomLevel = 1,
  showPaths = true,
  extraObstacles = [],
  collisionAlert = null
}) => {
  const selectedRobot = robots.find(r => r.id === selectedRobotId);

  // Map out cell paths for visualization
  const activePathsMap = new Map();
  if (showPaths) {
    robots.forEach(r => {
      if (r.path && r.path.length > 0) {
        const isReplanning = String(r.status).toLowerCase() === 'replanning';
        r.path.forEach((p, idx) => {
          const key = `${p.x},${p.y}`;
          if (!activePathsMap.has(key)) {
            activePathsMap.set(key, {
              isSelected: r.id === selectedRobotId,
              step: idx,
              robotId: r.id,
              isReplanning
            });
          }
        });
      }
    });
  }

  // Check extra obstacles
  const isExtraObstacle = (x, y) => extraObstacles.some(o => o.x === x && o.y === y);

  // Calculate direction arrow helper for robot
  const getDirectionIcon = (robot) => {
    if (!robot.path || robot.path.length <= 1) return null;
    const current = robot.pos;
    const next = robot.path[1];
    const dx = next.x - current.x;
    const dy = next.y - current.y;

    if (dx > 0) return <ArrowRight className="w-2.5 h-2.5 text-bgDark" />;
    if (dx < 0) return <ArrowLeft className="w-2.5 h-2.5 text-bgDark" />;
    if (dy > 0) return <ArrowDown className="w-2.5 h-2.5 text-bgDark" />;
    if (dy < 0) return <ArrowUp className="w-2.5 h-2.5 text-bgDark" />;
    return null;
  };

  return (
    <div className="overflow-auto max-w-full max-h-[75vh] p-4 bg-cardDark rounded-2xl border border-white/5 shadow-card flex items-center justify-center">
      <div
        className="grid grid-cols-20 gap-1 transition-transform duration-200 select-none bg-grid-pattern p-3 rounded-xl border border-white/5"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, minmax(32px, 1fr))`,
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left'
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isObstacle = isExtraObstacle(cell.x, cell.y);
            const robotHere = robots.find(r => r.pos.x === cell.x && r.pos.y === cell.y);
            const pathInfo = activePathsMap.get(`${cell.x},${cell.y}`);
            const isTarget = selectedRobot?.target && selectedRobot.target.x === cell.x && selectedRobot.target.y === cell.y;
            const isCollisionCell = collisionAlert?.cell?.x === cell.x && collisionAlert?.cell?.y === cell.y;

            let cellBg = 'bg-[#111111] border-white/5 hover:border-white/20 hover:bg-white/5';
            let icon = null;

            if (isCollisionCell) {
              cellBg = 'bg-red-950/80 border-red-500 text-white';
              icon = <ShieldAlert className="w-4 h-4 text-red-400" />;
            } else if (isObstacle || cell.type === CELL_TYPES.OBSTACLE) {
              cellBg = 'bg-[#1C1C1C] border-white/10 text-red-400';
              icon = <ShieldAlert className="w-3.5 h-3.5 opacity-60" />;
            } else if (cell.type === CELL_TYPES.SHELF) {
              cellBg = 'bg-[#181818] border-white/5 text-textMuted';
            } else if (cell.type === CELL_TYPES.CHARGING) {
              cellBg = 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400';
              icon = <BatteryCharging className="w-3.5 h-3.5" />;
            } else if (cell.type === CELL_TYPES.PACKING) {
              cellBg = 'bg-amber-950/40 border-amber-500/30 text-amber-400';
              icon = <Package className="w-3.5 h-3.5" />;
            } else if (cell.type === CELL_TYPES.DELIVERY) {
              cellBg = 'bg-purple-950/40 border-purple-500/30 text-purple-400';
              icon = <Truck className="w-3.5 h-3.5" />;
            }

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                onClick={() => onCellClick && onCellClick(cell)}
                title={`Cell (${cell.x},${cell.y}) - ${cell.label || cell.type}`}
                className={`relative aspect-square w-8 h-8 sm:w-10 sm:h-10 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all duration-150 text-[10px] font-mono ${cellBg}`}
              >
                {/* Cell Label for Shelves */}
                {cell.type === CELL_TYPES.SHELF && (
                  <span className="text-[8px] text-textMuted leading-none">{cell.label}</span>
                )}

                {/* Default Zone Icon */}
                {icon && !robotHere && <div className="z-0">{icon}</div>}

                {/* Path Visualization (Solid Line for Planned Path, Dotted Line for Reserved Future Path) */}
                {pathInfo && !robotHere && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="z-10 flex items-center justify-center"
                  >
                    {pathInfo.isReplanning ? (
                      /* Replanned Route Pulse Overlay */
                      <span className="w-4 h-4 rounded-full border-2 border-dotted border-purple-400 bg-purple-500/40 animate-pulse" />
                    ) : pathInfo.step <= 1 ? (
                      /* Current Planned Path: Solid Line Indicator */
                      <span className={`w-3 h-3 rounded-full border-2 border-solid ${
                        pathInfo.isSelected
                          ? 'bg-primaryCyan border-white shadow-subtle'
                          : 'bg-amber-400 border-amber-200'
                      }`} />
                    ) : (
                      /* Reserved Future Path: Dotted Line Ring Indicator */
                      <span className={`w-3.5 h-3.5 rounded-full border-2 border-dashed ${
                        pathInfo.isSelected
                          ? 'border-primaryCyan/80 bg-primaryCyan/15'
                          : 'border-amber-400/60 bg-amber-400/10'
                      }`} />
                    )}
                  </motion.div>
                )}

                {/* Target Destination Indicator */}
                {isTarget && !robotHere && (
                  <div className="absolute inset-0 z-10 rounded-lg border-2 border-dashed border-primaryCyan bg-primaryCyan/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-primaryCyan" />
                  </div>
                )}

                {/* Animated AGV Robot Token */}
                {robotHere && (() => {
                  const isSelected = robotHere.id === selectedRobotId;
                  const st = String(robotHere.status).toLowerCase();
                  const isEmergency = robotHere.priority === 'Emergency' || st === 'emergency';
                  const isLoaded = robotHere.priority === 'Loaded';
                  const isWaiting = st === 'waiting';
                  const isReplanning = st === 'replanning';
                  const isCompleted = st === 'completed';
                  const isCharging = st === 'charging';

                  let robotBg = 'bg-[#1E1E1E] text-primaryCyan border-primaryCyan/50 hover:border-primaryCyan';

                  if (isSelected) {
                    robotBg = 'bg-primaryCyan text-bgDark border-white font-bold ring-2 ring-primaryCyan/50 scale-110 z-30';
                  } else if (isCharging) {
                    robotBg = 'bg-emerald-600 text-bgDark border-emerald-300 font-bold';
                  } else if (isCompleted) {
                    robotBg = 'bg-emerald-600 text-white border-emerald-300';
                  } else if (isEmergency) {
                    robotBg = 'bg-dangerRed text-white border-red-200 animate-bounce';
                  } else if (isReplanning) {
                    robotBg = 'bg-purple-900 text-purple-200 border-purple-400 animate-pulse';
                  } else if (isWaiting) {
                    robotBg = 'bg-amber-900 text-amber-200 border-amber-400 animate-pulse';
                  } else if (isLoaded) {
                    robotBg = 'bg-purple-950 text-purple-300 border-purple-400';
                  }

                  const tooltipText = [
                    `Robot ID: ${robotHere.id}`,
                    `Current Task: ${robotHere.currentTask}`,
                    `Current Status: ${robotHere.status}`,
                    `Battery Percentage: ${robotHere.battery}%`,
                    `Speed: ${robotHere.speed} m/s`,
                    `Remaining Distance: ${robotHere.remainingDistance || '0 m'}`,
                    `ETA: ${robotHere.eta || '0s'}`
                  ].join('\n');

                  return (
                    <motion.div
                      layoutId={`robot-${robotHere.id}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRobot && onSelectRobot(robotHere.id);
                      }}
                      title={tooltipText}
                      className={`absolute inset-0 z-20 rounded-lg flex flex-col items-center justify-center border font-bold text-[9px] cursor-pointer shadow-subtle transition-colors duration-150 ${robotBg}`}
                    >
                      <div className="flex items-center gap-0.5">
                        <Bot className="w-3.5 h-3.5" />
                        {getDirectionIcon(robotHere)}
                      </div>
                      <span className="leading-none text-[8px] font-mono">{robotHere.id}</span>

                      {isWaiting && (
                        <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-amber-500 text-bgDark text-[7px] font-extrabold">
                          WAIT
                        </span>
                      )}
                      {isReplanning && (
                        <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-purple-500 text-white text-[7px] font-extrabold animate-pulse">
                          RPLAN
                        </span>
                      )}
                      {isEmergency && !isSelected && (
                        <span className="absolute -top-1 -left-1 px-1 py-0.2 rounded-full bg-red-600 text-white text-[7px] font-extrabold">
                          EMG
                        </span>
                      )}
                    </motion.div>
                  );
                })()}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
