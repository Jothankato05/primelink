import { Leaf, Wheat, Activity, TrendingUp, Cloud } from 'lucide-react';
import { getScoreColor, getScoreLabel } from '../data/mockData';

const SECTOR_ICONS = {
  Leaf:       Leaf,
  Wheat:      Wheat,
  Activity:   Activity,
  TrendingUp: TrendingUp,
  Cloud:      Cloud,
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
    <div className="card flex flex-col items-center text-center transition-all duration-500 p-3 sm:p-4">
      <div className="relative">
        <svg
          viewBox="0 0 110 65"
          className="w-24 h-14 sm:w-28 sm:h-16"
          aria-label={`${meta.label} risk score: ${score}`}
        >
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#222222"
            strokeWidth="6"
            strokeDasharray={`${half} ${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
          />

          {/* Fill */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${fillLen} ${circ}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
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
        <p className="text-[9px] sm:text-[10px] text-neutral-500">{meta.unit}</p>
      </div>

      <div className={`mt-2 text-[10px] ${cls}`}>
        {statusText}
      </div>
    </div>
  );
}
