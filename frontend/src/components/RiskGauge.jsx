import { getScoreColor, getScoreLabel } from '../data/mockData';

export default function RiskGauge({ sector, score, meta, compact = false }) {
  const r = 40;
  const cx = 55;
  const cy = 60;
  const circ = 2 * Math.PI * r;
  const half = circ / 2;
  const fillLen = Math.max(0, (score / 100) * half);
  const offset = half;
  const color = getScoreColor(score);
  const { text: statusText, cls } = getScoreLabel(score);

  return (
    <div className={`card-glow flex flex-col items-center text-center transition-all duration-500 ${compact ? 'p-3' : 'p-4'}`}
         style={{ borderColor: `${color}22` }}>
      <div className="relative">
        <svg
          viewBox="0 0 110 65"
          className={compact ? 'w-24 h-14' : 'w-32 h-20'}
          aria-label={`${meta.label} risk score: ${score}`}
        >
          {/* Glow filter */}
          <defs>
            <filter id={`glow-${sector}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#1A2E4A"
            strokeWidth="8"
            strokeDasharray={`${half} ${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />

          {/* Score fill */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${fillLen} ${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter={`url(#glow-${sector})`}
            style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Score number */}
          <text
            x={cx} y={cy - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize={compact ? '18' : '22'}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
            style={{ transition: 'fill 1s ease' }}
          >
            {score}
          </text>
        </svg>

        {/* Icon overlaid at top-center of arc */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-base">
          {meta.icon}
        </div>
      </div>

      <div className="mt-1">
        <p className={`font-semibold text-white ${compact ? 'text-xs' : 'text-sm'}`}>{meta.label}</p>
        <p className="text-[10px] text-[#64748B] mt-0.5">{meta.unit}</p>
      </div>

      <div className={`mt-2 ${cls}`}>
        {statusText}
      </div>
    </div>
  );
}
