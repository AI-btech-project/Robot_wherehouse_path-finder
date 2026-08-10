import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ListTodo, CheckCircle2, Clock, RefreshCw, XCircle, Bot, Play, Loader2 } from 'lucide-react';

export const TaskSchedulerPage = () => {
  const { orders, robots, logActivity } = useWarehouse();
  const [tasks, setTasks] = useState(() => {
    return orders.slice(0, 18).map((o, idx) => ({
      taskId: `TSK-${300 + idx}`,
      orderId: o.id,
      priority: o.priority,
      assignedRobot: o.assignedRobot,
      pickup: o.pickup,
      drop: o.drop,
      estTime: o.estTime,
      distance: o.distance,
      status: idx < 6 ? 'Pending' : idx < 13 ? 'In Progress' : 'Completed'
    }));
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [newRobotId, setNewRobotId] = useState('R-01');

  // Task Actions
  const handleStartTask = (taskId) => {
    setTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: 'In Progress' } : t));
    logActivity(`Task ${taskId} moved to In Progress`, 'task', 'Scheduler');
  };

  const handleComplete = (taskId) => {
    setTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: 'Completed' } : t));
    logActivity(`Task ${taskId} marked as Completed`, 'task', 'Scheduler');
  };

  const handleCancel = (taskId) => {
    setTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: 'Pending' } : t));
    logActivity(`Task ${taskId} reset to Pending`, 'task', 'Scheduler');
  };

  const openReassignModal = (task) => {
    setSelectedTask(task);
    setNewRobotId(task.assignedRobot);
    setIsReassignModalOpen(true);
  };

  const confirmReassign = () => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => t.taskId === selectedTask.taskId ? { ...t, assignedRobot: newRobotId, status: 'In Progress' } : t));
      logActivity(`Task ${selectedTask.taskId} reassigned to ${newRobotId}`, 'replan', newRobotId);
    }
    setIsReassignModalOpen(false);
  };

  // 3 Task Status Categories as Requested
  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const runningTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'Picking' || t.status === 'Delivering');
  const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Delivered');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark border border-white/5 rounded-2xl p-6 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-textLight flex items-center gap-3">
            <ListTodo className="w-5 h-5 text-primaryCyan" />
            <span>Task Management Panel</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            Realtime AGV Task Execution • Pending • Running • Completed Queues
          </p>
        </div>
      </div>

      {/* 3 TASK STATUS COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 1. PENDING TASKS COLUMN */}
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="font-bold text-sm text-textLight flex items-center gap-2">
              <Clock className="w-4 h-4 text-warningAmber" /> Pending Tasks
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-warningAmber/15 text-warningAmber border border-warningAmber/30">
              {pendingTasks.length} Queued
            </span>
          </div>

          <div className="space-y-3">
            {pendingTasks.map(t => (
              <TaskCardItem
                key={t.taskId}
                task={t}
                onStart={() => handleStartTask(t.taskId)}
                onReassign={() => openReassignModal(t)}
              />
            ))}
          </div>
        </div>

        {/* 2. RUNNING TASKS COLUMN */}
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="font-bold text-sm text-textLight flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primaryCyan animate-spin" /> Running Tasks
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-primaryCyan/15 text-primaryCyan border border-primaryCyan/30">
              {runningTasks.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {runningTasks.map(t => (
              <TaskCardItem
                key={t.taskId}
                task={t}
                onComplete={() => handleComplete(t.taskId)}
                onReassign={() => openReassignModal(t)}
              />
            ))}
          </div>
        </div>

        {/* 3. COMPLETED TASKS COLUMN */}
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <span className="font-bold text-sm text-textLight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed Tasks
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {completedTasks.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {completedTasks.map(t => (
              <TaskCardItem
                key={t.taskId}
                task={t}
                onReset={() => handleCancel(t.taskId)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Reassign Robot Modal */}
      <Modal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        title={`Reassign Task: ${selectedTask?.taskId}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-textMuted">
            Select an available AGV from the fleet to assign target execution:
          </p>

          <div>
            <label className="block text-xs font-semibold text-textMuted mb-1">Target Robot:</label>
            <select
              value={newRobotId}
              onChange={(e) => setNewRobotId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-textLight font-mono focus:outline-none"
            >
              {robots.map(r => (
                <option key={r.id} value={r.id} className="bg-cardDark text-textLight">
                  {r.id} - {r.name} ({r.status}, {r.battery}%)
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setIsReassignModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmReassign}>Confirm Reassign</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TaskCardItem = ({ task, onStart, onComplete, onReassign, onReset }) => {
  return (
    <div className="bg-cardDark border border-white/5 rounded-2xl p-4 space-y-3 shadow-card hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <span className="font-mono font-bold text-xs text-textLight">{task.taskId}</span>
        <StatusBadge status={task.status} />
      </div>

      <div className="space-y-1.5 text-xs">
        {/* Assigned Robot */}
        <div className="flex justify-between items-center">
          <span className="text-textMuted">Assigned Robot:</span>
          <span className="font-mono font-semibold text-primaryCyan flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-primaryCyan" /> {task.assignedRobot}
          </span>
        </div>

        {/* Priority */}
        <div className="flex justify-between items-center">
          <span className="text-textMuted">Priority:</span>
          <span className={`font-mono text-[11px] font-semibold ${
            task.priority === 'High' ? 'text-red-400' : task.priority === 'Medium' ? 'text-amber-400' : 'text-primaryCyan'
          }`}>
            {task.priority} Priority
          </span>
        </div>

        {/* ETA */}
        <div className="flex justify-between items-center">
          <span className="text-textMuted">ETA:</span>
          <span className="font-mono text-warningAmber font-semibold">{task.estTime}</span>
        </div>

        {/* Pickup & Drop Points */}
        <div className="flex justify-between items-center text-[11px] pt-1">
          <span className="text-textMuted">Location:</span>
          <span className="text-textLight font-mono truncate max-w-[140px]">{task.pickup} ➔ {task.drop}</span>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        {onStart && (
          <Button size="sm" variant="primary" icon={Play} className="w-full" onClick={onStart}>
            Start
          </Button>
        )}
        {onComplete && (
          <Button size="sm" variant="secondary" icon={CheckCircle2} className="w-full" onClick={onComplete}>
            Complete
          </Button>
        )}
        {onReassign && (
          <Button size="sm" variant="outline" icon={RefreshCw} onClick={onReassign} title="Reassign AGV">
            Reassign
          </Button>
        )}
        {onReset && (
          <Button size="sm" variant="ghost" icon={XCircle} onClick={onReset} className="w-full text-textMuted hover:text-textLight">
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

