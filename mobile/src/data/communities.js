export const COMMUNITIES = [
  { id: 1, name: 'Kano North LGA',     state: 'Kano',    population: 45234 },
  { id: 2, name: 'Ibadan Central',     state: 'Oyo',     population: 78421 },
  { id: 3, name: 'Maiduguri Metro',    state: 'Borno',   population: 32100 },
  { id: 4, name: 'Jos North',          state: 'Plateau', population: 29800 },
  { id: 5, name: 'Enugu East',         state: 'Enugu',   population: 51200 },
  { id: 6, name: 'Sokoto Central',     state: 'Sokoto',  population: 24600 },
  { id: 7, name: 'Port Harcourt City', state: 'Rivers',  population: 92300 },
  { id: 8, name: 'Abuja Municipal',    state: 'FCT',     population: 67400 },
];

export const SECTORS = [
  { key: 'environment', label: 'Environment', unit: 'Soil / Air / Water'  },
  { key: 'agriculture', label: 'Agriculture', unit: 'Crop Health'         },
  { key: 'health',      label: 'Health',      unit: 'Community Wellbeing' },
  { key: 'finance',     label: 'Finance',     unit: 'Economic Resilience' },
  { key: 'iot',         label: 'IoT Network', unit: 'Sensor Coverage'     },
];

export function getInitialScores() {
  return { environment: 72, agriculture: 68, health: 76, finance: 61, iot: 89 };
}

export function compositeScore(scores) {
  const vals = SECTORS.map(s => scores[s.key] ?? 70);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function scoreColor(score) {
  if (score >= 70) return '#00C896';
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

export const INITIAL_ALERTS = [
  { id: 1, type: 'info',  text: '127 IoT sensors active and reporting across Kano North LGA',              time: '2m ago',  sector: 'iot'         },
  { id: 2, type: 'amber', text: 'Soil moisture trending downward: 46% to 42% in Zone C',                  time: '18m ago', sector: 'environment' },
  { id: 3, type: 'green', text: 'Monthly insurance premiums processed for 2,341 enrolled farmers',         time: '1h ago',  sector: 'finance'     },
  { id: 4, type: 'info',  text: 'Kano Central Clinic at 68% capacity — 8 facilities reporting',           time: '2h ago',  sector: 'health'      },
  { id: 5, type: 'amber', text: 'Pest activity detected in 3 farm clusters — monitoring active',          time: '3h ago',  sector: 'agriculture' },
  { id: 6, type: 'green', text: 'Micro-credit disbursed: N1.2M to 47 smallholder farmers',               time: '5h ago',  sector: 'finance'     },
];
