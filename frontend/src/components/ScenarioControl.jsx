import { useState, useEffect, useRef } from 'react';
import { Play, X, Zap } from 'lucide-react';
import { SCENARIO_STEPS } from '../data/mockData';

export default function ScenarioControl({ onStep, onReset, isRunning, setIsRunning }) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timerRefs = useRef([]);

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

    SCENARIO_STEPS.forEach((step, i) => {
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

  useEffect(() => () => clearTimers(), []);

  const progress = stepIndex >= 0 ? Math.round(((stepIndex + 1) / SCENARIO_STEPS.length) * 100) : 0;

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={startScenario}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white shadow-2xl shadow-[#FF3A5C]/30 transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #FF3A5C, #C42B48)' }}
        >
          <Zap size={16} strokeWidth={2.5} />
          Simulate Crisis
        </button>
      )}

      {/* Scenario panel */}
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
          <div className="bg-[#0B1628]/98 backdrop-blur-xl border-t border-[#1A2E4A] max-h-[60vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#1A2E4A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF3A5C]/15 border border-[#FF3A5C]/30 flex items-center justify-center">
                  <Zap size={15} className="text-[#FF3A5C]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Kano North — Drought Crisis Simulation</p>
                  <p className="text-xs text-[#64748B]">
                    {completed ? 'Crisis averted — Early intervention worked' : isRunning ? 'Scenario running...' : 'Ready'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isRunning && (
                  <button onClick={startScenario} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF3A5C]/15 border border-[#FF3A5C]/30 text-[#FF3A5C] text-xs font-medium hover:bg-[#FF3A5C]/25 transition-all">
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
                  background: completed ? '#00C896' : isRunning ? '#FF3A5C' : '#1A2E4A',
                }}
              />
            </div>

            {/* Timeline steps */}
            <div className="overflow-y-auto flex-1 px-6 py-3 space-y-1.5">
              {SCENARIO_STEPS.map((step, i) => {
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
                        <div className="flex gap-2 mt-1">
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
              <div className="px-6 py-4 border-t border-[#1A2E4A] bg-[#00C896]/5 animate-fade-in">
                <p className="text-sm font-bold text-[#00C896]">
                  🎯 Crisis averted. 247 families protected from financial collapse. Zero human intervention required.
                </p>
                <p className="text-xs text-[#64748B] mt-1">
                  PrimeLink detected, responded, and recovered — all automatically, across 5 sectors simultaneously.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
