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

// ─── Deterministic simulation ────────────────────────────────────────────────
// Every reading is a pure function of the clock: tick N's scores come from replaying a seeded random
// walk over the last HISTORY ticks. Any number of server instances (or serverless invocations) agree on
// the same live numbers and alerts, and nothing has to keep running between requests.
export const TICK_MS = 3000;
const HISTORY = 48;

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seedFor = (communityId, tick) => (communityId * 2654435761) ^ (tick * 40503);

// Run fn with Math.random replaced by a seeded generator (the risk engine draws from Math.random).
function seeded(seed, fn) {
  const real = Math.random;
  Math.random = mulberry32(seed);
  try { return fn(); } finally { Math.random = real; }
}

function randomWalk(current, baseline, volatility = 1.2) {
  const reversion = (baseline - current) * 0.04;
  const noise     = (Math.random() - 0.5) * volatility * 2;
  return Math.max(5, Math.min(99, Math.round(current + reversion + noise)));
}

export const currentTick = (now = Date.now()) => Math.floor(now / TICK_MS);

// Scores, history and alerts for one community over the window ending at `tick`.
function replay(community, tick) {
  let scores = { ...BASELINES[community.id] };
  const history = [];
  const alerts = [];
  for (let t = tick - HISTORY + 1; t <= tick; t++) {
    const prev = scores;
    scores = seeded(seedFor(community.id, t), () => {
      const next = {};
      for (const sector of SECTORS) next[sector] = randomWalk(prev[sector], BASELINES[community.id][sector]);
      const correlated = applyCrossCorrelation(next, prev);
      for (const a of detectAlerts(prev, correlated, community.name)) {
        alerts.push({ ...a, id: `alert-${t}-${community.id}-${a.sector}`, time: new Date(t * TICK_MS).toISOString() });
      }
      return correlated;
    });
    history.push({ tick: t, ts: t * TICK_MS, composite: compositeScore(scores), ...scores });
  }
  return { scores, history, alerts };
}

const view = (c, r) => ({ ...c, scores: r.scores, composite: compositeScore(r.scores) });

export function getCommunities(now = Date.now()) {
  const tick = currentTick(now);
  return COMMUNITIES.map((c) => view(c, replay(c, tick)));
}

export function getCommunity(id, now = Date.now()) {
  const c = COMMUNITIES.find((x) => x.id === Number(id));
  if (!c) return null;
  const r = replay(c, currentTick(now));
  return { ...view(c, r), history: r.history };
}

// Most recent alerts across all communities, newest first.
export function getRecentAlerts(limit = 20, now = Date.now()) {
  const tick = currentTick(now);
  return COMMUNITIES.flatMap((c) => replay(c, tick).alerts)
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, limit);
}

// Long-running servers (local dev, or any host with sockets) also push each tick live over Socket.io.
export function startSimulator(io) {
  console.log('[simulator] PrimeLink data simulator starting');
  console.log(`[simulator] ${COMMUNITIES.length} communities · 5 sectors (health, agriculture, environment, finance, climate)`);
  let last = currentTick();
  const timer = setInterval(() => {
    const tick = currentTick();
    if (tick === last) return;
    last = tick;
    const overview = [];
    for (const c of COMMUNITIES) {
      const r = replay(c, tick);
      const composite = compositeScore(r.scores);
      io.emit('sensor:update', { communityId: c.id, communityName: c.name, scores: r.scores, composite, ts: tick * TICK_MS });
      for (const a of r.alerts.filter((x) => x.time === new Date(tick * TICK_MS).toISOString())) io.emit('alert:new', a);
      overview.push({ id: c.id, name: c.name, state: c.state, composite, scores: r.scores });
    }
    if (tick % 10 === 0) io.emit('map:overview', overview);
  }, 500);
  return timer;
}
