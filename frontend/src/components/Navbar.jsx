import { useState } from 'react';
import { Bell, ChevronDown, Hexagon, Menu, X, ArrowLeft } from 'lucide-react';
import { communities } from '../data/mockData';

export default function Navbar({ selectedCommunity, onSelectCommunity, alertCount, onBack }) {
  const [communityOpen, setCommunityOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Back Button & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors border border-neutral-800 text-xs font-semibold mr-1 sm:mr-2"
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
          <span className="hidden sm:block text-xs text-neutral-400 font-medium border border-neutral-800 px-2 py-0.5 rounded-none">
            INTELLIGENCE
          </span>
        </div>

        {/* Community selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-black border border-neutral-800 hover:border-[#00C896] transition-all text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-none bg-[#00C896] animate-pulse-slow" />
            <span className="text-white font-medium">{selectedCommunity.name}</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-400 text-xs">{selectedCommunity.state}</span>
            <ChevronDown size={14} className="text-neutral-500" />
          </button>
          {communityOpen && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-black border border-neutral-800 shadow-2xl z-50 py-1 animate-fade-in">
              {communities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { onSelectCommunity(c); setCommunityOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-neutral-900 transition-colors ${selectedCommunity.id === c.id ? 'text-[#00C896]' : 'text-neutral-300'}`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-[#64748B]">{c.state}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-emerald-950 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">LIVE</span>
          </div>

          {/* Notifications */}
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

          {/* Avatar */}
          <div className="w-8 h-8 rounded-none bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white ml-2">
            PC
          </div>

          {/* Mobile menu */}
          <button className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile community selector */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-black px-4 py-3 animate-slide-up">
          <p className="text-xs text-neutral-500 font-medium mb-2 uppercase tracking-wider">Select Community</p>
          <div className="grid grid-cols-2 gap-2">
            {communities.map((c) => (
              <button
                key={c.id}
                onClick={() => { onSelectCommunity(c); setMobileOpen(false); }}
                className={`text-left px-3 py-2 rounded-none text-sm border transition-all ${selectedCommunity.id === c.id ? 'bg-emerald-950 border-[#00C896] text-[#00C896]' : 'bg-black border-neutral-800 text-neutral-300'}`}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-neutral-500">{c.state}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
