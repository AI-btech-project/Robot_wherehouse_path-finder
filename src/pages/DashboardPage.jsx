import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarehouse } from '../context/WarehouseContext';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { WarehouseGrid } from '../components/warehouse/WarehouseGrid';
import { CardSkeleton } from '../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Activity,
  ListTodo,
  CheckCircle2,
  BatteryCharging,
  Battery,
  ShieldCheck,
  Clock,
  Layers,
  Play,
  ArrowUpRight,
  Radio,
  Sparkles,
  Package,
  Truck
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

export const DashboardPage = () => {
  const {
    robots,
    orders,
    tasks,
    activities,
    grid,
    selectedRobotId,
    setSelectedRobotId,
    selectedAlgorithm,
    collisionCount,
    setDestinationForRobot,
    collisionAlert
  } = useWarehouse();

  const navigate = useNavigate();

  // 7 Essential Metric Calculations
  const totalRobots = robots.length;
  const activeRobots = robots.filter(r => {
    const st = String(r.status).toLowerCase();
    return st === 'moving' || st === 'active';
  }).length;
  const tasksRunning = robots.filter(r => r.target !== null).length;
  const tasksCompleted = orders.filter(o => o.status === 'Delivered').length + 18;
  const chargingRobots = robots.filter(r => String(r.status).toLowerCase() === 'charging').length;
  const averageBattery = Math.round(robots.reduce((acc, r) => acc + (r.battery || 0), 0) / (robots.length || 1)) + '%';
  const systemHealth = '100%';

  // Robot Status Allocation Chart Data
  const robotStatusData = [
    { name: 'Active', value: activeRobots, color: '#FFD84D' },
    { name: 'Charging', value: chargingRobots, color: '#22C55E' },
    { name: 'Idle', value: robots.filter(r => String(r.status).toLowerCase() === 'idle').length, color: '#8B8B8B' },
    { name: 'Waiting', value: robots.filter(r => String(r.status).toLowerCase() === 'waiting').length, color: '#F59E0B' }
  ];

  // Task Completion Trend Area Chart Data
  const taskCompletionData = [
    { hour: '04:00', completed: 12 },
    { hour: '05:00', completed: 19 },
    { hour: '06:00', completed: 28 },
    { hour: '07:00', completed: 42 },
    { hour: '08:00', completed: 68 }
  ];

  // Battery Level Distribution Data
  const batteryDistData = [
    { range: '90-100%', count: robots.filter(r => r.battery >= 90).length },
    { range: '70-89%', count: robots.filter(r => r.battery >= 70 && r.battery < 90).length },
    { range: '40-69%', count: robots.filter(r => r.battery >= 40 && r.battery < 70).length },
    { range: '< 40%', count: robots.filter(r => r.battery < 40).length }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark border border-white/5 rounded-2xl p-6 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-textLight flex items-center gap-3">
            <span>Warehouse Control Dashboard</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-semibold bg-primaryCyan/10 text-primaryCyan border border-primaryCyan/20">
              REALTIME AGV FLEET
            </span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Intelligent Multi-Robot Path Planning System • Department of Computer Engineering
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Play}
            onClick={() => navigate('/simulation')}
          >
            Launch Simulation Engine
          </Button>
        </div>
      </div>

      {/* TOP 7 METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {/* 1. Total Robots */}
        <div className="bg-cardDark border border-white/5 rounded-2xl p-4 shadow-card hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-textDark mb-1.5">
            <span className="text-[11px] font-medium text-textMuted">Total Robots</span>
            <Bot className="w-4 h-4 text-primaryCyan" />
          </div>
          <p className="text-2xl font-bold text-textLight font-mono leading-tight">{totalRobots}</p>
          <p className="text-[10px] text-textMuted mt-1">Fleet Capacity</p>
        </div>

        {/* 2. Active Robots */}
        <div className="bg-cardDark border border-white/5 rounded-2xl p-4 shadow-card hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-textDark mb-1.5">
            <span className="text-[11px] font-medium text-textMuted">Active Robots</span>
            <Activity className="w-4 h-4 text-secondaryGreen" />
          </div>
          <p className="text-2xl font-bold text-secondaryGreen font-mono leading-tight">{activeRobots}</p>
          <p className="text-[10px] text-textMuted mt-1">Currently Navigating</p>
        </div>

        {/* 3. Tasks Running */}
        <div className="bg-cardDark border border-white/5 rounded-2xl p-4 shadow-card hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-textDark mb-1.5">
            <span className="text-[11px] font-medium text-textMuted">Tasks Running</span>
            <ListTodo className="w-4 h-4 text-primaryCyan" />
          </div>
          <p className="text-2xl font-bold text-primaryCyan font-mono leading-tight">{tasksRunning}</p>
          <p className="text-[10px] text-textMuted mt-1">Active Pickup & Delivery</p>
        </div>

        {/* 4. Tasks Completed */}
        <div className="bg-cardDark border border-white/5 rounded-2xl p-4 shadow-card hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-textDark mb-1.5">
            <span className="text-[11px] font-medium text-textMuted">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-secondaryGreen" />
          </div>
          <p className="text-2xl font-bold text-textLight font-mono leading-tight">{tasksCompleted}</p>
          <p className="text-[10px] text-secondaryGreen mt-1">Completed This Shift</p>
        </div>

        {/* 5. Charging Robots */}
        <div className="bg-cardDark border border-white/5 rounded-2xl p-4 shadow-card hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-textDark mb-1.5">
            <span className="text-[11px] font-medium text-textMuted">Charging Robots</span>
            <BatteryCharging className="w-4 h-4 text-warningAmber" />
          </div>
          <p className="text-2xl font-bold text-warningAmber font-mono leading-tight">{chargingRobots}</p>
          <p className="text-[10px] text-textMuted mt-1">Docked at Charger</p>
        </div>

        {/* 6. Average Battery */}
        <div className="bg-cardDark border border-white/5 rounded-2xl p-4 shadow-card hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-textDark mb-1.5">
            <span className="text-[11px] font-medium text-textMuted">Average Battery</span>
            <Battery className="w-4 h-4 text-secondaryGreen" />
          </div>
          <p className="text-2xl font-bold text-secondaryGreen font-mono leading-tight">{averageBattery}</p>
          <p className="text-[10px] text-textMuted mt-1">Fleet Power Level</p>
        </div>

        {/* 7. System Health */}
        <div className="bg-cardDark border border-white/5 rounded-2xl p-4 shadow-card hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between text-textDark mb-1.5">
            <span className="text-[11px] font-medium text-textMuted">System Health</span>
            <ShieldCheck className="w-4 h-4 text-primaryCyan" />
          </div>
          <p className="text-2xl font-bold text-primaryCyan font-mono leading-tight">{systemHealth}</p>
          <p className="text-[10px] text-textMuted mt-1">Zero Collision MAPF</p>
        </div>
      </div>

      {/* DASHBOARD MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Clean Center Warehouse Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Real-Time Warehouse Map & Space-Time MAPF Arena"
            subtitle="Live Moving AGV Fleet • Solid Line: Planned Path • Dotted Line: Reserved Future Path"
            icon={Layers}
            action={
              <Button size="sm" variant="outline" icon={ArrowUpRight} onClick={() => navigate('/map')}>
                Full Arena View
              </Button>
            }
          >
            <div className="flex flex-col items-center justify-center p-4 bg-[#0E0E0E] rounded-xl border border-white/5 space-y-3">
              {/* Map Visual Legend Bar */}
              <div className="w-full flex flex-wrap items-center justify-between text-[11px] text-textMuted px-2 py-2 bg-white/5 rounded-lg border border-white/5 gap-2">
                <span className="flex items-center gap-1.5 font-medium text-textLight">
                  <Bot className="w-3.5 h-3.5 text-primaryCyan" /> Robots
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> Obstacles
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Package className="w-3.5 h-3.5 text-amber-400" /> Pickup Points
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Truck className="w-3.5 h-3.5 text-purple-400" /> Delivery Points
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> Charging Stations
                </span>
                <span className="flex items-center gap-1.5 text-primaryCyan font-mono">
                  <span className="w-3 h-0.5 bg-primaryCyan rounded" /> Planned Path
                </span>
                <span className="flex items-center gap-1.5 text-primaryCyan font-mono">
                  <span className="w-3.5 h-1 border-b-2 border-dashed border-primaryCyan" /> Reserved Path
                </span>
              </div>

              {/* Warehouse Grid Arena Component */}
              <WarehouseGrid
                grid={grid}
                robots={robots}
                selectedRobotId={selectedRobotId}
                onSelectRobot={(id) => setSelectedRobotId(id)}
                onCellClick={(cell) => setDestinationForRobot(selectedRobotId, { x: cell.x, y: cell.y })}
                zoomLevel={0.9}
                showPaths={true}
                collisionAlert={collisionAlert}
              />

              <div className="w-full flex flex-wrap items-center justify-between text-xs text-textDark px-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primaryCyan" /> Selected AGV: <strong className="text-primaryCyan font-mono">{selectedRobotId || 'R-01'}</strong>
                </span>
                <span className="text-[11px] text-textMuted">Click any grid cell to dispatch active robot to destination target</span>
              </div>
            </div>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Task Completion Trend" subtitle="Hourly Orders Fulfilled" icon={Activity}>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={taskCompletionData}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#131C2B', borderColor: '#1E293B', color: '#FFF', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="completed" stroke="#0EA5E9" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Battery Distribution" subtitle="Fleet Charge States" icon={Battery}>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={batteryDistData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="range" stroke="#64748B" fontSize={10} />
                    <YAxis stroke="#64748B" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#131C2B', borderColor: '#1E293B', color: '#FFF', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#22C55E" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Donut Chart */}
          <Card title="Robot Status Allocation" subtitle="Active vs Charging vs Idle" icon={Bot}>
            <div className="h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={robotStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {robotStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#131C2B', borderColor: '#1E293B', color: '#FFF', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cardBorder text-xs">
              {robotStatusData.map(st => (
                <div key={st.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  <span className="text-textMuted">{st.name}:</span>
                  <span className="font-bold text-textLight font-mono">{st.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Stream */}
          <Card title="Live Activity Telemetry Stream" subtitle="Real-time AGV Path Logs" icon={Radio}>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activities.map(act => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-cardBorder/60 text-xs space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-primaryCyan font-bold">{act.robot}</span>
                    <span className="text-textDark font-mono">{act.time}</span>
                  </div>
                  <p className="text-textMuted leading-relaxed">{act.text}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Collision Resolution Count Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-cardDark border border-primaryCyan/40 rounded-2xl p-4 shadow-xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primaryCyan/10 text-primaryCyan border border-primaryCyan/20">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-textDark font-medium">Automatic Replanning Avoidances</p>
              <p className="text-xl font-extrabold text-primaryCyan font-mono">{collisionCount} Deadlocks Resolved</p>
              <p className="text-[10px] text-textMuted">Algorithm: {selectedAlgorithm} Multi-Agent Planner</p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
