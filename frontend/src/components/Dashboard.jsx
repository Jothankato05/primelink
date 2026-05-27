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
  <h1>⬡ PrimeLink Community Risk Report</h1>
  <h2>Generated: ${now} · By Primers Corporation</h2>

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
    <div className="max-w-screen-2xl mx-auto px-4 py-4 pb-32">

      {/* Community Health Index hero */}
      <div className="card-glow mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">
              {selectedCommunity.name} · {selectedCommunity.state}
            </p>
            {/* Backend connection badge */}
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              connected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-[#1A2E4A] text-[#64748B] border-[#1A2E4A]'
            }`}>
              {connected ? <Wifi size={9} /> : <WifiOff size={9} />}
              {connected ? 'LIVE' : 'SIMULATED'}
            </span>
            <button
              onClick={exportReport}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0D1E35] border border-[#1A2E4A] hover:border-[#00C896]/40 text-[#64748B] hover:text-[#00C896] transition-all text-[10px] font-medium"
            >
              <Download size={10} />
              Export Report
            </button>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-white">{comp}</span>
            <div className="mb-1">
              <div className={compCls}>{compStatus}</div>
              <p className="text-xs text-[#64748B] mt-1">Community Health Index</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:min-w-[400px]">
          <QuickStat icon={<Users size={13} />} label="Population" value={selectedCommunity.population.toLocaleString()} />
          <QuickStat icon={<Radio size={13} />} label="IoT Sensors" value={`${scores.iot > 70 ? 127 : scores.iot > 40 ? 89 : 42} active`} />
          <QuickStat icon={<Building2 size={13} />} label="Clinics" value="8 connected" />
          <QuickStat icon={<TrendingUp size={13} />} label="Farmers Insured" value="2,341" />
        </div>
      </div>

      {/* 5 Sector Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {SECTORS.map(s => (
          <RiskGauge key={s} sector={s} score={scores[s]} meta={sectorMeta[s]} />
        ))}
      </div>

      {/* Chart */}
      <div className="card-glow mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">Risk Score Timeline — 24h</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#00C896] inline-block rounded" />Composite</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#F5A623] inline-block rounded" />Agric</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#3B82F6] inline-block rounded" />Health</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2E4A" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#475569' }} interval={3} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#475569' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="composite" stroke="#00C896" strokeWidth={2} dot={false} name="Composite" />
            <Line type="monotone" dataKey="agriculture" stroke="#F5A623" strokeWidth={1.5} dot={false} name="Agric" strokeDasharray="4 2" />
            <Line type="monotone" dataKey="health" stroke="#3B82F6" strokeWidth={1.5} dot={false} name="Health" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts + Finance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AlertFeed alerts={alerts} />
        <FinancePanel stats={financeStats} scores={scores} />
      </div>

      {/* Nigeria Map */}
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
