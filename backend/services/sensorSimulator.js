/**
 * PrimeLink IoT Sensor Simulator
 * Simulates 127 sensors across 8 Nigerian communities
 * Emits real-time data via Socket.io every 3 seconds
 */

import { detectAlerts, applyCrossCorrelation, compositeScore } from './riskEngine.js';

const COMMUNITIES = [
  { id: 1, name: 'Kano North LGA',     state: 'Kano',    population: 45234, sensors: 18, lat: 12.0, lng: 8.5 },
  { id: 2, name: 'Ibadan Central',     state: 'Oyo',     population: 78421, sensors: 22, lat: 7.4,  lng: 3.9 },
  { id: 3, name: 'Maiduguri Metro',    state: 'Borno',   population: 32100, sensors: 14, lat: 11.8, lng: 13.2 },
  { id: 4, name: 'Jos North',          state: 'Plateau', population: 29800, sensors: 12, lat: 9.9,  lng: 8.9 },
  { id: 5, name: 'Enugu East',         state: 'Enugu',   population: 51200, sensors: 16, lat: 6.5,  lng: 7.5 },
  { id: 6, name: 'Sokoto Central',     state: 'Sokoto',  population: 24600, sensors: 10, lat: 13.0, lng: 5.2 },
  { id: 7, name: 'Port Harcourt City', state: 'Rivers',  population: 92300, sensors: 25, lat: 4.8,  lng: 7.0 },
  { id: 8, name: 'Abuja Municipal',    state: 'FCT',     population: 67400, sensors: 10, lat: 9.0,  lng: 7.5 },
];

// Each community starts with realistic baseline scores
const BASELINES = {
  1: { environment: 72, agriculture: 68, health: 76, finance: 61, iot: 89 },
  2: { environment: 78, agriculture: 74, health: 82, finance: 70, iot: 91 },
  3: { environment: 61, agriculture: 55, health: 65, finance: 48, iot: 78 },
  4: { environment: 74, agriculture: 70, health: 73, finance: 65, iot: 82 },
  5: { environment: 80, agriculture: 76, health: 79, finance: 72, iot: 88 },
  6: { environment: 58, agriculture: 52, health: 62, finance: 44, iot: 71 },
  7: { environment: 69, agriculture: 65, health: 74, finance: 67, iot: 94 },
  8: { environment: 83, agriculture: 78, health: 85, finance: 79, iot: 96 },
};

const SECTORS = ['environment', 'agriculture', 'health', 'finance', 'iot'];

// In-memory state for all communities
const state = {};
COMMUNITIES.forEach(c => {
  state[c.id] = {
    ...c,
    scores: { ...BASELINES[c.id] },
    onlineSensors: c.sensors,
    history: [],
  };
});

let tickCount = 0;

function randomWalk(current, baseline, volatility = 1.2) {
  const reversion = (baseline - current) * 0.04; // mean reversion toward baseline
  const noise     = (Math.random() - 0.5) * volatility * 2;
  const next      = current + reversion + noise;
  return Math.max(5, Math.min(99, Math.round(next)));
}

function tick(io) {
  tickCount++;
  const allCommunityScores = [];

  for (const community of COMMUNITIES) {
    const prev = { ...state[community.id].scores };
    const next = {};

    for (const sector of SECTORS) {
      const baseline   = BASELINES[community.id][sector];
      const volatility = sector === 'iot' ? 0.6 : 1.5;
      next[sector]     = randomWalk(prev[sector], baseline, volatility);
    }

    // Apply cross-sector correlations
    const correlated = applyCrossCorrelation(next, prev);

    // Sensor connectivity simulation
    const sensorDelta   = Math.floor((Math.random() - 0.5) * 2);
    const onlineSensors = Math.max(
      Math.floor(community.sensors * 0.6),
      Math.min(community.sensors, state[community.id].onlineSensors + sensorDelta)
    );

    // Detect alerts from significant score changes
    const alerts = detectAlerts(prev, correlated, community.name);

    // Update state
    state[community.id].scores        = correlated;
    state[community.id].onlineSensors = onlineSensors;

    // Add to history (keep last 48 ticks = 2.4 min of data)
    state[community.id].history.push({
      tick: tickCount,
      ts:   Date.now(),
      composite: compositeScore(correlated),
      ...correlated,
    });
    if (state[community.id].history.length > 48) {
      state[community.id].history.shift();
    }

    // Emit live score update for this community
    io.emit('sensor:update', {
      communityId:    community.id,
      communityName:  community.name,
      scores:         correlated,
      composite:      compositeScore(correlated),
      onlineSensors,
      totalSensors:   community.sensors,
      ts:             Date.now(),
    });

    // Emit any triggered alerts
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

  // Every 10 ticks emit a map overview update
  if (tickCount % 10 === 0) {
    io.emit('map:overview', allCommunityScores);
  }
}

export function startSimulator(io) {
  console.log('[simulator] starting');
  console.log(`[simulator] ${COMMUNITIES.reduce((s, c) => s + c.sensors, 0)} sensors across ${COMMUNITIES.length} communities`);

  // Start ticking every 3 seconds
  const interval = setInterval(() => tick(io), 3000);

  // Initial map overview immediately
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
    scores:        state[c.id].scores,
    composite:     compositeScore(state[c.id].scores),
    onlineSensors: state[c.id].onlineSensors,
  }));
}

export function getCommunity(id) {
  const c = COMMUNITIES.find(c => c.id === Number(id));
  if (!c) return null;
  return {
    ...c,
    scores:        state[c.id].scores,
    composite:     compositeScore(state[c.id].scores),
    onlineSensors: state[c.id].onlineSensors,
    history:       state[c.id].history,
  };
}
