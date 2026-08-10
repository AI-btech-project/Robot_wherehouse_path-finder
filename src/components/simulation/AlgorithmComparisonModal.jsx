import React, { useMemo } from 'react';
import { Modal } from '../common/Modal';
import { useWarehouse } from '../../context/WarehouseContext';
import { compareAlgorithms } from '../../utils/pathfinding';
import { Cpu, Zap, Activity, HardDrive, CheckCircle2 } from 'lucide-react';

export const AlgorithmComparisonModal = ({ isOpen, onClose }) => {
  const { grid, selectedRobot, extraObstacles } = useWarehouse();

  // Calculate benchmark comparisons for current start/target
  const benchmarks = useMemo(() => {
    const start = selectedRobot?.pos || { x: 0, y: 0 };
    const target = selectedRobot?.target || { x: 18, y: 18 };
    return compareAlgorithms(start, target, grid, extraObstacles);
  }, [grid, selectedRobot, extraObstacles]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pathfinding Algorithm Performance Benchmark"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cardBorder text-xs text-textMuted flex items-center gap-3">
          <Cpu className="w-6 h-6 text-primaryCyan flex-shrink-0 animate-pulse" />
          <div>
            <p className="font-semibold text-textLight">Evaluated Trajectory:</p>
            <p className="font-mono text-primaryCyan">
              Start Cell ({selectedRobot?.pos?.x || 0}, {selectedRobot?.pos?.y || 0}) ➔ Target Cell ({selectedRobot?.target?.x || 18}, {selectedRobot?.target?.y || 18})
            </p>
          </div>
        </div>

        {/* Benchmark Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benchmarks.map((algo, idx) => (
            <div
              key={algo.name}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${
                idx === 0
                  ? 'bg-primaryCyan/10 border-primaryCyan/50 shadow-soft-glow'
                  : 'bg-cardDark border-cardBorder'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-textLight">{algo.name}</h4>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primaryCyan text-bgDark uppercase">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-textDark">
                  {idx === 0 ? 'Optimal heuristic search (Manhattan)' : idx === 1 ? 'Exhaustive uniform cost exploration' : 'Unweighted queue traversal'}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-cardBorder/60">
                  <span className="text-textDark flex items-center gap-1">
                    <Zap className="w-3 h-3 text-warningAmber" /> Execution Time:
                  </span>
                  <span className="font-bold text-textLight">{algo.time} ms</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-cardBorder/60">
                  <span className="text-textDark flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primaryCyan" /> Nodes Visited:
                  </span>
                  <span className="font-bold text-primaryCyan">{algo.visited}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-cardBorder/60">
                  <span className="text-textDark flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-secondaryGreen" /> Path Length:
                  </span>
                  <span className="font-bold text-textLight">{algo.length} cells</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-textDark flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-purple-400" /> Memory Est.:
                  </span>
                  <span className="font-bold text-textLight">{algo.memory} KB</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* viva explanation note */}
        <div className="p-4 rounded-xl bg-slate-900 border border-cardBorder text-xs space-y-1">
          <p className="font-bold text-textLight">Engineering Analysis Summary:</p>
          <p className="text-textMuted">
            A* exhibits lower node expansion compared to Dijkstra due to the Manhattan heuristic guidance \(h(n) = |x_1 - x_2| + |y_1 - y_2|\). Dijkstra guarantees shortest path on non-negative weighted graphs but explores concentric wave fronts. BFS guarantees shortest path on uniform 4-connected grid graphs but lacks heuristic directionality.
          </p>
        </div>
      </div>
    </Modal>
  );
};
