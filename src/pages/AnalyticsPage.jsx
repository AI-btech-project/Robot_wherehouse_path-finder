import React from 'react';
import { Card } from '../components/common/Card';
import { useWarehouse } from '../context/WarehouseContext';
import {
  BarChart3,
  TrendingUp,
  Battery,
  ShieldCheck,
  RefreshCw,
  BatteryCharging,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Activity,
  Flame
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AnalyticsPage = () => {
  const { collisionCount } = useWarehouse();

  // 1. Robot Utilization Chart Data (%)
  const robotUtilizationData = [
    { time: '08:00', utilization: 65 },
    { time: '09:00', utilization: 78 },
    { time: '10:00', utilization: 88 },
    { time: '11:00', utilization: 92 },
    { time: '12:00', utilization: 74 },
    { time: '13:00', utilization: 85 },
    { time: '14:00', utilization: 94 }
  ];

  // 2. Battery Usage Chart Data (%)
  const batteryUsageData = [
    { hour: '08:00', charge: 98 },
    { hour: '09:00', charge: 88 },
    { hour: '10:00', charge: 76 },
    { hour: '11:00', charge: 65 },
    { hour: '12:00', charge: 79 },
    { hour: '13:00', charge: 70 },
    { hour: '14:00', charge: 84 }
  ];

  // 3. Task Completion Rate Data
  const taskCompletionData = [
    { time: '08:00', tasks: 14 },
    { time: '09:00', tasks: 22 },
    { time: '10:00', tasks: 31 },
    { time: '11:00', tasks: 45 },
    { time: '12:00', tasks: 38 },
    { time: '13:00', tasks: 52 },
    { time: '14:00', tasks: 64 }
  ];

  // 4. Compact 10x10 Traffic Density Grid Heatmap Data
  const trafficHeatmapData = Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 10 }, (_, col) => {
      // Create high-density corridor along main aisle (row 4 & col 5)
      const isCorridor = row === 4 || col === 5 || (row === 2 && col === 8);
      const intensity = isCorridor ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 35) + 5;
      return intensity;
    })
  );

  // Notification Panel Events (Newest Notifications First)
  const notifications = [
    {
      id: 1,
      type: 'replan',
      title: 'Robot R3 replanned',
      desc: 'Rerouted trajectory to avoid space-time conflict at cell (8,12)',
      time: 'Just now',
      icon: RefreshCw,
      color: 'text-purple-400 bg-purple-950/40 border-purple-500/30'
    },
    {
      id: 2,
      type: 'charging',
      title: 'Robot R5 charging',
      desc: 'Docked at Charger #2 (Battery 18%)',
      time: '2m ago',
      icon: BatteryCharging,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
    },
    {
      id: 3,
      type: 'collision',
      title: 'Collision avoided',
      desc: 'MAPF Reservation Table resolved right-of-way between R1 & R4',
      time: '5m ago',
      icon: ShieldCheck,
      color: 'text-primaryCyan bg-primaryCyan/10 border-primaryCyan/30'
    },
    {
      id: 4,
      type: 'battery',
      title: 'Battery low',
      desc: 'Robot R8 battery low (14%) - auto rerouting to station',
      time: '12m ago',
      icon: AlertTriangle,
      color: 'text-warningAmber bg-warningAmber/15 border-warningAmber/30'
    },
    {
      id: 5,
      type: 'completed',
      title: 'Task completed',
      desc: 'Task TSK-304 fulfilled by Robot R2 in 3.8 minutes',
      time: '18m ago',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark border border-white/5 rounded-2xl p-6 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-textLight flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primaryCyan" />
            <span>Fleet Analytics & System Notifications</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Realtime Telemetry Charts & Event Activity Stream
          </p>
        </div>
      </div>

      {/* MAIN ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT 2 COLUMNS: 4 Small Clean Charts */}
        <div className="lg:col-span-2 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Robot Utilization */}
            <Card title="Robot Utilization" subtitle="Hourly Active Fleet Utilization (%)" icon={Activity}>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={robotUtilizationData}>
                    <defs>
                      <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD84D" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#FFD84D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis dataKey="time" stroke="#8B8B8B" fontSize={10} />
                    <YAxis stroke="#8B8B8B" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#151515', borderColor: '#333', color: '#FFF', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="utilization" name="Utilization %" stroke="#FFD84D" strokeWidth={2} fillOpacity={1} fill="url(#colorUtil)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 2. Battery Usage */}
            <Card title="Battery Usage" subtitle="Fleet Average Battery Level (%)" icon={Battery}>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={batteryUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis dataKey="hour" stroke="#8B8B8B" fontSize={10} />
                    <YAxis stroke="#8B8B8B" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#151515', borderColor: '#333', color: '#FFF', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="charge" name="Battery %" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4, fill: '#22C55E' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 3. Task Completion Rate */}
            <Card title="Task Completion Rate" subtitle="Hourly Fulfilled Tasks Count" icon={TrendingUp}>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis dataKey="time" stroke="#8B8B8B" fontSize={10} />
                    <YAxis stroke="#8B8B8B" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#151515', borderColor: '#333', color: '#FFF', borderRadius: '8px' }} />
                    <Bar dataKey="tasks" name="Tasks" fill="#FFD84D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* 4. Warehouse Traffic Heatmap */}
            <Card title="Warehouse Traffic Heatmap" subtitle="Aisle Density & Frequency Matrix" icon={Flame}>
              <div className="h-44 flex flex-col justify-center items-center">
                <div className="grid grid-cols-10 gap-1 p-2 bg-[#0E0E0E] rounded-xl border border-white/5">
                  {trafficHeatmapData.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const heatBg =
                        val > 75 ? 'bg-red-500/80' :
                        val > 50 ? 'bg-amber-500/70' :
                        val > 25 ? 'bg-emerald-500/50' : 'bg-white/5';
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          title={`Aisle Cell (${rIdx},${cIdx}): Density ${val}%`}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm ${heatBg} transition-colors`}
                        />
                      );
                    })
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-textMuted mt-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-white/5" /> Low</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500/50" /> Moderate</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500/70" /> High</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500/80" /> Dense</span>
                </div>
              </div>
            </Card>
          </div>

        </div>

        {/* RIGHT COLUMN: Minimal Notification Panel (Newest First) */}
        <div>
          <Card
            title="Notification Panel"
            subtitle="Recent Events & System Alerts"
            icon={Bell}
            action={<span className="text-[10px] font-mono text-primaryCyan font-semibold">5 Recent</span>}
          >
            <div className="space-y-3">
              {notifications.map((notif) => {
                const IconComponent = notif.icon;
                return (
                  <div
                    key={notif.id}
                    className="p-3 rounded-2xl bg-[#0E0E0E] border border-white/5 hover:border-white/10 transition-colors flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-xl border ${notif.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-xs text-textLight">{notif.title}</p>
                        <span className="text-[10px] font-mono text-textMuted">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-textMuted leading-snug">{notif.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

