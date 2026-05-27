import { Leaf, Wheat, Activity, TrendingUp, Radio } from 'lucide-react';
import { getScoreColor, getScoreLabel } from '../data/mockData';

const SECTOR_ICONS = {
  Leaf:       Leaf,
  Wheat:      Wheat,
  Activity:   Activity,
  TrendingUp: TrendingUp,
  Radio:      Radio,
};

export default function RiskGauge({ sector, score, meta }) {
  const r       = 40;
  const cx      = 55;
  const cy      = 60;
  const circ    = 2 * Math.PI * r;
  const half    = circ / 2;
  const fillLen = Math.max(0, (score / 100) * half);
  const offset  = half;
  const color   = getScoreColor(score);
  const { text: statusText, cls } = getScoreLabel(score);

  const Icon = SECTOR_ICONS[meta.iconKey] ?? Activity;

  return (
    <div
      className="card flex flex-col items-center text-center transition-all duration-500 p-3 sm:p-4"
      style={{ borderColor: `${color}22` }}
    >
      <div className="relative">
        <svg
          viewBox="0 0 110 65"
          className="w-24 h-14 sm:w-28 sm:h-16"
          aria-label={`${meta.label} risk score: ${score}`}
        >
          <defs>
            <filter id={`glow-${sector}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#1A2E4A"
            strokeWidth="8"
            strokeDasharray={`${half} ${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />

          {/* Fill */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${fillLen} ${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter={`url(#glow-${sector})`}
            style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)' }}
          />

          {/* Score */}
          <text
            x={cx} y={cy - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize="22"
            fontWeight="700"
            fontFamily="Inter, system-ui, sans-serif"
            style={{ transition: 'fill 1s ease' }}
          >
            {score}
          </text>
        </svg>

        {/* Sector icon at top of arc */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center"
          style={{ color }}
        >
          <Icon size={13} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-1 space-y-0.5">
        <p className="text-xs sm:text-sm font-semibold text-white leading-none">{meta.label}</p>
        <p className="text-[9px] sm:text-[10px] text-[#64748B]">{meta.unit}</p>
      </div>

      <div className={`mt-2 text-[10px] ${cls}`}>
        {statusText}
      </div>
    </div>
  );
}
