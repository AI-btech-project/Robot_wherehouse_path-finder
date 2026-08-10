import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  ListTodo,
  MapPin,
  BarChart3,
  PlaySquare,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Robots', path: '/robots', icon: Bot },
  { name: 'Tasks', path: '/tasks', icon: ListTodo },
  { name: 'Warehouse Map', path: '/map', icon: MapPin },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Simulation', path: '/simulation', icon: PlaySquare, highlight: true }
];

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-sidebarDark border-r border-white/5 transition-all duration-300 flex flex-col justify-between
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Section: Logo & Nav Links */}
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-white/5 text-primaryCyan border border-white/5 flex-shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="font-bold text-sm text-textLight leading-snug tracking-tight">
                    AGV PATH PLANNER
                  </h1>
                  <p className="text-[10px] font-mono text-primaryCyan font-medium">
                    ROBOTICS MAPF
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-textDark hover:text-textLight hover:bg-white/5 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                    ${isActive
                      ? 'bg-primaryCyan text-bgDark font-semibold shadow-subtle'
                      : item.highlight
                      ? 'text-primaryCyan bg-primaryCyan/10 border border-primaryCyan/20 hover:bg-primaryCyan/20'
                      : 'text-textMuted hover:text-textLight hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}

                  {item.highlight && !collapsed && (
                    <span className="ml-auto px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-primaryCyan/20 text-primaryCyan">
                      MAIN
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};



