import { communities, getScoreColor } from '../data/mockData';

const LAT_MIN = 4, LAT_MAX = 14, LNG_MIN = 3, LNG_MAX = 15;

function toXY(lat, lng) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return { x, y };
}

const COMMUNITY_SCORES = {
  1: { env: 72, agr: 68, hlt: 76, fin: 61, composite: 73 },
  2: { env: 81, agr: 74, hlt: 82, fin: 69, composite: 77 },
  3: { env: 44, agr: 38, hlt: 52, fin: 41, composite: 44 },
  4: { env: 65, agr: 71, hlt: 78, fin: 58, composite: 68 },
  5: { env: 88, agr: 83, hlt: 85, fin: 72, composite: 82 },
  6: { env: 38, agr: 31, hlt: 48, fin: 36, composite: 38 },
  7: { env: 55, agr: 61, hlt: 69, fin: 64, composite: 62 },
  8: { env: 91, agr: 86, hlt: 89, fin: 83, composite: 87 },
};

export default function NigeriaMap({ selectedCommunity, onSelectCommunity }) {
  return (
    <div className="card-glow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white">Community Risk Map — Nigeria</span>
        <div className="flex items-center gap-3 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-none bg-[#00C896]" />Safe</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-none bg-[#F5A623]" />Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-none bg-[#FF3A5C]" />Critical</span>
        </div>
      </div>

      <div className="relative w-full" style={{ paddingBottom: '60%' }}>
        {/* Map background grid */}
        <div className="absolute inset-0 rounded-none overflow-hidden bg-neutral-950 border border-neutral-800">
          {/* Subtle grid */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 0 100 M 0 0 L 100 0" stroke="#333333" strokeWidth="0.5" fill="none" vectorEffect="non-scaling-stroke" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Nigeria outline (simplified) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
            <polygon
              points="8,42 12,52 18,56 28,57 40,55 52,55 60,52 68,50 78,48 88,44 92,36 90,26 84,16 76,10 66,8 56,8 46,10 36,12 26,16 18,22 10,30 8,42"
              fill="#050505"
              stroke="#333333"
              strokeWidth="0.5"
            />
          </svg>

          {/* Community dots */}
          {communities.map((c) => {
            const { x, y } = toXY(c.lat, c.lng);
            const scores = COMMUNITY_SCORES[c.id];
            const color = getScoreColor(scores.composite);
            const isSelected = selectedCommunity.id === c.id;

            return (
              <button
                key={c.id}
                onClick={() => onSelectCommunity(c)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={`${c.name}: score ${scores.composite}`}
              >
                {/* Pulse ring for selected */}
                {isSelected && (
                  <span
                    className="absolute inset-0 animate-ping opacity-60"
                    style={{ background: color, width: 20, height: 20, margin: '-4px' }}
                  />
                )}
                {/* Dot */}
                <span
                  className="block transition-all duration-300"
                  style={{
                    width: isSelected ? 12 : 8,
                    height: isSelected ? 12 : 8,
                    background: color,
                    border: isSelected ? '1px solid white' : 'none',
                    boxShadow: `0 0 ${isSelected ? 12 : 6}px ${color}80`,
                    transform: 'rotate(45deg)',
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
                  <div className="bg-black border border-neutral-800 rounded-none px-2 py-1.5 shadow-xl whitespace-nowrap">
                    <p className="text-xs font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] text-neutral-500">{c.state} · Score: <span style={{ color }}>{scores.composite}</span></p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend row */}
      <div className="mt-3 flex flex-wrap gap-2">
        {communities.map((c) => {
          const scores = COMMUNITY_SCORES[c.id];
          const color = getScoreColor(scores.composite);
          const isSelected = selectedCommunity.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCommunity(c)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-none text-[10px] font-medium border transition-all ${isSelected ? 'border-[#00C896] bg-black text-[#00C896]' : 'border-neutral-800 bg-black text-neutral-500 hover:text-white hover:border-neutral-600'}`}
            >
              <span className="w-2 h-2 rounded-none transform rotate-45" style={{ background: color }} />
              {c.name.split(' ')[0]} {c.name.split(' ')[1] || ''}
              <span style={{ color }}>{scores.composite}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
