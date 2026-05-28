import { useState } from 'react';
import { Bell, Hexagon, ArrowLeft } from 'lucide-react';

export default function Navbar({ alertCount, onBack }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800 flex-shrink-0">
      <div className="px-4 h-14 flex items-center justify-between gap-4">

        {/* Left — back + logo */}
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-800 text-xs font-semibold"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div className="flex items-center justify-center text-[#00C896]">
            <Hexagon size={20} strokeWidth={2} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Prime<span className="text-[#00C896]">Link</span>
          </span>
          <span className="hidden sm:block text-[10px] text-neutral-400 font-medium border border-neutral-800 px-2 py-0.5">
            INTELLIGENCE
          </span>
        </div>

        {/* Right — live badge + bell + avatar */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">LIVE</span>
          </div>

          <div className="relative">
            <button
              className="relative p-2 hover:text-[#00C896] transition-colors"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={18} className="text-neutral-400 hover:text-white transition-colors" />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-black border border-neutral-800 shadow-2xl z-50 py-2 animate-fade-in">
                <div className="px-4 pb-2 mb-2 border-b border-neutral-800">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                </div>
                <div className="px-4 py-3">
                  {alertCount > 0 ? (
                    <p className="text-xs text-neutral-400">You have {alertCount} unread alerts. Check the Alert Feed for details.</p>
                  ) : (
                    <p className="text-xs text-neutral-500 font-medium text-center py-4">No new notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-8 h-8 bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white ml-2">
            PC
          </div>
        </div>
      </div>
    </nav>
  );
}
