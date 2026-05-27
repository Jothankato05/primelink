import { useState, useEffect, useRef } from 'react';
import { Play, X, Zap, Droplets, Stethoscope, ChevronDown } from 'lucide-react';
import { SCENARIO_STEPS, FLOOD_SCENARIO_STEPS, DISEASE_SCENARIO_STEPS } from '../data/mockData';

const SCENARIOS = [
  {
    id: 'drought',
    label: 'Drought Crisis',
    icon: Zap,
    color: '#FF3A5C',
    community: 'Kano North LGA',
    description: 'Soil sensors detect moisture collapse → crop failure → parametric insurance triggers',
    steps: SCENARIO_STEPS,
    finalMsg: '247 families protected from financial collapse. Parametric insurance triggered instantly.',
  },
  {
    id: 'flood',
    label: 'Flood Emergency',
    icon: Droplets,
    color: '#3B82F6',
    community: 'Ibadan Central',
    description: 'Rainfall breach → 1,240 households displaced → NEMA + insurance activated',
    steps: FLOOD_SCENARIO_STEPS,
    finalMsg: '1,240 households evacuated safely. ₦95M flood insurance paid out instantly.',
  },
  {
    id: 'disease',
    label: 'Disease Outbreak',
    icon: Stethoscope,
    color: '#8B5CF6',
    community: 'Maiduguri Metro',
    description: 'Clinic spike detected → NCDC notified → containment before epidemic',
    steps: DISEASE_SCENARIO_STEPS,
    finalMsg: '8,500 residents covered. Outbreak contained before epidemic threshold.',
  },
];

export default function ScenarioControl({ onStep, onReset, isRunning, setIsRunning }) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedId, setSelectedId] = useState('drought');
  const [pickerOpen, setPickerOpen] = useState(false);
  const timerRefs = useRef([]);

  const scenario = SCENARIOS.find(s => s.id === selectedId);
  const Icon = scenario.icon;

  const clearTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const startScenario = () => {
    clearTimers();
    setCompleted(false);
    setStepIndex(0);
    setIsRunning(true);
    setOpen(true);
    setPickerOpen(false);

    scenario.steps.forEach((step, i) => {
      const t = setTimeout(() => {
        setStepIndex(i);
        onStep(step);
        if (step.final) {
          setCompleted(true);
          setIsRunning(false);
        }
      }, step.delay);
      timerRefs.current.push(t);
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

  const progress = stepIndex >= 0 ? Math.round(((stepIndex + 1) / scenario.steps.length) * 100) : 0;

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {/* Scenario picker */}
          <div className="relative">
            <button
              onClick={() => setPickerOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-3 rounded-2xl text-xs font-medium text-white border border-[#1A2E4A] bg-[#0B1628]/90 hover:border-[#475569] transition-all"
            >
              <span>Scenario</span>
              <ChevronDown size={12} className={`transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>
            {pickerOpen && (
              <div className="absolute bottom-full mb-2 right-0 w-72 bg-[#0B1628] border border-[#1A2E4A] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                {SCENARIOS.map(s => {
                  const SIcon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => switchScenario(s.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#0D1E35] transition-colors ${s.id === selectedId ? 'border-l-2' : ''}`}
                      style={s.id === selectedId ? { borderLeftColor: s.color, background: `${s.color}08` } : {}}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                        <SIcon size={14} style={{ color: s.color }} />
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

          <button
            onClick={startScenario}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${scenario.color}, ${scenario.color}CC)`,
              boxShadow: `0 8px 32px ${scenario.color}40`,
            }}
          >
            <Icon size={16} strokeWidth={2.5} />
            {scenario.label}
          </button>
        </div>
      )}

      {/* Scenario panel */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <div className="bg-[#0B1628]/98 backdrop-blur-xl border-t border-[#1A2E4A] max-h-[60vh] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#1A2E4A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${scenario.color}18`, border: `1px solid ${scenario.color}30` }}>
                  <Icon size={15} style={{ color: scenario.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {scenario.community} — {scenario.label} Simulation
                  </p>
                  <p className="text-xs text-[#64748B]">
                    {completed ? 'Crisis averted — Early intervention succeeded' : isRunning ? 'Scenario running in real-time...' : 'Ready to run'}
                  </p>
                </div>
              </div>

              {/* Scenario switcher inside panel */}
              <div className="flex items-center gap-2">
                {SCENARIOS.filter(s => s.id !== selectedId).map(s => {
                  const SI = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => switchScenario(s.id)}
                      disabled={isRunning}
                      className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border border-[#1A2E4A] text-[10px] text-[#64748B] hover:border-[#475569] transition-colors disabled:opacity-30"
                    >
                      <SI size={10} />
                      {s.label}
                    </button>
                  );
                })}
                {!isRunning && (
                  <button onClick={startScenario} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-80 transition-all"
                    style={{ background: `${scenario.color}18`, border: `1px solid ${scenario.color}30`, color: scenario.color }}>
                    <Play size={12} />
                    {completed ? 'Replay' : 'Start'}
                  </button>
                )}
                {completed && (
                  <button onClick={resetScenario} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A2E4A] text-[#94A3B8] text-xs font-medium hover:bg-[#243550] transition-all">
                    Reset
                  </button>
                )}
                <button onClick={() => { setOpen(false); if (!isRunning) resetScenario(); }} className="p-1.5 rounded-lg hover:bg-[#1A2E4A] transition-colors">
                  <X size={16} className="text-[#64748B]" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-[#1A2E4A]">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: completed ? '#00C896' : scenario.color,
                }}
              />
            </div>

            {/* Timeline steps */}
            <div className="overflow-y-auto flex-1 px-6 py-3 space-y-1.5">
              {scenario.steps.map((step, i) => {
                const active = i === stepIndex;
                const done = i < stepIndex || completed;
                const pending = i > stepIndex && !completed;
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 py-1.5 px-3 rounded-lg transition-all duration-500 ${active ? 'bg-[#1A2E4A] scale-[1.01]' : done ? 'opacity-70' : 'opacity-30'}`}
                  >
                    <span className="text-base leading-none mt-0.5 w-5 text-center">
                      {done ? '✅' : active ? '⚡' : pending ? '○' : step.alert.icon}
                    </span>
                    <div>
                      <p className={`text-xs leading-relaxed ${active ? 'text-white font-medium' : 'text-[#94A3B8]'}`}>
                        {step.alert.text}
                      </p>
                      {step.scores && Object.keys(step.scores).length > 0 && (
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {Object.entries(step.scores).map(([sec, val]) => (
                            <span key={sec} className="text-[10px] text-[#64748B] bg-[#0D1E35] px-1.5 py-0.5 rounded">
                              {sec}: <span className={val < 40 ? 'text-[#FF3A5C]' : val < 65 ? 'text-[#F5A623]' : 'text-[#00C896]'}>{val}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final callout */}
            {completed && (
              <div className="px-6 py-4 border-t border-[#1A2E4A] animate-fade-in" style={{ background: 'rgba(0,200,150,0.05)' }}>
                <p className="text-sm font-bold text-[#00C896]">
                  🎯 Crisis averted. {scenario.finalMsg}
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  PrimeLink detected, responded, and recovered — automatically, across 5 sectors simultaneously. Zero human intervention.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
