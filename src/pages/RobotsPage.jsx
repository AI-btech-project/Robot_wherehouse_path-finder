import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarehouse } from '../context/WarehouseContext';
import { Table } from '../components/common/Table';
import { StatusBadge } from '../components/common/StatusBadge';
import { BatteryIndicator } from '../components/common/BatteryIndicator';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Bot, LayoutGrid, TableProperties, Navigation, Pause, Play, Info, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RobotsPage = () => {
  const { robots, setSelectedRobotId, updateRobotPriority, pauseRobot, resumeRobot } = useWarehouse();
  const [viewMode, setViewMode] = useState('grid');
  const [inspectRobot, setInspectRobot] = useState(null);
  const navigate = useNavigate();

  const handleSelectRobot = (id) => {
    setSelectedRobotId(id);
    navigate('/map');
  };

  const columns = [
    {
      header: 'Robot ID',
      key: 'id',
      render: (r) => (
        <div className="flex items-center gap-2 font-mono font-semibold text-primaryCyan">
          <Bot className="w-4 h-4 text-primaryCyan" />
          <span>{r.id}</span>
        </div>
      )
    },
    {
      header: 'Name & Model',
      key: 'name',
      render: (r) => (
        <div>
          <p className="font-semibold text-textLight">{r.name}</p>
          <p className="text-[10px] text-textDark font-mono">{r.model}</p>
        </div>
      )
    },
    {
      header: 'Priority Rank',
      key: 'priority',
      render: (r) => (
        <select
          value={r.priority || 'Normal'}
          onChange={(e) => updateRobotPriority(r.id, e.target.value)}
          className="px-2 py-1 rounded text-xs font-mono font-semibold bg-white/5 border border-white/10 text-primaryCyan focus:outline-none cursor-pointer"
        >
          <option value="Emergency" className="bg-cardDark text-red-400">Emergency (4)</option>
          <option value="Loaded" className="bg-cardDark text-purple-300">Loaded (3)</option>
          <option value="Normal" className="bg-cardDark text-primaryCyan">Normal (2)</option>
          <option value="Idle" className="bg-cardDark text-textMuted">Idle (1)</option>
        </select>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      header: 'Battery',
      key: 'battery',
      render: (r) => <BatteryIndicator level={r.battery} isCharging={String(r.status).toLowerCase() === 'charging'} />
    },
    {
      header: 'Current Task',
      key: 'currentTask',
      render: (r) => <span className="text-xs text-textMuted">{r.currentTask}</span>
    },
    {
      header: 'Speed',
      key: 'speed',
      render: (r) => <span className="font-mono text-xs text-textLight">{r.speed} m/s</span>
    },
    {
      header: 'Remaining Dist',
      key: 'remainingDistance',
      render: (r) => <span className="font-mono text-xs text-primaryCyan">{r.remainingDistance || '0 m'}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" icon={Pause} onClick={() => pauseRobot(r.id)} title="Pause Robot" />
          <Button size="sm" variant="ghost" icon={Play} onClick={() => resumeRobot(r.id)} title="Resume Robot" />
          <Button size="sm" variant="outline" icon={Info} onClick={() => setInspectRobot(r)}>Details</Button>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark border border-white/5 rounded-2xl p-6 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-textLight flex items-center gap-3">
            <Bot className="w-5 h-5 text-primaryCyan" />
            <span>AGV Robot Fleet Telemetry & Management</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            20 Autonomous Guided Vehicles • Priority Resolution & Motion Controls
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid' ? 'bg-primaryCyan text-bgDark font-semibold' : 'text-textMuted hover:text-textLight'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Grid Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'table' ? 'bg-primaryCyan text-bgDark font-semibold' : 'text-textMuted hover:text-textLight'
            }`}
          >
            <TableProperties className="w-4 h-4" /> Telemetry Table
          </button>
        </div>
      </div>

      {/* Grid Cards View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {robots.map((r) => {
            // Calculate task progress bar percentage
            const remainingSteps = r.path ? r.path.length : 0;
            const progressPct = remainingSteps === 0
              ? 100
              : Math.min(100, Math.max(10, Math.round(100 - (remainingSteps * 12))));

            return (
              <div
                key={r.id}
                className="bg-cardDark border border-white/5 rounded-2xl p-5 shadow-card space-y-4 hover:border-white/10 transition-colors"
              >
                {/* Header: Robot ID & Status */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/5 text-primaryCyan border border-white/5">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-textLight font-mono">{r.id}</h3>
                      <p className="text-[10px] text-textMuted">{r.name}</p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                {/* Telemetry Metrics */}
                <div className="space-y-2.5 text-xs font-sans">
                  {/* Priority */}
                  <div className="flex justify-between items-center">
                    <span className="text-textMuted">Priority:</span>
                    <select
                      value={r.priority || 'Normal'}
                      onChange={(e) => updateRobotPriority(r.id, e.target.value)}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white/5 border border-white/5 text-primaryCyan focus:outline-none cursor-pointer"
                    >
                      <option value="Emergency" className="bg-cardDark text-red-400">Emergency (4)</option>
                      <option value="Loaded" className="bg-cardDark text-purple-300">Loaded (3)</option>
                      <option value="Normal" className="bg-cardDark text-primaryCyan">Normal (2)</option>
                      <option value="Idle" className="bg-cardDark text-textMuted">Idle (1)</option>
                    </select>
                  </div>

                  {/* Battery */}
                  <div className="flex justify-between items-center">
                    <span className="text-textMuted">Battery:</span>
                    <BatteryIndicator level={r.battery} isCharging={String(r.status).toLowerCase() === 'charging'} />
                  </div>

                  {/* Speed */}
                  <div className="flex justify-between items-center">
                    <span className="text-textMuted">Speed:</span>
                    <span className="font-mono font-semibold text-textLight">{r.speed} m/s</span>
                  </div>

                  {/* Current Task */}
                  <div className="flex justify-between items-center">
                    <span className="text-textMuted">Current Task:</span>
                    <span className="font-semibold text-textLight text-right max-w-[130px] truncate">{r.currentTask}</span>
                  </div>

                  {/* Task Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-textMuted">Task Progress:</span>
                      <span className="font-mono text-primaryCyan font-semibold">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-primaryCyan transition-all duration-300 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons Row: Pause, Resume, Details */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Pause}
                    onClick={() => pauseRobot(r.id)}
                  >
                    Pause
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    icon={Play}
                    onClick={() => resumeRobot(r.id)}
                  >
                    Resume
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    icon={Info}
                    onClick={() => setInspectRobot(r)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Table
          columns={columns}
          data={robots}
          searchPlaceholder="Search AGV ID, name, status or task..."
          filterOptions={['active', 'waiting', 'idle', 'charging', 'error']}
          pageSize={10}
        />
      )}

      {/* Details Inspector Modal */}
      {inspectRobot && (
        <Modal
          isOpen={Boolean(inspectRobot)}
          onClose={() => setInspectRobot(null)}
          title={`AGV Details Inspector: ${inspectRobot.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="font-bold text-sm text-textLight">{inspectRobot.name}</h3>
                <p className="text-[10px] text-textMuted font-mono">Model: {inspectRobot.model}</p>
              </div>
              <StatusBadge status={inspectRobot.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <div>
                <p className="text-[10px] text-textMuted">Priority Level</p>
                <p className="font-mono font-semibold text-primaryCyan">{inspectRobot.priority || 'Normal'}</p>
              </div>
              <div>
                <p className="text-[10px] text-textMuted">Battery Charge</p>
                <p className="font-mono font-semibold text-emerald-400">{inspectRobot.battery}%</p>
              </div>
              <div>
                <p className="text-[10px] text-textMuted">Speed Velocity</p>
                <p className="font-mono text-textLight">{inspectRobot.speed} m/s</p>
              </div>
              <div>
                <p className="text-[10px] text-textMuted">Remaining Dist / ETA</p>
                <p className="font-mono text-warningAmber">{inspectRobot.remainingDistance || '0 m'} ({inspectRobot.eta || '0s'})</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-textMuted">Current Assigned Task</p>
                <p className="font-semibold text-textLight">{inspectRobot.currentTask}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-textMuted">Position Trajectory</p>
                <p className="font-mono text-primaryCyan">
                  Current: ({inspectRobot.pos.x}, {inspectRobot.pos.y}) ➔ Target: {inspectRobot.target ? `(${inspectRobot.target.x}, ${inspectRobot.target.y})` : 'None'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
              <Button variant="outline" icon={Navigation} onClick={() => handleSelectRobot(inspectRobot.id)}>
                Track on Map
              </Button>
              <Button variant="ghost" onClick={() => setInspectRobot(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};
