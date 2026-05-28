import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Wheat, Leaf, TrendingUp, Cloud,
         AlertTriangle, AlertCircle, CheckCircle, Info,
         Wifi, WifiOff, Download } from 'lucide-react';
import {
  communities, sectorMeta,
  getScoreColor, getScoreLabel,
  initialAlerts, communityBaselines,
} from '../data/mockData';
import CommunityMap from './CommunityMap';
import { useSocket } from '../hooks/useSocket';

/* ── constants ─────────────────────────────────────────── */
const SECTORS = ['health', 'agriculture', 'environment', 'finance', 'climate'];

const SECTOR_ICONS = { Activity, Wheat, Leaf, TrendingUp, Cloud };

const ALERT_ICON   = { red: AlertTriangle, amber: AlertCircle, green: CheckCircle, info: Info };
const ALERT_COLOR  = { red: '#FF3A5C', amber: '#F5A623', green: '#00C896', info: '#888888' };
const ALERT_BG     = { red: 'rgba(255,58,92,0.05)', amber: 'rgba(245,166,35,0.05)', green: 'rgba(0,200,150,0.05)', info: 'rgba(255,255,255,0.03)' };

/* ── helpers ────────────────────────────────────────────── */
function composite(scores) {
  const vals = SECTORS.map(s => scores[s] ?? 70);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function driftScores(current, baseline) {
  const next = {};
  SECTORS.forEach(k => {
    const drift  = (Math.random() - 0.5) * 3;
    const revert = (baseline[k] - current[k]) * 0.05;
    next[k] = Math.max(10, Math.min(99, Math.round(current[k] + drift + revert)));
  });
  return next;
}

function makeBaseline(community) {
  return communityBaselines[community.id] ?? { health: 70, agriculture: 68, environment: 70, finance: 60, climate: 72 };
}

function makeInitialScores(community) {
  return { ...makeBaseline(community) };
}

/* seed per-community scores map */
function seedAllScores() {
  const map = {};
  communities.forEach(c => { map[c.id] = makeInitialScores(c); });
  return map;
}

let alertCounter = 200;

/* ── component ──────────────────────────────────────────── */
export default function Dashboard() {
  const [selectedId, setSelectedId]     = useState(communities[0].id);
  const [allScores, setAllScores]        = useState(seedAllScores);
  const [alerts, setAlerts]              = useState(initialAlerts);
  const backendOnlineRef                 = useRef(false);

  const selectedCommunity = communities.find(c => c.id === selectedId) ?? communities[0];
  const scores            = allScores[selectedId] ?? makeInitialScores(selectedCommunity);
  const comp              = composite(scores);
  const { text: compLabel } = getScoreLabel(comp);
  const compColor           = getScoreColor(comp);

  /* ── socket ────────────────────────────────────────────── */
  const { connected, backendOnline } = useSocket({
    communityId: selectedId,
    onSensorUpdate: (data) => {
      if (data.communityId !== selectedId) return;
      setAllScores(prev => ({ ...prev, [selectedId]: data.scores }));
    },
    onAlertNew: (alert) => {
      setAlerts(prev => [{ ...alert, id: ++alertCounter, time: 'just now' }, ...prev].slice(0, 30));
    },
    onMapOverview: () => {},
  });

  useEffect(() => { backendOnlineRef.current = backendOnline; }, [backendOnline]);

  /* ── local drift (offline fallback) ────────────────────── */
  useEffect(() => {
    if (backendOnline) return;
    const id = setInterval(() => {
      setAllScores(prev => {
        const next = { ...prev };
        communities.forEach(c => {
          next[c.id] = driftScores(prev[c.id] ?? makeInitialScores(c), makeBaseline(c));
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [backendOnline]);

  /* ── handlers ───────────────────────────────────────────── */
  const handleSelect = useCallback((community) => {
    setSelectedId(community.id);
  }, []);

  const exportReport = () => {
    const now  = new Date().toLocaleString('en-NG');
    const { text: status } = getScoreLabel(comp);
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>PrimeLink Risk Report — ${selectedCommunity.name}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #040C18; color: #F1F5F9; margin: 0; padding: 40px; }
    h1 { color: #00C896; font-size: 28px; margin-bottom: 4px; }
    h2 { color: #94A3B8; font-size: 14px; font-weight: normal; margin-top: 0; }
    .hero { background: #000; border: 1px solid #333; padding: 24px; margin: 24px 0; display: flex; align-items: center; gap: 24px; }
    .score-big { font-size: 72px; font-weight: 900; color: ${compColor}; line-height: 1; }
    .status { background: ${comp >= 65 ? 'rgba(0,200,150,0.1)' : comp >= 40 ? 'rgba(245,166,35,0.1)' : 'rgba(255,58,92,0.1)'}; color: ${compColor}; padding: 4px 12px; font-size: 12px; font-weight: bold; display: inline-block; }
    .sectors { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 24px 0; }
    .sector { background: #000; border: 1px solid #333; padding: 16px; text-align: center; }
    .sector-score { font-size: 28px; font-weight: 900; }
    .sector-name { font-size: 11px; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .footer { text-align: center; color: #555; font-size: 12px; margin-top: 40px; }
    .green { color: #00C896; } .amber { color: #F5A623; } .red { color: #FF3A5C; }
  </style>
</head>
<body>
  <h1>PrimeLink Community Risk Report</h1>
  <h2>Generated: ${now} · Primers Corporation</h2>
  <div class="hero">
    <div>
      <div class="score-big">${comp}</div>
      <div class="status">${status}</div>
    </div>
    <div>
      <div style="font-size:20px;font-weight:700;margin-bottom:8px">${selectedCommunity.name}, ${selectedCommunity.state}</div>
      <div style="color:#94A3B8;font-size:13px">Population: ${selectedCommunity.population.toLocaleString()}</div>
    </div>
  </div>
  <div class="sectors">
    ${SECTORS.map(s => `<div class="sector"><div class="sector-score ${scores[s] >= 65 ? 'green' : scores[s] >= 40 ? 'amber' : 'red'}">${scores[s]}</div><div class="sector-name">${s}</div></div>`).join('')}
  </div>
  <div style="background:#000;border:1px solid #333;padding:20px;margin:24px 0">
    <h3 style="margin-top:0;color:#F1F5F9;font-size:14px">Recent Alerts</h3>
    ${alerts.slice(0, 8).map(a => `<div style="border-bottom:1px solid #333;padding:10px 0;font-size:13px">${a.text} <span style="color:#475569;font-size:11px">${a.time}</span></div>`).join('')}
  </div>
  <div class="footer">PrimeLink · Africa's Community Risk Intelligence Network · Primers Corporation · ${new Date().getFullYear()}</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `PrimeLink-Report-${selectedCommunity.name.replace(/\s+/g, '-')}-${Date.now()}.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>

      {/* ── MAIN ROW: Map + Right Panel ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — full-height map */}
        <div className="flex-1 relative">
          <CommunityMap
            communities={communities}
            allScores={allScores}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        {/* RIGHT — community detail panel */}
        <div
          className="flex flex-col overflow-y-auto border-l border-neutral-900"
          style={{ width: 320, background: '#000', flexShrink: 0 }}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-neutral-900">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                {selectedCommunity.state} · {selectedCommunity.population.toLocaleString()} residents
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-semibold flex items-center gap-1 ${connected ? 'text-[#00C896]' : 'text-neutral-600'}`}>
                  {connected ? <Wifi size={8} /> : <WifiOff size={8} />}
                  {connected ? 'LIVE' : 'SIM'}
                </span>
                <button
                  onClick={exportReport}
                  className="text-neutral-500 hover:text-white transition-colors"
                  title="Export report"
                >
                  <Download size={11} />
                </button>
              </div>
            </div>
            <h2 className="text-lg font-black text-white leading-tight">{selectedCommunity.name}</h2>
          </div>

          {/* Composite score */}
          <div className="px-4 py-4 border-b border-neutral-900">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Community Risk Index</div>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-5xl font-black leading-none" style={{ color: compColor }}>{comp}</span>
              <div className="pb-1">
                <span
                  className="text-[10px] font-bold tracking-widest border px-2 py-0.5"
                  style={{ color: compColor, borderColor: compColor }}
                >
                  {compLabel}
                </span>
              </div>
            </div>
            {/* Composite bar */}
            <div className="w-full h-1.5 bg-neutral-900 rounded-none overflow-hidden">
              <div
                className="h-full transition-all duration-700"
                style={{ width: `${comp}%`, background: compColor }}
              />
            </div>
          </div>

          {/* Sector breakdown */}
          <div className="px-4 py-4 border-b border-neutral-900 space-y-3">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Sector Scores</div>
            {SECTORS.map(s => {
              const meta   = sectorMeta[s];
              const val    = scores[s] ?? 70;
              const color  = getScoreColor(val);
              const Icon   = SECTOR_ICONS[meta?.iconKey] ?? Activity;
              return (
                <div key={s}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                      <Icon size={10} strokeWidth={2} />
                      <span className="uppercase tracking-wide">{meta?.label ?? s}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color }}>{val}</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900">
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${val}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alert feed */}
          <div className="px-4 py-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">Alerts</span>
              <span className="w-1.5 h-1.5 bg-[#00C896] animate-pulse" />
              <span className="text-[9px] text-neutral-600 ml-auto">{alerts.length} events</span>
            </div>
            <div className="space-y-1.5">
              {alerts.slice(0, 10).map(alert => {
                const TypeIcon = ALERT_ICON[alert.type] ?? Info;
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-2 px-2.5 py-2 border-l-2"
                    style={{
                      borderLeftColor: ALERT_COLOR[alert.type] ?? '#444',
                      background: ALERT_BG[alert.type] ?? 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <TypeIcon size={11} className="shrink-0 mt-0.5" style={{ color: ALERT_COLOR[alert.type] ?? '#888' }} strokeWidth={2} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-neutral-300 leading-relaxed">{alert.text}</p>
                      <span className="text-[9px] text-neutral-600">{alert.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STRIP: all-community score buttons ── */}
      <div
        className="flex items-center gap-px overflow-x-auto border-t border-neutral-900 flex-shrink-0"
        style={{ background: '#000', height: 52 }}
      >
        {communities.map(c => {
          const cScores  = allScores[c.id] ?? makeInitialScores(c);
          const cComp    = composite(cScores);
          const cColor   = getScoreColor(cComp);
          const isActive = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="flex flex-col items-center justify-center px-3 transition-colors flex-shrink-0"
              style={{
                height: '100%',
                minWidth: 90,
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                borderBottom: isActive ? `2px solid ${cColor}` : '2px solid transparent',
              }}
            >
              <span className="text-[11px] font-bold leading-none" style={{ color: cColor }}>{cComp}</span>
              <span className="text-[9px] text-neutral-500 mt-0.5 truncate max-w-[80px]">{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
