import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Radio, Building2, TrendingUp } from 'lucide-react';
import RiskGauge from './RiskGauge';
import AlertFeed from './AlertFeed';
import FinancePanel from './FinancePanel';
import NigeriaMap from './NigeriaMap';
import ScenarioControl from './ScenarioControl';
import { getInitialScores, sectorMeta, getScoreLabel, initialAlerts, financeStats, getHistoricalData, communities } from '../data/mockData';

const SECTORS = ['environment', 'agriculture', 'health', 'finance', 'iot'];

function composite(scores) {
  const vals = SECTORS.map(s => scores[s]);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

let alertCounter = 100;

export default function Dashboard({ selectedCommunity: propCommunity, setSelectedCommunity: onSetCommunity }) {
  const [selectedCommunity, setSelectedCommunity] = useState(propCommunity ?? communities[0]);

  const handleSetCommunity = (c) => {
    setSelectedCommunity(c);
    onSetCommunity?.(c);
  };
  const [scores, setScores] = useState(getInitialScores());
  const [alerts, setAlerts] = useState(initialAlerts);
  const [history, setHistory] = useState(getHistoricalData());
  const [isRunning, setIsRunning] = useState(false);

  // Gentle live fluctuation when not in scenario
  useEffect(() => {
    if (isRunning) return;
    const interval = setInterval(() => {
      setScores(prev => {
        const next = { ...prev };
        SECTORS.forEach(s => {
          const delta = (Math.random() - 0.5) * 2;
          next[s] = Math.max(10, Math.min(99, Math.round(prev[s] + delta)));
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isRunning]);

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
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-1">
            {selectedCommunity.name} · {selectedCommunity.state}
          </p>
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
