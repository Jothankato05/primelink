import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import { initialAlerts } from './data/mockData';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginScreen onEnter={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle grid texture */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="pl-app-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pl-app-grid)" />
      </svg>

      <div className="relative z-10 flex flex-col" style={{ height: '100vh' }}>
        <Navbar
          alertCount={initialAlerts.filter(a => a.type === 'amber' || a.type === 'red').length}
          onBack={() => setLoggedIn(false)}
        />
        <div className="flex-1 overflow-hidden">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
