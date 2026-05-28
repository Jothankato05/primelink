export const communities = [
  { id: 1, name: 'Kano North',      state: 'Kano',    population: 45234, lat: 12.0, lng: 8.5  },
  { id: 2, name: 'Ibadan Central',  state: 'Oyo',     population: 78421, lat: 7.4,  lng: 3.9  },
  { id: 3, name: 'Maiduguri',       state: 'Borno',   population: 32100, lat: 11.8, lng: 13.2 },
  { id: 4, name: 'Jos North',       state: 'Plateau', population: 29800, lat: 9.9,  lng: 8.9  },
  { id: 5, name: 'Enugu East',      state: 'Enugu',   population: 51200, lat: 6.5,  lng: 7.5  },
  { id: 6, name: 'Sokoto Central',  state: 'Sokoto',  population: 24600, lat: 13.0, lng: 5.2  },
  { id: 7, name: 'Port Harcourt',   state: 'Rivers',  population: 92300, lat: 4.8,  lng: 7.0  },
  { id: 8, name: 'Abuja Municipal', state: 'FCT',     population: 67400, lat: 9.0,  lng: 7.5  },
];

export const getInitialScores = () => ({
  health:      76,
  agriculture: 68,
  environment: 72,
  finance:     61,
  climate:     74,
});

export const sectorMeta = {
  health:      { label: 'Health',      iconKey: 'Activity',   unit: 'Clinic & Disease Data'   },
  agriculture: { label: 'Agriculture', iconKey: 'Wheat',      unit: 'Crop & Yield Data'       },
  environment: { label: 'Environment', iconKey: 'Leaf',       unit: 'Soil, Air & Water'       },
  finance:     { label: 'Finance',     iconKey: 'TrendingUp', unit: 'Economic Resilience'     },
  climate:     { label: 'Climate',     iconKey: 'Cloud',      unit: 'Weather & Rainfall'      },
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
    health:      Math.round(74 + Math.sin(i * 0.25) * 4 + Math.random() * 2),
    agriculture: Math.round(66 + Math.cos(i * 0.35) * 5 + Math.random() * 4),
    environment: Math.round(70 + Math.sin(i * 0.3) * 6  + Math.random() * 3),
    finance:     Math.round(60 + Math.cos(i * 0.2) * 4  + Math.random() * 3),
    climate:     Math.round(72 + Math.sin(i * 0.45) * 5 + Math.random() * 3),
  }));
};

// Per-community baseline scores (no IoT)
export const communityBaselines = {
  1: { health: 74, agriculture: 65, environment: 70, finance: 58, climate: 72 }, // Kano North
  2: { health: 80, agriculture: 72, environment: 68, finance: 70, climate: 75 }, // Ibadan Central
  3: { health: 62, agriculture: 58, environment: 64, finance: 45, climate: 60 }, // Maiduguri
  4: { health: 71, agriculture: 66, environment: 75, finance: 55, climate: 68 }, // Jos North
  5: { health: 78, agriculture: 74, environment: 72, finance: 65, climate: 76 }, // Enugu East
  6: { health: 60, agriculture: 55, environment: 62, finance: 42, climate: 55 }, // Sokoto Central
  7: { health: 82, agriculture: 68, environment: 60, finance: 75, climate: 78 }, // Port Harcourt
  8: { health: 85, agriculture: 70, environment: 72, finance: 80, climate: 80 }, // Abuja Municipal
};

export const initialAlerts = [
  { id: 1, type: 'amber', text: 'Soil moisture declining in Kano North — 46% to 38% over 48 hours',           time: '12m ago', sector: 'environment' },
  { id: 2, type: 'green', text: 'Parametric insurance payout processed — N1.2M disbursed to 47 farmers',       time: '1h ago',  sector: 'finance'     },
  { id: 3, type: 'info',  text: 'Kano Central Clinic operating at 68% capacity — 8 facilities reporting',      time: '2h ago',  sector: 'health'      },
  { id: 4, type: 'amber', text: 'Pest activity detected across 3 farm clusters in Ibadan Central',             time: '3h ago',  sector: 'agriculture' },
  { id: 5, type: 'red',   text: 'Drought risk elevated in Sokoto Central — rainfall 40% below seasonal avg',   time: '4h ago',  sector: 'climate'     },
  { id: 6, type: 'green', text: 'Micro-credit scheme: 312 new farmers enrolled in Abuja Municipal',            time: '6h ago',  sector: 'finance'     },
  { id: 7, type: 'info',  text: 'Risk scores updated across all 8 communities — next review in 24 hours',      time: '8h ago',  sector: null          },
];

export const financeStats = {
  insuranceCoverage: 34,
  insuredFarmers:    2341,
  activeLoans:       'N2.4M',
  pendingPayouts:    'N0',
  loanDefaultRisk:   'LOW',
  premiumsCollected: 'N8.7M',
};
