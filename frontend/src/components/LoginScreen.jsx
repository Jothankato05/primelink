import { useState, useEffect } from 'react';
import { Activity, ArrowRight, Radio, Globe, BarChart2 } from 'lucide-react';

const PLATFORM_STATS = [
  { value: '8',   label: 'Communities',   Icon: Globe    },
  { value: '127', label: 'IoT Sensors',   Icon: Radio    },
  { value: '5',   label: 'Risk Sectors',  Icon: BarChart2 },
];

const SECTOR_LABELS = ['Health', 'Agriculture', 'Environment', 'Finance', 'IoT'];

export default function LoginScreen({ onEnter }) {
  const [activeSector, setActiveSector] = useState(0);
  const [visible,      setVisible]      = useState(false);
  const [leaving,      setLeaving]      = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveSector(i => (i + 1) % SECTOR_LABELS.length), 1800);
    return () => clearInterval(t);
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#040C18',
        opacity:    visible && !leaving ? 1 : 0,
        transform:  leaving ? 'scale(0.98)' : 'scale(1)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Structural grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.025 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="pl-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pl-grid)" />
      </svg>

      {/* Ambient glow — left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '-10%',
          width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(0,200,150,0.07) 0%, transparent 70%)',
        }}
      />
      {/* Ambient glow — right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', right: '-10%',
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-xl">

        {/* Mark */}
        <div className="mb-8 flex flex-col items-center gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00C896 0%, #0EA5E9 100%)',
              boxShadow:  '0 0 48px rgba(0,200,150,0.25)',
            }}
          >
            <Activity size={30} className="text-white" strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-white">
              Prime<span style={{ color: '#00C896' }}>Link</span>
            </h1>
            <p className="text-[#475569] text-xs sm:text-sm font-medium tracking-widest uppercase mt-3">
              Community Risk Intelligence Network
            </p>
          </div>
        </div>

        {/* Sector cycle */}
        <div className="mb-7 flex items-center gap-2 h-7">
          <span className="text-xs text-[#334155] font-medium uppercase tracking-wide">Monitoring</span>
          <span
            key={activeSector}
            className="text-xs font-semibold animate-fade-in px-2.5 py-1 rounded border"
            style={{
              color:       '#00C896',
              borderColor: 'rgba(0,200,150,0.25)',
              background:  'rgba(0,200,150,0.06)',
            }}
          >
            {SECTOR_LABELS[activeSector]}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#64748B] text-sm leading-relaxed mb-10 max-w-md">
          Real-time cross-sector intelligence across health, agriculture, environment,
          finance and IoT — enabling proactive intervention before community crises escalate.
        </p>

        {/* Platform stats */}
        <div className="flex items-center gap-8 sm:gap-10 mb-10">
          {PLATFORM_STATS.map(({ value, label, Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.15)' }}
              >
                <Icon size={16} style={{ color: '#00C896' }} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-black text-white leading-none">{value}</span>
              <span className="text-[10px] text-[#475569] font-medium uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="group flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{
            background: '#00C896',
            boxShadow:  '0 0 28px rgba(0,200,150,0.25)',
          }}
        >
          Open Dashboard
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>

        <p className="mt-7 text-[#1E3A5F] text-[10px] font-medium tracking-widest uppercase">
          Primers Corporation — Nigeria — 2026
        </p>
      </div>

      {/* Status footer */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full"
        style={{ background: 'rgba(11,22,40,0.8)', border: '1px solid #1A2E4A' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
        <span className="text-[10px] text-[#00C896] font-semibold tracking-wide">SYSTEM ONLINE</span>
        <span className="text-[10px] text-[#334155]">127 sensors active — 8 communities monitored</span>
      </div>
    </div>
  );
}
