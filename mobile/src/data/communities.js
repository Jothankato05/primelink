// ─────────────────────────────────────────────────────────────────────────────
// PrimeLink — Community Data (citizen-facing mobile app)
// Zero IoT. Five sectors: health, agriculture, environment, finance, climate.
// ─────────────────────────────────────────────────────────────────────────────

export const COMMUNITIES = [
  { id: 1, name: 'Kano North',      state: 'Kano',    population: 45_234, farms: 3_210, clinics: 8  },
  { id: 2, name: 'Ibadan Central',  state: 'Oyo',     population: 78_421, farms: 5_104, clinics: 14 },
  { id: 3, name: 'Maiduguri',       state: 'Borno',   population: 32_100, farms: 1_890, clinics: 6  },
  { id: 4, name: 'Jos North',       state: 'Plateau', population: 29_800, farms: 2_440, clinics: 7  },
  { id: 5, name: 'Enugu East',      state: 'Enugu',   population: 51_200, farms: 4_320, clinics: 11 },
  { id: 6, name: 'Sokoto Central',  state: 'Sokoto',  population: 24_600, farms: 1_670, clinics: 5  },
  { id: 7, name: 'Port Harcourt',   state: 'Rivers',  population: 92_300, farms: 2_100, clinics: 18 },
  { id: 8, name: 'Abuja Municipal', state: 'FCT',     population: 67_400, farms: 3_890, clinics: 16 },
];

// Five sectors — citizen-friendly labels and plain-language descriptions
export const SECTORS = [
  {
    key:   'health',
    label: 'Health',
    icon:  '🏥',
    unit:  'Clinics & Disease Data',
    question: 'Are clinics accessible and is disease risk low?',
    goodMsg:  'Clinics are well-staffed and disease risk is low in your area.',
    warnMsg:  'Some clinics are under pressure. Seek care early if unwell.',
    badMsg:   'Health services are strained. Avoid delay in seeking care.',
  },
  {
    key:   'agriculture',
    label: 'Agriculture',
    icon:  '🌾',
    unit:  'Crops & Yields',
    question: 'Are harvests healthy and pest risk low?',
    goodMsg:  'Crops are performing well. Good harvest season expected.',
    warnMsg:  'Some pest activity or soil issues detected. Monitor closely.',
    badMsg:   'Harvest risk is high. Farmers should seek advisory support.',
  },
  {
    key:   'environment',
    label: 'Environment',
    icon:  '🌿',
    unit:  'Air, Water & Soil',
    question: 'Is the air, water and soil safe?',
    goodMsg:  'Air quality, water, and soil conditions are within safe ranges.',
    warnMsg:  'Minor environmental stress detected. Water use may be limited.',
    badMsg:   'Environmental conditions are poor. Avoid outdoor exposure.',
  },
  {
    key:   'finance',
    label: 'Finance',
    icon:  '📈',
    unit:  'Economic Resilience',
    question: 'Is the local economy healthy and insurance active?',
    goodMsg:  'Local economic activity is strong and insurance coverage is good.',
    warnMsg:  'Some financial stress in the community. Loan defaults rising.',
    badMsg:   'Economic conditions are difficult. Support programmes active.',
  },
  {
    key:   'climate',
    label: 'Climate',
    icon:  '☁️',
    unit:  'Rainfall & Weather Risk',
    question: 'Is weather risk low and rainfall adequate?',
    goodMsg:  'Rainfall is seasonal and weather conditions are normal.',
    warnMsg:  'Rainfall is below average. Dry conditions may affect crops.',
    badMsg:   'Drought risk is high. Water conservation is strongly advised.',
  },
];

// Per-community realistic baselines (no IoT)
export const COMMUNITY_BASELINES = {
  1: { health: 74, agriculture: 65, environment: 70, finance: 58, climate: 72 },
  2: { health: 80, agriculture: 72, environment: 68, finance: 70, climate: 75 },
  3: { health: 62, agriculture: 58, environment: 64, finance: 45, climate: 60 },
  4: { health: 71, agriculture: 66, environment: 75, finance: 55, climate: 68 },
  5: { health: 78, agriculture: 74, environment: 72, finance: 65, climate: 76 },
  6: { health: 60, agriculture: 55, environment: 62, finance: 42, climate: 55 },
  7: { health: 82, agriculture: 68, environment: 60, finance: 75, climate: 78 },
  8: { health: 85, agriculture: 70, environment: 72, finance: 80, climate: 80 },
};

export function getInitialScores(communityId = 1) {
  return { ...COMMUNITY_BASELINES[communityId] };
}

export function driftScores(current, communityId = 1) {
  const baseline = COMMUNITY_BASELINES[communityId];
  const next = {};
  SECTORS.forEach(({ key }) => {
    const drift  = (Math.random() - 0.5) * 3;
    const revert = (baseline[key] - current[key]) * 0.05;
    next[key] = Math.max(10, Math.min(99, Math.round(current[key] + drift + revert)));
  });
  return next;
}

export function compositeScore(scores) {
  const vals = SECTORS.map(s => scores[s.key] ?? 70);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function scoreColor(score) {
  if (score >= 65) return '#00C896';
  if (score >= 40) return '#F5A623';
  return '#FF3A5C';
}

export function scoreLabel(score) {
  if (score >= 80) return 'OPTIMAL';
  if (score >= 65) return 'STABLE';
  if (score >= 50) return 'MODERATE';
  if (score >= 35) return 'ELEVATED';
  return 'CRITICAL';
}

export function sectorMessage(sectorKey, score) {
  const sector = SECTORS.find(s => s.key === sectorKey);
  if (!sector) return '';
  if (score >= 65) return sector.goodMsg;
  if (score >= 40) return sector.warnMsg;
  return sector.badMsg;
}

// Citizen-facing alerts — no IoT references
export const INITIAL_ALERTS = [
  {
    id: 1, type: 'amber', sector: 'environment',
    text: 'Soil moisture declining in Kano North — 46% down to 38% over 48 hours. Farmers advised to irrigate early.',
    time: '12m ago',
  },
  {
    id: 2, type: 'green', sector: 'finance',
    text: 'Parametric insurance payout processed — ₦1.2M disbursed to 47 smallholder farmers in Kano North.',
    time: '1h ago',
  },
  {
    id: 3, type: 'info', sector: 'health',
    text: 'Kano Central Clinic operating at 68% capacity across 8 facilities. No critical shortages reported.',
    time: '2h ago',
  },
  {
    id: 4, type: 'amber', sector: 'agriculture',
    text: 'Pest activity detected across 3 farm clusters in Ibadan Central. State agricultural office has been notified.',
    time: '3h ago',
  },
  {
    id: 5, type: 'red', sector: 'climate',
    text: 'Drought risk elevated in Sokoto Central — rainfall is 40% below seasonal average. Water conservation advised.',
    time: '4h ago',
  },
  {
    id: 6, type: 'green', sector: 'finance',
    text: 'Micro-credit scheme: 312 new farmers enrolled in Abuja Municipal. Applications open until end of month.',
    time: '6h ago',
  },
  {
    id: 7, type: 'info', sector: 'health',
    text: 'Free malaria testing available at all 16 clinics in Abuja Municipal this weekend.',
    time: '8h ago',
  },
  {
    id: 8, type: 'amber', sector: 'environment',
    text: 'Air quality index slightly elevated in Port Harcourt. Residents with respiratory conditions should take precautions.',
    time: '10h ago',
  },
  {
    id: 9, type: 'green', sector: 'agriculture',
    text: 'Harvest forecast for Enugu East is strong — above-average yield expected this season.',
    time: '12h ago',
  },
  {
    id: 10, type: 'info', sector: null,
    text: 'Community risk scores updated for all 8 communities. Next scheduled review in 24 hours.',
    time: '1d ago',
  },
];
