import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronDown, CheckCircle, AlertTriangle, AlertCircle, Info,
         Zap, Droplets, Stethoscope } from 'lucide-react';
import { SCENARIO_STEPS, FLOOD_SCENARIO_STEPS, DISEASE_SCENARIO_STEPS } from '../data/mockData';

const SCENARIOS = [
  {
    id:          'drought',
    label:       'Drought Crisis',
    Icon:        Zap,
    accentColor: '#FF3A5C',
    community:   'Kano North LGA',
    description: 'Soil moisture collapse — crop failure cascade — parametric insurance trigger',
    steps:       SCENARIO_STEPS,
    resolution:  'Automated response protected 247 farm households from financial collapse. Parametric insurance disbursed with zero manual intervention.',
  },
  {
    id:          'flood',
    label:       'Flood Emergency',
    Icon:        Droplets,
    accentColor: '#3B82F6',
    community:   'Ibadan Central',
    description: 'Rainfall threshold breach — 1,240 household displacement — multi-agency response',
    steps:       FLOOD_SCENARIO_STEPS,
    resolution:  '1,240 households evacuated to safe shelters. N95M flood insurance disbursed automatically within the response window.',
  },
  {
    id:          'disease',
    label:       'Disease Outbreak',
    Icon:        Stethoscope,
    accentColor: '#8B5CF6',
    community:   'Maiduguri Metro',
    description: 'Clinic case-rate spike — NCDC notification — containment before epidemic threshold',
    steps:       DISEASE_SCENARIO_STEPS,
    resolution:  '8,500 residents covered by emergency health insurance. Outbreak contained before the epidemic classification threshold.',
  },
];

const STEP_ICONS = { red: AlertTriangle, amber: AlertCircle, green: CheckCircle, info: Info };
const STEP_COLORS = { red: '#FF3A5C', amber: '#F5A623', green: '#00C896', info: '#3B82F6' };

export default function ScenarioControl({ onStep, onReset, isRunning, setIsRunning }) {
  const [stepIndex,   setStepIndex]   = useState(-1);
  const [panelOpen,   setPanelOpen]   = useState(false);
  const [completed,   setCompleted]   = useState(false);
  const [selectedId,  setSelectedId]  = useState('drought');
  const [pickerOpen,  setPickerOpen]  = useState(false);
  const timers = useRef([]);

  const scenario = SCENARIOS.find(s => s.id === selectedId);
  const { Icon, accentColor } = scenario;

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const startScenario = () => {
    clearTimers();
    setCompleted(false);
    setStepIndex(0);
    setIsRunning(true);
    setPanelOpen(true);
    setPickerOpen(false);

    scenario.steps.forEach((step, i) => {
      const t = setTimeout(() => {
        setStepIndex(i);
        onStep(step);
        if (step.final) { setCompleted(true); setIsRunning(false); }
      }, step.delay);
      timers.current.push(t);
    });
  };

  const resetScenario = () => {
    clearTimers();
    setStepIndex(-1);
    setIsRunning(false);
    setCompleted(false);
    onReset();
  };

  const switchScenario = (id) => {
    resetScenario();
    setSelectedId(id);
    setPickerOpen(false);
  };

  useEffect(() => () => clearTimers(), []);

  const progress = stepIndex >= 0
    ? Math.round(((stepIndex + 1) / scenario.steps.length) * 100)
    : 0;

  return (
    <>
      {/* Trigger controls (visible when panel is closed) */}
      {!panelOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2">
          {/* Scenario picker */}
          <div className="relative">
            <button
              onClick={() => setPickerOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium text-[#94A3B8] bg-[#0B1628] border border-[#1A2E4A] hover:border-[#334155] transition-colors"
            >
              Scenario
              <ChevronDown size={11} className={`transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {pickerOpen && (
              <div className="absolute bottom-full mb-2 right-0 w-72 bg-[#0B1628] border border-[#1A2E4A] rounded-xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in">
                {SCENARIOS.map(s => {
                  const SI = s.Icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => switchScenario(s.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#0D1E35] transition-colors ${s.id === selectedId ? 'border-l-2' : 'border-l-2 border-l-transparent'}`}
                      style={s.id === selectedId ? { borderLeftColor: s.accentColor } : {}}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${s.accentColor}12`, border: `1px solid ${s.accentColor}25` }}
                      >
                        <SI size={13} style={{ color: s.accentColor }} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{s.label}</p>
                        <p className="text-[10px] text-[#64748B] leading-relaxed mt-0.5">{s.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Run button */}
          <button
            onClick={startScenario}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background:  accentColor,
              boxShadow:   `0 4px 20px ${accentColor}35`,
            }}
          >
            <Icon size={13} strokeWidth={2.5} />
            Run {scenario.label}
          </button>
        </div>
      )}

      {/* Scenario panel */}
      {panelOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <div className="bg-[#080F1D] border-t border-[#1A2E4A] max-h-[56vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#1A2E4A]">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}25` }}
                >
                  <Icon size={13} style={{ color: accentColor }} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {scenario.community} — {scenario.label}
                  </p>
                  <p className="text-[10px] text-[#475569]">
                    {completed
                      ? 'Response complete — early intervention succeeded'
                      : isRunning
                        ? 'Simulation running...'
                        : 'Ready'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Switch scenarios */}
                {!isRunning && SCENARIOS.filter(s => s.id !== selectedId).map(s => {
                  const SI = s.Icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => switchScenario(s.id)}
                      className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-[#1A2E4A] text-[10px] text-[#64748B] hover:text-white hover:border-[#334155] transition-colors"
                    >
                      <SI size={10} strokeWidth={2} />
                      {s.label}
                    </button>
                  );
                })}

                {!isRunning && (
                  <button
                    onClick={startScenario}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-80"
                    style={{ background: accentColor }}
                  >
                    <Play size={11} strokeWidth={2.5} />
                    {completed ? 'Replay' : 'Start'}
                  </button>
                )}

                {completed && (
                  <button
                    onClick={resetScenario}
                    className="px-3 py-1.5 rounded-lg bg-[#0D1E35] border border-[#1A2E4A] text-[#94A3B8] text-xs font-medium hover:bg-[#1A2E4A] transition-colors"
                  >
                    Reset
                  </button>
                )}

                <button
                  onClick={() => { setPanelOpen(false); if (!isRunning) resetScenario(); }}
                  className="p-1.5 rounded-lg hover:bg-[#1A2E4A] transition-colors"
                >
                  <X size={15} className="text-[#475569]" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-[#1A2E4A]">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width:      `${progress}%`,
                  background: completed ? '#00C896' : accentColor,
                }}
              />
            </div>

            {/* Step timeline */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-3 space-y-1">
              {scenario.steps.map((step, i) => {
                const active  = i === stepIndex;
                const done    = i < stepIndex || completed;
                const pending = !active && !done;

                const StepIcon    = done ? CheckCircle : (STEP_ICONS[step.alert.type] ?? Info);
                const stepColor   = done ? '#00C896' : (STEP_COLORS[step.alert.type] ?? '#3B82F6');

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-all duration-400 ${active ? 'bg-[#0D1E35]' : ''} ${pending ? 'opacity-25' : done ? 'opacity-60' : ''}`}
                  >
                    <StepIcon
                      size={13}
                      className="shrink-0 mt-0.5"
                      style={{ color: stepColor }}
                      strokeWidth={2}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] leading-relaxed ${active ? 'text-white font-medium' : 'text-[#94A3B8]'}`}>
                        {step.alert.text}
                      </p>
                      {step.scores && Object.keys(step.scores).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {Object.entries(step.scores).map(([sec, val]) => (
                            <span
                              key={sec}
                              className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#080F1D] border border-[#1A2E4A]"
                              style={{ color: val < 40 ? '#FF3A5C' : val < 65 ? '#F5A623' : '#00C896' }}
                            >
                              {sec} {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resolution callout */}
            {completed && (
              <div className="px-4 sm:px-6 py-4 border-t border-[#1A2E4A] bg-[#00C896]/[0.04] animate-fade-in">
                <p className="text-xs font-semibold text-[#00C896] mb-1">
                  Response complete — automated intervention succeeded across 5 sectors
                </p>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  {scenario.resolution}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
