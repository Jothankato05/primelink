export const communities = [
  { id: 1, name: 'Kano North LGA', state: 'Kano', population: 45234, lat: 12.0, lng: 8.5 },
  { id: 2, name: 'Ibadan Central', state: 'Oyo', population: 78421, lat: 7.4, lng: 3.9 },
  { id: 3, name: 'Maiduguri Metro', state: 'Borno', population: 32100, lat: 11.8, lng: 13.2 },
  { id: 4, name: 'Jos North', state: 'Plateau', population: 29800, lat: 9.9, lng: 8.9 },
  { id: 5, name: 'Enugu East', state: 'Enugu', population: 51200, lat: 6.5, lng: 7.5 },
  { id: 6, name: 'Sokoto Central', state: 'Sokoto', population: 24600, lat: 13.0, lng: 5.2 },
  { id: 7, name: 'Port Harcourt City', state: 'Rivers', population: 92300, lat: 4.8, lng: 7.0 },
  { id: 8, name: 'Abuja Municipal', state: 'FCT', population: 67400, lat: 9.0, lng: 7.5 },
];

export const getInitialScores = () => ({
  environment: 72,
  agriculture: 68,
  health: 76,
  finance: 61,
  iot: 89,
});

export const sectorMeta = {
  environment: { label: 'Environment', icon: '🌱', unit: 'Soil/Air/Water' },
  agriculture: { label: 'Agriculture', icon: '🌾', unit: 'Crop Health' },
  health: { label: 'Health', icon: '🏥', unit: 'Community Wellbeing' },
  finance: { label: 'Finance', icon: '💰', unit: 'Economic Resilience' },
  iot: { label: 'IoT Network', icon: '📡', unit: 'Sensor Coverage' },
};

export const getScoreColor = (score) => {
  if (score >= 70) return '#00C896';
  if (score >= 40) return '#F5A623';
  return '#FF3A5C';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return { text: 'OPTIMAL', cls: 'badge-green' };
  if (score >= 65) return { text: 'STABLE', cls: 'badge-green' };
  if (score >= 50) return { text: 'MODERATE', cls: 'badge-amber' };
  if (score >= 35) return { text: 'ELEVATED', cls: 'badge-amber' };
  return { text: 'CRITICAL', cls: 'badge-red' };
};

export const getHistoricalData = () => {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    time: new Date(now - (23 - i) * 3600000).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
    composite: Math.round(68 + Math.sin(i * 0.4) * 5 + Math.random() * 4),
    environment: Math.round(70 + Math.sin(i * 0.3) * 6 + Math.random() * 3),
    agriculture: Math.round(66 + Math.cos(i * 0.35) * 5 + Math.random() * 4),
    health: Math.round(74 + Math.sin(i * 0.25) * 4 + Math.random() * 2),
  }));
};

export const initialAlerts = [
  { id: 1, type: 'info', icon: '📡', text: '127 IoT sensors active across Kano North LGA', time: '2m ago', sector: 'iot' },
  { id: 2, type: 'amber', icon: '🌡️', text: 'Soil moisture trending down: 46% → 42% in Zone C', time: '18m ago', sector: 'environment' },
  { id: 3, type: 'green', icon: '✅', text: 'Monthly insurance premiums processed for 2,341 farmers', time: '1h ago', sector: 'finance' },
  { id: 4, type: 'info', icon: '🏥', text: 'Kano Central Clinic: 68% capacity — 8 facilities reporting', time: '2h ago', sector: 'health' },
  { id: 5, type: 'amber', icon: '🌾', text: 'Pest activity detected in 3 farm clusters — monitoring active', time: '3h ago', sector: 'agriculture' },
  { id: 6, type: 'green', icon: '💰', text: 'Micro-loan disbursed: ₦1.2M to 47 smallholder farmers', time: '5h ago', sector: 'finance' },
];

export const financeStats = {
  insuranceCoverage: 34,
  insuredFarmers: 2341,
  activeLoans: '₦2.4M',
  pendingPayouts: '₦0',
  loanDefaultRisk: 'LOW',
  premiumsCollected: '₦8.7M',
};

export const SCENARIO_STEPS = [
  {
    id: 's1', delay: 0,
    alert: { type: 'amber', icon: '🌡️', text: 'Soil moisture sensors: critical drop detected — 42% → 21%', sector: 'environment' },
    scores: { environment: 52 },
  },
  {
    id: 's2', delay: 2500,
    alert: { type: 'red', icon: '🚨', text: 'ENVIRONMENT ALERT: Drought conditions confirmed in Kano North', sector: 'environment' },
    scores: { environment: 31 },
  },
  {
    id: 's3', delay: 5000,
    alert: { type: 'amber', icon: '🌾', text: 'Crop stress detected across 847 hectares — yield forecast: 41%', sector: 'agriculture' },
    scores: { agriculture: 44 },
  },
  {
    id: 's4', delay: 7500,
    alert: { type: 'red', icon: '🚨', text: 'AGRICULTURE ALERT: 247 farmers at risk of harvest failure', sector: 'agriculture' },
    scores: { agriculture: 28 },
  },
  {
    id: 's5', delay: 10000,
    alert: { type: 'amber', icon: '💸', text: 'FINANCE RISK: Predicted loan defaults rising — 247 farmers', sector: 'finance' },
    scores: { finance: 42 },
  },
  {
    id: 's6', delay: 12500,
    alert: { type: 'amber', icon: '🏥', text: 'HEALTH WARNING: Malnutrition risk elevated across 3 wards', sector: 'health' },
    scores: { health: 55 },
  },
  {
    id: 's7', delay: 15000,
    alert: { type: 'info', icon: '🤖', text: 'PrimeLink AI: Automated intervention protocol initiated...', sector: null },
    scores: {},
  },
  {
    id: 's8', delay: 17500,
    alert: { type: 'green', icon: '✅', text: 'PARAMETRIC INSURANCE TRIGGERED: ₦42.8M → 847 farmers (instant payout)', sector: 'finance' },
    scores: { finance: 61 },
  },
  {
    id: 's9', delay: 20000,
    alert: { type: 'green', icon: '✅', text: 'HEALTH ALERT SENT: Kano State Ministry of Health — emergency response activated', sector: 'health' },
    scores: { health: 68 },
  },
  {
    id: 's10', delay: 22500,
    alert: { type: 'green', icon: '✅', text: 'NEMA NOTIFIED: Drought response team deployed to Kano North', sector: null },
    scores: {},
  },
  {
    id: 's11', delay: 25000,
    alert: { type: 'green', icon: '✅', text: 'WFP FOOD SECURITY: Emergency nutrition response mobilized', sector: 'health' },
    scores: { environment: 48, agriculture: 52 },
  },
  {
    id: 's12', delay: 27500,
    alert: { type: 'info', icon: '📈', text: 'RECOVERY ACTIVE: Risk scores stabilizing — early intervention successful', sector: null },
    scores: {},
    final: true,
  },
];
