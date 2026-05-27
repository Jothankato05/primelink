import { useEffect, useRef } from 'react';

const typeStyles = {
  green: 'border-l-[#00C896] bg-[#00C896]/5',
  amber: 'border-l-[#F5A623] bg-[#F5A623]/5',
  red: 'border-l-[#FF3A5C] bg-[#FF3A5C]/5',
  info: 'border-l-[#3B82F6] bg-[#3B82F6]/5',
};

export default function AlertFeed({ alerts }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [alerts.length]);

  return (
    <div className="card-glow flex flex-col h-full min-h-[280px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Live Alerts</span>
          <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
        </div>
        <span className="text-xs text-[#64748B]">{alerts.length} events</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-64">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-2 pl-3 py-2 rounded-r-lg text-sm animate-fade-in ${typeStyles[alert.type] || typeStyles.info}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">{alert.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#CBD5E1] text-xs leading-relaxed">{alert.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  {alert.sector && (
                    <span className="text-[10px] text-[#475569] uppercase tracking-wide font-medium">
                      {alert.sector}
                    </span>
                  )}
                  {alert.time && (
                    <span className="text-[10px] text-[#475569]">{alert.time}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
