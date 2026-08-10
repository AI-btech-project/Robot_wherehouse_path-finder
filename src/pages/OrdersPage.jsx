import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { Table } from '../components/common/Table';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ShoppingBag, Plus, RefreshCw, Bot, MapPin } from 'lucide-react';

export const OrdersPage = () => {
  const { orders, robots, generateRandomOrders, logActivity } = useWarehouse();
  const [ordersList, setOrdersList] = useState(orders);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Order Form state
  const [newOrder, setNewOrder] = useState({
    pickup: 'Shelf A-1 (2,3)',
    drop: 'Delivery Bay 1 (17,18)',
    priority: 'High',
    assignedRobot: 'R-01'
  });

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const created = {
      id: `ORD-#${100 + ordersList.length + 1}`,
      pickup: newOrder.pickup,
      drop: newOrder.drop,
      priority: newOrder.priority,
      assignedRobot: newOrder.assignedRobot,
      distance: '64 m',
      estTime: '42 s',
      status: 'Pending',
      createdAt: new Date().toLocaleTimeString()
    };
    setOrdersList([created, ...ordersList]);
    logActivity(`Created new ${created.priority} priority order ${created.id}`, 'order', created.assignedRobot);
    setIsCreateModalOpen(false);
  };

  const columns = [
    {
      header: 'Order ID',
      key: 'id',
      render: (o) => (
        <span className="font-mono font-bold text-primaryCyan flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-primaryCyan" />
          {o.id}
        </span>
      )
    },
    {
      header: 'Pickup Station',
      key: 'pickup',
      render: (o) => <span className="text-xs text-textLight">{o.pickup}</span>
    },
    {
      header: 'Drop Zone',
      key: 'drop',
      render: (o) => <span className="text-xs text-textMuted">{o.drop}</span>
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (o) => <StatusBadge status={o.priority} />
    },
    {
      header: 'Assigned AGV',
      key: 'assignedRobot',
      render: (o) => (
        <span className="font-mono text-xs text-textLight flex items-center gap-1">
          <Bot className="w-3.5 h-3.5 text-primaryCyan" /> {o.assignedRobot}
        </span>
      )
    },
    {
      header: 'Distance / Est',
      key: 'distance',
      render: (o) => <span className="font-mono text-xs text-textDark">{o.distance} ({o.estTime})</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (o) => <StatusBadge status={o.status} />
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cardDark border border-cardBorder rounded-2xl p-6 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-textLight flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primaryCyan" />
            <span>Warehouse Orders Management</span>
          </h1>
          <p className="text-xs text-textMuted mt-1">
            100 Synthetic Orders Dataset • Search, Filter & Sort Fulfillment Pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" icon={RefreshCw} onClick={generateRandomOrders}>
            Regenerate 100 Orders
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
            Create New Order
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        data={ordersList}
        searchPlaceholder="Search order ID, pickup node, drop zone, or robot..."
        filterOptions={['Pending', 'Picking', 'In-Transit', 'Delivered']}
        filterKey="status"
        pageSize={12}
      />

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Dispatch New Synthetic Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-textMuted mb-1">Pickup Location:</label>
            <input
              type="text"
              required
              value={newOrder.pickup}
              onChange={(e) => setNewOrder({ ...newOrder, pickup: e.target.value })}
              className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2 text-textLight"
            />
          </div>

          <div>
            <label className="block font-semibold text-textMuted mb-1">Drop Location:</label>
            <input
              type="text"
              required
              value={newOrder.drop}
              onChange={(e) => setNewOrder({ ...newOrder, drop: e.target.value })}
              className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2 text-textLight"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-textMuted mb-1">Priority:</label>
              <select
                value={newOrder.priority}
                onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
                className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2 text-textLight"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-textMuted mb-1">Assigned AGV:</label>
              <select
                value={newOrder.assignedRobot}
                onChange={(e) => setNewOrder({ ...newOrder, assignedRobot: e.target.value })}
                className="w-full bg-slate-900 border border-cardBorder rounded-xl px-3 py-2 text-textLight font-mono"
              >
                {robots.map(r => (
                  <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-cardBorder">
            <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Dispatch Order</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
