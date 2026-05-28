import { useState, useEffect } from 'react';
import { Hexagon, Network, ArrowRight, Radio, Globe, BarChart2 } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{
        opacity:    visible && !leaving ? 1 : 0,
        transform:  leaving ? 'scale(0.98)' : 'scale(1)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* Geometric Texture Background */}
      <div className="pl-texture-geo z-0"></div>

      {/* Structural grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.025 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="pl-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pl-grid)" />
      </svg>



      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-xl">

        {/* Mark */}
        <div className="mb-8 flex flex-col items-center gap-5">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Ambient glow instead of a solid box */}
            <div className="absolute inset-0 bg-[#00C896] blur-xl opacity-20 rounded-full"></div>
            {/* Geometric outer shell */}
            <Hexagon size={56} className="text-[#00C896] absolute z-10" strokeWidth={1} />
            {/* Inner nodes */}
            <Network size={24} className="text-white relative z-20" strokeWidth={1.5} />
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
          finance and IoT enabling proactive intervention before community crises escalate.
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

        <p className="mt-7 text-neutral-600 text-[10px] font-medium tracking-widest uppercase">
          Primers Corporation Nigeria 2026
        </p>
      </div>

      {/* Status footer */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full"
        style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #333' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
        <span className="text-[10px] text-[#00C896] font-semibold tracking-wide">SYSTEM ONLINE</span>
        <span className="text-[10px] text-neutral-400">127 sensors active 8 communities monitored</span>
      </div>
    </div>
  );
}
