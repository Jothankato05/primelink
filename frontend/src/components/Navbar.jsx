import { useState } from 'react';
import { Bell, ChevronDown, Activity, Menu, X } from 'lucide-react';
import { communities } from '../data/mockData';

export default function Navbar({ selectedCommunity, onSelectCommunity, alertCount }) {
  const [communityOpen, setCommunityOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#040C18]/95 backdrop-blur-md border-b border-[#1A2E4A]">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00C896] to-[#0087CC] flex items-center justify-center">
            <Activity size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Prime<span className="text-[#00C896]">Link</span>
          </span>
          <span className="hidden sm:block text-xs text-[#94A3B8] font-medium border border-[#1A2E4A] px-2 py-0.5 rounded-full">
            INTELLIGENCE
          </span>
        </div>

        {/* Community selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1628] border border-[#1A2E4A] hover:border-[#00C896]/40 transition-all text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse-slow" />
            <span className="text-white font-medium">{selectedCommunity.name}</span>
            <span className="text-[#94A3B8]">·</span>
            <span className="text-[#94A3B8] text-xs">{selectedCommunity.state}</span>
            <ChevronDown size={14} className="text-[#94A3B8]" />
          </button>
          {communityOpen && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-[#0B1628] border border-[#1A2E4A] rounded-xl shadow-2xl shadow-black/50 z-50 py-1 animate-fade-in">
              {communities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { onSelectCommunity(c); setCommunityOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#1A2E4A]/50 transition-colors ${selectedCommunity.id === c.id ? 'text-[#00C896]' : 'text-[#CBD5E1]'}`}
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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00C896]/10 border border-[#00C896]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
            <span className="text-xs font-medium text-[#00C896]">LIVE</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[#1A2E4A]/50 transition-colors">
            <Bell size={18} className="text-[#94A3B8]" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF3A5C] text-white text-[9px] font-bold flex items-center justify-center">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C896] to-[#0087CC] flex items-center justify-center text-xs font-bold text-white">
            PC
          </div>

          {/* Mobile menu */}
          <button className="md:hidden p-2 rounded-lg hover:bg-[#1A2E4A]/50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} className="text-[#94A3B8]" /> : <Menu size={18} className="text-[#94A3B8]" />}
          </button>
        </div>
      </div>

      {/* Mobile community selector */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1A2E4A] bg-[#040C18] px-4 py-3 animate-slide-up">
          <p className="text-xs text-[#64748B] font-medium mb-2 uppercase tracking-wider">Select Community</p>
          <div className="grid grid-cols-2 gap-2">
            {communities.map((c) => (
              <button
                key={c.id}
                onClick={() => { onSelectCommunity(c); setMobileOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${selectedCommunity.id === c.id ? 'bg-[#00C896]/10 border-[#00C896]/30 text-[#00C896]' : 'bg-[#0B1628] border-[#1A2E4A] text-[#CBD5E1]'}`}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-[#64748B]">{c.state}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
