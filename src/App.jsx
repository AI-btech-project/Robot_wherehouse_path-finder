import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarehouseProvider } from './context/WarehouseContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WarehouseMapPage } from './pages/WarehouseMapPage';
import { RobotsPage } from './pages/RobotsPage';
import { TaskSchedulerPage } from './pages/TaskSchedulerPage';
import { OrdersPage } from './pages/OrdersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SimulationPage } from './pages/SimulationPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bgDark text-textLight font-sans">
      {/* Permanent Left Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setIsMobileOpen(true)} />

        {/* Dynamic Page View Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WarehouseProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected App Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <DashboardPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedLayout>
                <WarehouseMapPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/robots"
            element={
              <ProtectedLayout>
                <RobotsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedLayout>
                <TaskSchedulerPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedLayout>
                <OrdersPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedLayout>
                <AnalyticsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/simulation"
            element={
              <ProtectedLayout>
                <SimulationPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <SettingsPage />
              </ProtectedLayout>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </WarehouseProvider>
    </AuthProvider>
  );
}
