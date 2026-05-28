import { AlertTriangle, AlertCircle, CheckCircle, Info,
         Leaf, Wheat, Activity, TrendingUp, Cloud } from 'lucide-react';

const TYPE_ICONS = {
  red:   AlertTriangle,
  amber: AlertCircle,
  green: CheckCircle,
  info:  Info,
};

const SECTOR_ICONS = {
  environment: Leaf,
  agriculture: Wheat,
  health:      Activity,
  finance:     TrendingUp,
  climate:     Cloud,
};

const TYPE_STYLES = {
  green: { bar: '#00C896', bg: 'rgba(0,200,150,0.05)' },
  amber: { bar: '#F5A623', bg: 'rgba(245,166,35,0.05)' },
  red:   { bar: '#FF3A5C', bg: 'rgba(255,58,92,0.05)'  },
  info:  { bar: '#444444', bg: 'rgba(255,255,255,0.03)' },
};

const TYPE_ICON_COLORS = {
  green: '#00C896',
  amber: '#F5A623',
  red:   '#FF3A5C',
  info:  '#888888',
};

export default function AlertFeed({ alerts }) {
  return (
    <div className="card flex flex-col h-full min-h-[260px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Alert Feed</span>
          <span className="w-1.5 h-1.5 rounded-none bg-[#00C896] animate-pulse" />
        </div>
        <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wide">
          {alerts.length} events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 max-h-60 sm:max-h-64">
        {alerts.map((alert) => {
          const style   = TYPE_STYLES[alert.type]  ?? TYPE_STYLES.info;
          const TypeIcon = TYPE_ICONS[alert.type]  ?? Info;
          const SectorIcon = alert.sector ? (SECTOR_ICONS[alert.sector] ?? null) : null;
          const iconColor = TYPE_ICON_COLORS[alert.type] ?? '#3B82F6';

          return (
            <div
              key={alert.id}
              className="flex items-start gap-2.5 px-3 py-2 border-l-2 animate-fade-in"
              style={{ borderLeftColor: style.bar, background: style.bg }}
            >
              {/* Type icon */}
              <TypeIcon
                size={13}
                className="shrink-0 mt-0.5"
                style={{ color: iconColor }}
                strokeWidth={2}
              />

              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-neutral-300 leading-relaxed">{alert.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  {SectorIcon && (
                    <span className="flex items-center gap-1 text-[9px] text-neutral-500 uppercase tracking-wide font-medium">
                      <SectorIcon size={9} strokeWidth={2} />
                      {alert.sector}
                    </span>
                  )}
                  {alert.time && (
                    <span className="text-[9px] text-neutral-600">{alert.time}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
