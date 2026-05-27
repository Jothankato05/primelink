import { useState, useEffect, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Radio, Building2, TrendingUp, Download, Wifi, WifiOff } from 'lucide-react';
import RiskGauge from './RiskGauge';
import AlertFeed from './AlertFeed';
import FinancePanel from './FinancePanel';
import NigeriaMap from './NigeriaMap';
import ScenarioControl from './ScenarioControl';
import { useSocket } from '../hooks/useSocket';
import { getInitialScores, sectorMeta, getScoreLabel, initialAlerts, financeStats, getHistoricalData, communities } from '../data/mockData';

const SECTORS = ['environment', 'agriculture', 'health', 'finance', 'iot'];

function composite(scores) {
  const vals = SECTORS.map(s => scores[s]);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

let alertCounter = 100;

export default function Dashboard({ selectedCommunity: propCommunity, setSelectedCommunity: onSetCommunity }) {
  const [selectedCommunity, setSelectedCommunity] = useState(propCommunity ?? communities[0]);
  const [scores, setScores] = useState(getInitialScores());
  const [alerts, setAlerts] = useState(initialAlerts);
  const [history, setHistory] = useState(getHistoricalData());
  const [isRunning, setIsRunning] = useState(false);
  const [mapOverview, setMapOverview] = useState([]);
  const isRunningRef = useRef(false);

  const handleSetCommunity = (c) => {
    setSelectedCommunity(c);
    onSetCommunity?.(c);
  };

  // Socket.io — live backend data
  const { connected, backendOnline } = useSocket({
    communityId: selectedCommunity.id,
    onSensorUpdate: (data) => {
      if (isRunningRef.current) return; // don't override scenario
      if (data.communityId !== selectedCommunity.id) return;
      setScores(data.scores);
      setHistory(prev => {
        const point = {
          time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
          composite: data.composite,
          environment: data.scores.environment,
          agriculture: data.scores.agriculture,
          health: data.scores.health,
        };
        return [...prev.slice(-23), point];
      });
    },
    onAlertNew: (alert) => {
      if (alert.community && alert.community !== selectedCommunity.name) return;
      setAlerts(prev => [
        { ...alert, id: ++alertCounter, time: 'just now' },
        ...prev,
      ].slice(0, 30));
    },
    onMapOverview: setMapOverview,
  });

  // Keep ref in sync for socket handler closure
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

  // Fallback local fluctuation when backend is offline
  useEffect(() => {
    if (backendOnline || isRunning) return;
    const interval = setInterval(() => {
      setScores(prev => {
        const next = { ...prev };
        SECTORS.forEach(s => {
          next[s] = Math.max(10, Math.min(99, Math.round(prev[s] + (Math.random() - 0.5) * 2)));
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [backendOnline, isRunning]);

  // Update history chart every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const updated = [...prev.slice(1), {
          time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
          composite: composite(scores),
          environment: scores.environment,
          agriculture: scores.agriculture,
          health: scores.health,
        }];
        return updated;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [scores]);

  const handleScenarioStep = useCallback((step) => {
    if (Object.keys(step.scores).length > 0) {
      setScores(prev => ({ ...prev, ...step.scores }));
    }
    const newAlert = {
      ...step.alert,
      id: ++alertCounter,
      time: 'just now',
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 30));
  }, []);

  const handleReset = useCallback(() => {
    setScores(getInitialScores());
    setAlerts(initialAlerts);
  }, []);

  const exportReport = () => {
    const now = new Date().toLocaleString('en-NG');
    const comp = composite(scores);
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
    .hero { background: #0B1628; border: 1px solid #1A2E4A; border-radius: 12px; padding: 24px; margin: 24px 0; display: flex; align-items: center; gap: 24px; }
    .score-big { font-size: 72px; font-weight: 900; color: ${comp >= 65 ? '#00C896' : comp >= 40 ? '#F5A623' : '#FF3A5C'}; line-height: 1; }
    .status { background: ${comp >= 65 ? 'rgba(0,200,150,0.1)' : comp >= 40 ? 'rgba(245,166,35,0.1)' : 'rgba(255,58,92,0.1)'}; color: ${comp >= 65 ? '#00C896' : comp >= 40 ? '#F5A623' : '#FF3A5C'}; border-radius: 99px; padding: 4px 12px; font-size: 12px; font-weight: bold; display: inline-block; }
    .sectors { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 24px 0; }
    .sector { background: #0B1628; border: 1px solid #1A2E4A; border-radius: 10px; padding: 16px; text-align: center; }
    .sector-score { font-size: 28px; font-weight: 900; }
    .sector-name { font-size: 11px; color: #94A3B8; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .alerts-section { background: #0B1628; border: 1px solid #1A2E4A; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .alert-item { border-bottom: 1px solid #1A2E4A; padding: 10px 0; font-size: 13px; }
    .alert-item:last-child { border-bottom: none; }
    .footer { text-align: center; color: #334155; font-size: 12px; margin-top: 40px; }
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
      <div style="font-size:20px; font-weight:700; margin-bottom:8px">${selectedCommunity.name}, ${selectedCommunity.state}</div>
      <div style="color:#94A3B8; font-size:13px">Population: ${selectedCommunity.population.toLocaleString()}</div>
      <div style="color:#94A3B8; font-size:13px">Community Health Index</div>
    </div>
  </div>

  <div class="sectors">
    ${Object.entries(scores).map(([sec, val]) => `
    <div class="sector">
      <div class="sector-score ${val >= 65 ? 'green' : val >= 40 ? 'amber' : 'red'}">${val}</div>
      <div class="sector-name">${sec}</div>
    </div>`).join('')}
  </div>

  <div class="alerts-section">
    <h3 style="margin-top:0; color:#F1F5F9; font-size:14px">Recent Alerts</h3>
    ${alerts.slice(0, 8).map(a => `<div class="alert-item">${a.icon || ''} ${a.text} <span style="color:#475569; font-size:11px">${a.time}</span></div>`).join('')}
  </div>

  <div class="footer">
    PrimeLink · Africa's Community Risk Intelligence Network · Primers Corporation · Nigeria · ${new Date().getFullYear()}
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrimeLink-Report-${selectedCommunity.name.replace(/\s+/g, '-')}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const comp = composite(scores);
  const { text: compStatus, cls: compCls } = getScoreLabel(comp);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#0B1628] border border-[#1A2E4A] rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-[#64748B] mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 pb-28">

      {/* Hero — Community Index */}
      <div className="card mb-3 sm:mb-4" data-tour="hero">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Score block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-[10px] text-[#475569] font-medium uppercase tracking-widest">
                {selectedCommunity.name} &mdash; {selectedCommunity.state}
              </p>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold border ${
                connected
                  ? 'text-[#00C896] border-[#00C896]/25 bg-[#00C896]/06'
                  : 'text-[#475569] border-[#1A2E4A]'
              }`}>
                {connected ? <Wifi size={8} strokeWidth={2.5} /> : <WifiOff size={8} strokeWidth={2.5} />}
                {connected ? 'LIVE' : 'SIMULATED'}
              </span>
              <button
                onClick={exportReport}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium border border-[#1A2E4A] text-[#475569] hover:text-[#94A3B8] hover:border-[#334155] transition-colors"
              >
                <Download size={9} strokeWidth={2} />
                Export
              </button>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl sm:text-6xl font-black text-white leading-none">{comp}</span>
              <div className="pb-1">
                <span className={`${compCls} text-[10px]`}>{compStatus}</span>
                <p className="text-[10px] text-[#475569] mt-1 uppercase tracking-wide">Community Risk Index</p>
              </div>
            </div>
          </div>

          {/* Quick stats — 2 col on mobile, 4 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:min-w-[360px]">
            <QuickStat icon={<Users size={12} />}     label="Population"   value={selectedCommunity.population.toLocaleString()} />
            <QuickStat icon={<Radio size={12} />}     label="Sensors"      value={`${scores.iot > 70 ? 127 : scores.iot > 40 ? 89 : 42} online`} />
            <QuickStat icon={<Building2 size={12} />} label="Clinics"      value="8 connected" />
            <QuickStat icon={<TrendingUp size={12} />} label="Insured"     value="2,341 farms" />
          </div>
        </div>
      </div>

      {/* Five sector gauges */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4" data-tour="gauges">
        {SECTORS.map(s => (
          <RiskGauge key={s} sector={s} score={scores[s]} meta={sectorMeta[s]} />
        ))}
      </div>

      {/* Risk timeline chart */}
      <div className="card mb-3 sm:mb-4" data-tour="chart">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-semibold text-white">Risk Score Timeline — 24h</span>
          <div className="flex items-center gap-3 text-[9px] sm:text-[10px] text-[#475569]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-px bg-[#00C896] inline-block" />Composite</span>
            <span className="hidden sm:flex items-center gap-1.5"><span className="w-3 h-px bg-[#F5A623] inline-block" />Agriculture</span>
            <span className="hidden sm:flex items-center gap-1.5"><span className="w-3 h-px bg-[#3B82F6] inline-block" />Health</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={history} margin={{ top: 2, right: 2, bottom: 0, left: -24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2E4A" />
            <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#334155' }} interval={5} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#334155' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="composite"   stroke="#00C896" strokeWidth={2}   dot={false} name="Composite"   />
            <Line type="monotone" dataKey="agriculture" stroke="#F5A623" strokeWidth={1.5} dot={false} name="Agriculture" strokeDasharray="4 2" />
            <Line type="monotone" dataKey="health"      stroke="#3B82F6" strokeWidth={1.5} dot={false} name="Health"      strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alert feed + Finance panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div data-tour="alerts"><AlertFeed alerts={alerts} /></div>
        <div data-tour="finance"><FinancePanel stats={financeStats} scores={scores} /></div>
      </div>

      {/* Community map */}
      <NigeriaMap selectedCommunity={selectedCommunity} onSelectCommunity={handleSetCommunity} />

      {/* Scenario demo */}
      <ScenarioControl
        onStep={handleScenarioStep}
        onReset={handleReset}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
      />
    </div>
  );
}

function QuickStat({ icon, label, value }) {
  return (
    <div className="bg-[#0D1E35] border border-[#1A2E4A] rounded-lg px-3 py-2">
      <div className="flex items-center gap-1 text-[#64748B] mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-xs font-bold text-white">{value}</p>
    </div>
  );
}
