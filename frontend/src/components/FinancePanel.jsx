import { TrendingUp, Shield, Wallet, AlertTriangle } from 'lucide-react';

export default function FinancePanel({ stats, scores }) {
  const financeScore = scores.finance;
  const riskLevel = financeScore >= 60 ? 'LOW' : financeScore >= 40 ? 'MODERATE' : 'HIGH';
  const riskColor = financeScore >= 60 ? 'text-[#00C896]' : financeScore >= 40 ? 'text-[#F5A623]' : 'text-[#FF3A5C]';

  return (
    <div className="card-glow flex flex-col h-full min-h-[280px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white">Finance Panel</span>
        <span className={`text-xs font-bold ${riskColor}`}>
          DEFAULT RISK: {riskLevel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatBox
          icon={<Shield size={14} className="text-[#00C896]" />}
          label="Insurance Coverage"
          value={`${stats.insuranceCoverage}%`}
          sub={`${stats.insuredFarmers.toLocaleString()} farmers`}
          warn={stats.insuranceCoverage < 50}
        />
        <StatBox
          icon={<Wallet size={14} className="text-[#3B82F6]" />}
          label="Active Loans"
          value={stats.activeLoans}
          sub="Micro-credit portfolio"
        />
        <StatBox
          icon={<TrendingUp size={14} className="text-[#8B5CF6]" />}
          label="Premiums Collected"
          value={stats.premiumsCollected}
          sub="This season"
        />
        <StatBox
          icon={<AlertTriangle size={14} className={financeScore < 50 ? 'text-[#FF3A5C]' : 'text-[#F5A623]'} />}
          label="Pending Payouts"
          value={stats.pendingPayouts}
          sub={financeScore < 40 ? 'Trigger armed' : 'No triggers active'}
          warn={financeScore < 40}
        />
      </div>

      {/* Parametric insurance meter */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#64748B]">Parametric Trigger Threshold</span>
          <span className="text-xs font-medium text-[#94A3B8]">
            {financeScore < 40 ? '🔴 ARMED' : financeScore < 60 ? '🟡 WATCHFUL' : '🟢 STANDBY'}
          </span>
        </div>
        <div className="h-2 bg-[#1A2E4A] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${financeScore}%`,
              background: financeScore >= 60 ? '#00C896' : financeScore >= 40 ? '#F5A623' : '#FF3A5C',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#FF3A5C]">TRIGGER</span>
          <span className="text-[10px] text-[#64748B]">Score: {financeScore}/100</span>
          <span className="text-[10px] text-[#00C896]">SAFE</span>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, sub, warn = false }) {
  return (
    <div className={`rounded-lg p-3 border transition-all ${warn ? 'bg-[#FF3A5C]/5 border-[#FF3A5C]/20' : 'bg-[#0D1E35] border-[#1A2E4A]'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] text-[#64748B] uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className={`font-bold text-sm ${warn ? 'text-[#FF3A5C]' : 'text-white'}`}>{value}</p>
      <p className="text-[10px] text-[#475569] mt-0.5">{sub}</p>
    </div>
  );
}
