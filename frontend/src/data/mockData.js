export const communities = [
  { id: 1, name: 'Kano North LGA',     state: 'Kano',    population: 45234, lat: 12.0, lng: 8.5  },
  { id: 2, name: 'Ibadan Central',     state: 'Oyo',     population: 78421, lat: 7.4,  lng: 3.9  },
  { id: 3, name: 'Maiduguri Metro',    state: 'Borno',   population: 32100, lat: 11.8, lng: 13.2 },
  { id: 4, name: 'Jos North',          state: 'Plateau', population: 29800, lat: 9.9,  lng: 8.9  },
  { id: 5, name: 'Enugu East',         state: 'Enugu',   population: 51200, lat: 6.5,  lng: 7.5  },
  { id: 6, name: 'Sokoto Central',     state: 'Sokoto',  population: 24600, lat: 13.0, lng: 5.2  },
  { id: 7, name: 'Port Harcourt City', state: 'Rivers',  population: 92300, lat: 4.8,  lng: 7.0  },
  { id: 8, name: 'Abuja Municipal',    state: 'FCT',     population: 67400, lat: 9.0,  lng: 7.5  },
];

export const getInitialScores = () => ({
  environment: 72,
  agriculture: 68,
  health:      76,
  finance:     61,
  iot:         89,
});

// iconKey maps to Lucide component names used in RiskGauge / AlertFeed
export const sectorMeta = {
  environment: { label: 'Environment', iconKey: 'Leaf',       unit: 'Soil / Air / Water'      },
  agriculture: { label: 'Agriculture', iconKey: 'Wheat',      unit: 'Crop Health'              },
  health:      { label: 'Health',      iconKey: 'Activity',   unit: 'Community Wellbeing'      },
  finance:     { label: 'Finance',     iconKey: 'TrendingUp', unit: 'Economic Resilience'      },
  iot:         { label: 'IoT Network', iconKey: 'Radio',      unit: 'Sensor Coverage'          },
};

export const getScoreColor = (score) => {
  if (score >= 70) return '#00C896';
  if (score >= 40) return '#F5A623';
  return '#FF3A5C';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return { text: 'OPTIMAL',  cls: 'badge-green' };
  if (score >= 65) return { text: 'STABLE',   cls: 'badge-green' };
  if (score >= 50) return { text: 'MODERATE', cls: 'badge-amber' };
  if (score >= 35) return { text: 'ELEVATED', cls: 'badge-amber' };
  return                  { text: 'CRITICAL', cls: 'badge-red'   };
};

export const getHistoricalData = () => {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    time:        new Date(now - (23 - i) * 3_600_000).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
    composite:   Math.round(68 + Math.sin(i * 0.4) * 5  + Math.random() * 4),
    environment: Math.round(70 + Math.sin(i * 0.3) * 6  + Math.random() * 3),
    agriculture: Math.round(66 + Math.cos(i * 0.35) * 5 + Math.random() * 4),
    health:      Math.round(74 + Math.sin(i * 0.25) * 4 + Math.random() * 2),
  }));
};

export const initialAlerts = [
  { id: 1, type: 'info',  text: '127 IoT sensors active and reporting across Kano North LGA',               time: '2m ago',  sector: 'iot'         },
  { id: 2, type: 'amber', text: 'Soil moisture trending downward: 46% to 42% in Zone C',                   time: '18m ago', sector: 'environment' },
  { id: 3, type: 'green', text: 'Monthly insurance premiums processed for 2,341 enrolled farmers',          time: '1h ago',  sector: 'finance'     },
  { id: 4, type: 'info',  text: 'Kano Central Clinic operating at 68% capacity — 8 facilities reporting',  time: '2h ago',  sector: 'health'      },
  { id: 5, type: 'amber', text: 'Pest activity detected in 3 farm clusters — active monitoring engaged',   time: '3h ago',  sector: 'agriculture' },
  { id: 6, type: 'green', text: 'Micro-credit disbursed: N1.2M allocated to 47 smallholder farmers',      time: '5h ago',  sector: 'finance'     },
];

export const financeStats = {
  insuranceCoverage: 34,
  insuredFarmers:    2341,
  activeLoans:       'N2.4M',
  pendingPayouts:    'N0',
  loanDefaultRisk:   'LOW',
  premiumsCollected: 'N8.7M',
};

// ─── Drought Scenario ────────────────────────────────────────────────────────
export const SCENARIO_STEPS = [
  {
    id: 's1', delay: 0,
    alert: { type: 'amber', text: 'Soil moisture sensors: critical decline detected — 42% to 21% in 4 hours', sector: 'environment' },
    scores: { environment: 52 },
  },
  {
    id: 's2', delay: 2500,
    alert: { type: 'red',   text: 'ENVIRONMENT — Drought conditions confirmed across Kano North LGA', sector: 'environment' },
    scores: { environment: 31 },
  },
  {
    id: 's3', delay: 5000,
    alert: { type: 'amber', text: 'Crop stress indicators rising across 847 hectares — yield forecast revised to 41%', sector: 'agriculture' },
    scores: { agriculture: 44 },
  },
  {
    id: 's4', delay: 7500,
    alert: { type: 'red',   text: 'AGRICULTURE — 247 farm households at confirmed risk of harvest failure', sector: 'agriculture' },
    scores: { agriculture: 28 },
  },
  {
    id: 's5', delay: 10000,
    alert: { type: 'amber', text: 'FINANCE — Predicted loan default rate rising: 247 households flagged', sector: 'finance' },
    scores: { finance: 42 },
  },
  {
    id: 's6', delay: 12500,
    alert: { type: 'amber', text: 'HEALTH — Malnutrition risk elevated across 3 wards: nutrition surveillance activated', sector: 'health' },
    scores: { health: 55 },
  },
  {
    id: 's7', delay: 15000,
    alert: { type: 'info',  text: 'PrimeLink Risk Engine: cross-sector threshold breach confirmed — automated response protocol initiated', sector: null },
    scores: {},
  },
  {
    id: 's8', delay: 17500,
    alert: { type: 'green', text: 'PARAMETRIC INSURANCE EXECUTED — N42.8M disbursed to 847 farm households (automated, zero-delay)', sector: 'finance' },
    scores: { finance: 61 },
  },
  {
    id: 's9', delay: 20000,
    alert: { type: 'green', text: 'HEALTH MINISTRY NOTIFIED — Kano State emergency nutrition response activated', sector: 'health' },
    scores: { health: 68 },
  },
  {
    id: 's10', delay: 22500,
    alert: { type: 'green', text: 'NEMA DEPLOYMENT — Drought response team dispatched to Kano North LGA', sector: null },
    scores: {},
  },
  {
    id: 's11', delay: 25000,
    alert: { type: 'green', text: 'WFP COORDINATION — Emergency food security response mobilised for affected wards', sector: 'health' },
    scores: { environment: 48, agriculture: 52 },
  },
  {
    id: 's12', delay: 27500,
    alert: { type: 'info',  text: 'RECOVERY IN PROGRESS — Risk scores stabilising. Early intervention protocol succeeded.', sector: null },
    scores: {},
    final: true,
  },
];

// ─── Flood Scenario ───────────────────────────────────────────────────────────
export const FLOOD_SCENARIO_STEPS = [
  {
    id: 'f1', delay: 0,
    alert: { type: 'amber', text: 'Rainfall sensors: 240mm recorded in 6 hours — seasonal threshold exceeded', sector: 'environment' },
    scores: { environment: 48 },
  },
  {
    id: 'f2', delay: 2500,
    alert: { type: 'red',   text: 'ENVIRONMENT — Flood conditions confirmed: Rivers Ogun and Benue breaching banks', sector: 'environment' },
    scores: { environment: 28 },
  },
  {
    id: 'f3', delay: 5000,
    alert: { type: 'red',   text: 'HEALTH — 1,240 households within confirmed flood path: evacuation assessment initiated', sector: 'health' },
    scores: { health: 45 },
  },
  {
    id: 'f4', delay: 7500,
    alert: { type: 'amber', text: 'AGRICULTURE — 430 hectares of active farmland submerged: full-season loss projected', sector: 'agriculture' },
    scores: { agriculture: 32 },
  },
  {
    id: 'f5', delay: 10000,
    alert: { type: 'red',   text: 'FINANCE — Property and crop losses estimated at N180M across affected LGA', sector: 'finance' },
    scores: { finance: 35 },
  },
  {
    id: 'f6', delay: 12500,
    alert: { type: 'amber', text: 'HEALTH — Waterborne disease risk elevated: cholera surveillance watch activated', sector: 'health' },
    scores: { health: 33 },
  },
  {
    id: 'f7', delay: 15000,
    alert: { type: 'info',  text: 'PrimeLink Risk Engine: multi-agency flood response protocol activated across 5 sectors', sector: null },
    scores: {},
  },
  {
    id: 'f8', delay: 17500,
    alert: { type: 'green', text: 'FLOOD INSURANCE EXECUTED — N95M disbursed to 1,240 affected households (automated)', sector: 'finance' },
    scores: { finance: 55 },
  },
  {
    id: 'f9', delay: 20000,
    alert: { type: 'green', text: 'NEMA DEPLOYMENT — 4 emergency response teams and water purification units dispatched', sector: null },
    scores: { health: 52 },
  },
  {
    id: 'f10', delay: 22500,
    alert: { type: 'green', text: 'EVACUATION COMPLETE — 1,240 households relocated to 6 designated safe shelters', sector: 'health' },
    scores: {},
  },
  {
    id: 'f11', delay: 25000,
    alert: { type: 'green', text: 'HEALTH MINISTRY — Mobile clinical units deployed: waterborne disease risk contained', sector: 'health' },
    scores: { health: 65, environment: 44 },
  },
  {
    id: 'f12', delay: 27500,
    alert: { type: 'info',  text: 'RECOVERY IN PROGRESS — Flood waters receding. Structural assessment and rebuilding support activated.', sector: null },
    scores: {},
    final: true,
  },
];

// ─── Disease Outbreak Scenario ────────────────────────────────────────────────
export const DISEASE_SCENARIO_STEPS = [
  {
    id: 'd1', delay: 0,
    alert: { type: 'amber', text: 'Clinic network: 47 fever and respiratory reports in 24 hours — above baseline threshold', sector: 'health' },
    scores: { health: 55 },
  },
  {
    id: 'd2', delay: 2500,
    alert: { type: 'red',   text: 'HEALTH — Suspected disease cluster confirmed in Maiduguri Metro', sector: 'health' },
    scores: { health: 35 },
  },
  {
    id: 'd3', delay: 5000,
    alert: { type: 'amber', text: 'IOT — Air quality sensors: PM2.5 readings at 3x safe limit across 2 wards', sector: 'iot' },
    scores: { iot: 52, environment: 55 },
  },
  {
    id: 'd4', delay: 7500,
    alert: { type: 'amber', text: 'AGRICULTURE — 30% of farmworkers unable to work: harvest operations disrupted', sector: 'agriculture' },
    scores: { agriculture: 50 },
  },
  {
    id: 'd5', delay: 10000,
    alert: { type: 'red',   text: 'FINANCE — Market closures confirmed: economic activity down 42% in affected wards', sector: 'finance' },
    scores: { finance: 40 },
  },
  {
    id: 'd6', delay: 12500,
    alert: { type: 'red',   text: 'HEALTH CRITICAL — Clinic capacity at 94%: overflow threshold projected within 6 hours', sector: 'health' },
    scores: { health: 22 },
  },
  {
    id: 'd7', delay: 15000,
    alert: { type: 'info',  text: 'PrimeLink Risk Engine: epidemic response protocol initiated — WHO, NCDC and FMoH notified', sector: null },
    scores: {},
  },
  {
    id: 'd8', delay: 17500,
    alert: { type: 'green', text: 'HEALTH INSURANCE — Emergency medical coverage activated for 8,500 affected residents', sector: 'finance' },
    scores: { finance: 55 },
  },
  {
    id: 'd9', delay: 20000,
    alert: { type: 'green', text: 'NCDC DEPLOYMENT — Disease surveillance team and 2 field hospitals deployed to Maiduguri', sector: 'health' },
    scores: { health: 42 },
  },
  {
    id: 'd10', delay: 22500,
    alert: { type: 'green', text: 'CONTAINMENT ACTIVE — Affected wards isolated: contact tracing covering 94% of confirmed cases', sector: 'health' },
    scores: { health: 55, iot: 72 },
  },
  {
    id: 'd11', delay: 25000,
    alert: { type: 'green', text: 'ENVIRONMENT — Emergency filtration units deployed: PM2.5 readings returning to safe range', sector: 'environment' },
    scores: { environment: 68, agriculture: 62 },
  },
  {
    id: 'd12', delay: 27500,
    alert: { type: 'info',  text: 'RECOVERY IN PROGRESS — New case rate declining. Community health index stabilising.', sector: null },
    scores: {},
    final: true,
  },
];
