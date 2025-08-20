import React from 'react';
import { FileText, Search, LogOut, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function Navigation() {
  const { currentUser, currentView, setCurrentUser, setCurrentView } = useAppContext();

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">
              Workflow Tracker
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('public')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                currentView === 'public'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Search className="h-4 w-4 mr-1" />
              Tracking
            </button>

            {currentUser && (
              <>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span className="font-medium">{currentUser.name}</span>
                  <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}