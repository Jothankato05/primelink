/**
 * PrimeLink Data Simulator
 * Simulates realistic score drift across 8 Nigerian communities.
 * Five sectors: health, agriculture, environment, finance, climate.
 * Zero IoT — all data sourced from field reports, weather APIs, clinic data.
 */

import { detectAlerts, applyCrossCorrelation, compositeScore } from './riskEngine.js';

const COMMUNITIES = [
  { id: 1, name: 'Kano North',      state: 'Kano',    population: 45_234, farms: 3_210, clinics: 8,  lat: 12.0, lng: 8.5  },
  { id: 2, name: 'Ibadan Central',  state: 'Oyo',     population: 78_421, farms: 5_104, clinics: 14, lat: 7.4,  lng: 3.9  },
  { id: 3, name: 'Maiduguri',       state: 'Borno',   population: 32_100, farms: 1_890, clinics: 6,  lat: 11.8, lng: 13.2 },
  { id: 4, name: 'Jos North',       state: 'Plateau', population: 29_800, farms: 2_440, clinics: 7,  lat: 9.9,  lng: 8.9  },
  { id: 5, name: 'Enugu East',      state: 'Enugu',   population: 51_200, farms: 4_320, clinics: 11, lat: 6.5,  lng: 7.5  },
  { id: 6, name: 'Sokoto Central',  state: 'Sokoto',  population: 24_600, farms: 1_670, clinics: 5,  lat: 13.0, lng: 5.2  },
  { id: 7, name: 'Port Harcourt',   state: 'Rivers',  population: 92_300, farms: 2_100, clinics: 18, lat: 4.8,  lng: 7.0  },
  { id: 8, name: 'Abuja Municipal', state: 'FCT',     population: 67_400, farms: 3_890, clinics: 16, lat: 9.0,  lng: 7.5  },
];

// Per-community realistic baselines — matches frontend mockData.js
const BASELINES = {
  1: { health: 74, agriculture: 65, environment: 70, finance: 58, climate: 72 },
  2: { health: 80, agriculture: 72, environment: 68, finance: 70, climate: 75 },
  3: { health: 62, agriculture: 58, environment: 64, finance: 45, climate: 60 },
  4: { health: 71, agriculture: 66, environment: 75, finance: 55, climate: 68 },
  5: { health: 78, agriculture: 74, environment: 72, finance: 65, climate: 76 },
  6: { health: 60, agriculture: 55, environment: 62, finance: 42, climate: 55 },
  7: { health: 82, agriculture: 68, environment: 60, finance: 75, climate: 78 },
  8: { health: 85, agriculture: 70, environment: 72, finance: 80, climate: 80 },
};

const SECTORS = ['health', 'agriculture', 'environment', 'finance', 'climate'];

// In-memory state
const state = {};
COMMUNITIES.forEach(c => {
  state[c.id] = {
    ...c,
    scores:  { ...BASELINES[c.id] },
    history: [],
  };
});

let tickCount = 0;

function randomWalk(current, baseline, volatility = 1.2) {
  const reversion = (baseline - current) * 0.04;
  const noise     = (Math.random() - 0.5) * volatility * 2;
  return Math.max(5, Math.min(99, Math.round(current + reversion + noise)));
}

function tick(io) {
  tickCount++;
  const allCommunityScores = [];

  for (const community of COMMUNITIES) {
    const prev = { ...state[community.id].scores };
    const next = {};

    for (const sector of SECTORS) {
      next[sector] = randomWalk(prev[sector], BASELINES[community.id][sector]);
    }

    const correlated = applyCrossCorrelation(next, prev);
    const alerts     = detectAlerts(prev, correlated, community.name);

    state[community.id].scores = correlated;

    state[community.id].history.push({
      tick: tickCount,
      ts:   Date.now(),
      composite: compositeScore(correlated),
      ...correlated,
    });
    if (state[community.id].history.length > 48) {
      state[community.id].history.shift();
    }

    io.emit('sensor:update', {
      communityId:   community.id,
      communityName: community.name,
      scores:        correlated,
      composite:     compositeScore(correlated),
      ts:            Date.now(),
    });

    for (const alert of alerts) {
      io.emit('alert:new', alert);
    }

    allCommunityScores.push({
      id:        community.id,
      name:      community.name,
      state:     community.state,
      composite: compositeScore(correlated),
      scores:    correlated,
    });
  }

  if (tickCount % 10 === 0) {
    io.emit('map:overview', allCommunityScores);
  }
}

export function startSimulator(io) {
  console.log('[simulator] PrimeLink data simulator starting');
  console.log(`[simulator] ${COMMUNITIES.length} communities · 5 sectors (health, agriculture, environment, finance, climate)`);

  const interval = setInterval(() => tick(io), 3000);

  setTimeout(() => {
    const overview = COMMUNITIES.map(c => ({
      id:        c.id,
      name:      c.name,
      state:     c.state,
      composite: compositeScore(state[c.id].scores),
      scores:    state[c.id].scores,
    }));
    io.emit('map:overview', overview);
  }, 500);

  return interval;
}

export function getCommunities() {
  return COMMUNITIES.map(c => ({
    ...c,
    scores:    state[c.id].scores,
    composite: compositeScore(state[c.id].scores),
  }));
}

export function getCommunity(id) {
  const c = COMMUNITIES.find(c => c.id === Number(id));
  if (!c) return null;
  return {
    ...c,
    scores:    state[c.id].scores,
    composite: compositeScore(state[c.id].scores),
    history:   state[c.id].history,
  };
}
