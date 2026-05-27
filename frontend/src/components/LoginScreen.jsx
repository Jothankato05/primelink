import { useState, useEffect } from 'react';
import { Shield, ArrowRight, Radio, Activity, Globe } from 'lucide-react';

const STATS = [
  { value: '8', label: 'Communities', icon: Globe, color: '#00C896' },
  { value: '127', label: 'IoT Sensors', icon: Radio, color: '#3B82F6' },
  { value: '5', label: 'Sectors Covered', icon: Activity, color: '#8B5CF6' },
];

const SECTORS = ['Health', 'Agriculture', 'Environment', 'Finance', 'IoT'];

export default function LoginScreen({ onEnter }) {
  const [activeSector, setActiveSector] = useState(0);
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveSector(i => (i + 1) % SECTORS.length), 1800);
    return () => clearInterval(t);
  }, []);

  const handleEnter = () => {
    setEntering(true);
    setTimeout(onEnter, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} ${entering ? 'opacity-0 scale-95' : ''}`}
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, #0D2137 0%, #040C18 50%, #050E1A 100%)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, #00C896, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-6 blur-3xl animate-pulse-slow"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', animationDelay: '3s' }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C896" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Pulsing dots — simulated sensor network */}
      {[
        { top: '18%', left: '22%' }, { top: '32%', left: '72%' },
        { top: '65%', left: '15%' }, { top: '75%', left: '68%' },
        { top: '45%', left: '88%' }, { top: '82%', left: '42%' },
        { top: '12%', left: '55%' }, { top: '55%', left: '38%' },
      ].map((pos, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#00C896] animate-ping"
          style={{ ...pos, animationDelay: `${i * 0.4}s`, animationDuration: '2.5s', opacity: 0.4 }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #00C896 0%, #3B82F6 100%)',
              boxShadow: '0 0 60px rgba(0,200,150,0.4), 0 0 120px rgba(0,200,150,0.15)',
            }}
          >
            <Shield size={38} className="text-white" strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="text-6xl font-black tracking-tight leading-none">
              <span className="text-white">Prime</span>
              <span style={{ color: '#00C896' }}>Link</span>
            </h1>
            <p className="text-[#475569] text-sm font-medium tracking-widest uppercase mt-2">
              Community Risk Intelligence Network
            </p>
          </div>
        </div>

        {/* Animated sector cycling */}
        <div className="mb-8 h-8 flex items-center gap-2">
          <span className="text-[#475569] text-sm">Monitoring:</span>
          <span
            key={activeSector}
            className="text-sm font-bold animate-fade-in px-3 py-1 rounded-full border"
            style={{ color: '#00C896', borderColor: '#00C896', background: 'rgba(0,200,150,0.1)' }}
          >
            {SECTORS[activeSector]}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#94A3B8] text-base leading-relaxed mb-10 max-w-lg">
          Real-time intelligence across health, agriculture, environment, finance and IoT —
          protecting Nigerian communities before crises escalate.
        </p>

        {/* Stats row */}
        <div className="flex gap-6 mb-12">
          {STATS.map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-2xl font-black text-white">{value}</span>
              <span className="text-xs text-[#475569] font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #00C896 0%, #059669 100%)',
            boxShadow: '0 0 40px rgba(0,200,150,0.35)',
          }}
        >
          Enter Dashboard
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>

        <p className="mt-6 text-[#334155] text-xs font-medium tracking-wide">
          PRIMERS CORPORATION · NIGERIA · 2026
        </p>
      </div>

      {/* Live indicator bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1628]/80 border border-[#1A2E4A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
        <span className="text-[11px] text-[#00C896] font-medium">SYSTEM ONLINE</span>
        <span className="text-[11px] text-[#475569]">· 127 sensors reporting · 0 critical alerts</span>
      </div>
    </div>
  );
}
