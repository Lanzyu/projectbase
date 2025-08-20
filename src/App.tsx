import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { TUDashboard } from './components/dashboards/TUDashboard';
import { CoordinatorDashboard } from './components/dashboards/CoordinatorDashboard';
import { StaffDashboard } from './components/dashboards/StaffDashboard';
import { PublicTracking } from './components/PublicTracking';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navigation } from './components/Navigation';

function AppContent() {
  const { currentUser, currentView } = useAppContext();

  const renderContent = () => {
    if (!currentUser && currentView !== 'public') {
      return <LoginPage />;
    }

    switch (currentView) {
      case 'tu':
        return <TUDashboard />;
      case 'coordinator':
        return <CoordinatorDashboard />;
      case 'staff':
        return <StaffDashboard />;
      case 'public':
        return <PublicTracking />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;