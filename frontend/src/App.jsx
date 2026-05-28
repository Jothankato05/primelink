import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import OnboardingTour from './components/OnboardingTour';
import { communities, initialAlerts } from './data/mockData';

export default function App() {
  const [phase,             setPhase]             = useState('login');   // 'login' | 'tour' | 'app'
  const [selectedCommunity, setSelectedCommunity] = useState(communities[0]);

  if (phase === 'login') {
    return <LoginScreen onEnter={() => setPhase('tour')} />;
  }

  const handleBack = () => {
    setPhase('login');
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="pl-texture-geo opacity-50"></div>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pl-app-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pl-app-grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <Navbar
          selectedCommunity={selectedCommunity}
          onSelectCommunity={setSelectedCommunity}
          alertCount={initialAlerts.filter(a => a.type === 'amber' || a.type === 'red').length}
          onBack={handleBack}
        />
        <Dashboard
          key={selectedCommunity.id}
        selectedCommunity={selectedCommunity}
        setSelectedCommunity={setSelectedCommunity}
      />
      {phase === 'tour' && (
        <OnboardingTour onComplete={() => setPhase('app')} />
      )}
      </div>
    </div>
  );
}
