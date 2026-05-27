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

  return (
    <div className="min-h-screen bg-[#040C18]">
      <Navbar
        selectedCommunity={selectedCommunity}
        onSelectCommunity={setSelectedCommunity}
        alertCount={initialAlerts.filter(a => a.type === 'amber' || a.type === 'red').length}
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
  );
}
