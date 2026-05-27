/**
 * PrimeLink Risk Engine
 * Cross-sector correlation, composite scoring, alert generation
 */

const SECTORS = ['environment', 'agriculture', 'health', 'finance', 'iot'];

const SECTOR_CORRELATIONS = {
  environment: { agriculture: { delay: 2, weight: 0.6 }, health: { delay: 4, weight: 0.3 } },
  agriculture: { finance: { delay: 1, weight: 0.5 }, health: { delay: 3, weight: 0.4 } },
  health:      { finance: { delay: 2, weight: 0.3 }, iot:     { delay: 0, weight: 0.1 } },
  finance:     { agriculture: { delay: 1, weight: 0.2 } },
  iot:         { environment: { delay: 0, weight: 0.1 } },
};

const ALERT_TEMPLATES = {
  environment: {
    drop:  ['Soil moisture declining in sensor cluster {zone}', 'Air quality index deteriorating — PM2.5 elevated', 'Water table levels dropping below seasonal average'],
    rise:  ['Soil conditions improving — moisture normalising', 'Air quality index recovering', 'Environmental sensors nominal'],
    critical: ['ENVIRONMENT CRITICAL: Drought/flood conditions detected', 'ALERT: Extreme environmental readings across {zone}'],
  },
  agriculture: {
    drop:  ['Crop stress indicators rising in {zone} farms', 'Vegetation index declining — potential yield impact', 'Pest/disease markers detected in farm clusters'],
    rise:  ['Crop health recovering — field sensors improving', 'Yield forecast revised upward for {zone}'],
    critical: ['AGRICULTURE CRITICAL: Mass crop failure risk detected', 'ALERT: 40%+ harvest loss projected without intervention'],
  },
  health: {
    drop:  ['Clinic utilisation rising — capacity approaching 80%', 'Community health reports: elevated fever cases', 'Malnutrition indicators trending upward'],
    rise:  ['Clinic capacity normalising', 'Community health index recovering'],
    critical: ['HEALTH CRITICAL: Clinic overflow imminent', 'ALERT: Outbreak pattern detected across {zone} wards'],
  },
  finance: {
    drop:  ['Loan default risk rising — flagging {zone} borrowers', 'Market activity declining in {zone}', 'Micro-credit stress: repayment delays increasing'],
    rise:  ['Financial resilience recovering', 'Loan repayment rates improving — {zone}'],
    critical: ['FINANCE CRITICAL: Mass default risk — intervention required', 'ALERT: Parametric trigger threshold approaching'],
  },
  iot: {
    drop:  ['Sensor connectivity degrading — {count} sensors offline', 'IoT network latency elevated', 'Data gaps detected in {zone} sensor mesh'],
    rise:  ['Sensor network recovering — connectivity restored', 'IoT mesh fully operational'],
    critical: ['IOT CRITICAL: Major sensor outage — data blind spot', 'ALERT: {count}+ sensors offline — coverage compromised'],
  },
};

const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Northern Ward', 'Southern Ward'];

function randomTemplate(templates, sector) {
  const pool = templates[Math.random() < 0.15 ? 'critical' : Math.random() < 0.5 ? 'drop' : 'rise'];
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  return tpl
    .replace('{zone}', ZONES[Math.floor(Math.random() * ZONES.length)])
    .replace('{count}', Math.floor(Math.random() * 20) + 5);
}

export function compositeScore(scores) {
  return Math.round(SECTORS.reduce((sum, s) => sum + (scores[s] ?? 70), 0) / SECTORS.length);
}

export function riskLevel(score) {
  if (score >= 80) return { level: 'OPTIMAL',  color: '#00C896', type: 'green' };
  if (score >= 65) return { level: 'STABLE',   color: '#00C896', type: 'green' };
  if (score >= 50) return { level: 'MODERATE', color: '#F5A623', type: 'amber' };
  if (score >= 35) return { level: 'ELEVATED', color: '#F5A623', type: 'amber' };
  return                  { level: 'CRITICAL', color: '#FF3A5C', type: 'red' };
}

export function detectAlerts(prevScores, nextScores, communityName) {
  const alerts = [];
  for (const sector of SECTORS) {
    const delta = (nextScores[sector] ?? 70) - (prevScores[sector] ?? 70);
    const val   = nextScores[sector] ?? 70;
    const type  = val < 35 ? 'red' : val < 55 ? 'amber' : 'green';

    if (Math.abs(delta) >= 8 || (val < 35 && Math.random() < 0.4)) {
      const templateGroup = ALERT_TEMPLATES[sector];
      const which = delta < 0
        ? (val < 35 ? 'critical' : 'drop')
        : 'rise';
      const pool = templateGroup[which];
      const text = pool[Math.floor(Math.random() * pool.length)]
        .replace('{zone}', ZONES[Math.floor(Math.random() * ZONES.length)])
        .replace('{count}', Math.floor(Math.random() * 20) + 5);

      alerts.push({
        id: `alert-${Date.now()}-${sector}`,
        type,
        sector,
        community: communityName,
        text,
        time: new Date().toISOString(),
      });
    }
  }
  return alerts;
}

export function applyCrossCorrelation(scores, prevScores) {
  const next = { ...scores };
  for (const [sourceSector, targets] of Object.entries(SECTOR_CORRELATIONS)) {
    const sourceDelta = (scores[sourceSector] ?? 70) - (prevScores[sourceSector] ?? 70);
    if (Math.abs(sourceDelta) >= 5) {
      for (const [targetSector, { weight }] of Object.entries(targets)) {
        const influence = sourceDelta * weight * (Math.random() * 0.4 + 0.3);
        next[targetSector] = Math.max(5, Math.min(99,
          Math.round((next[targetSector] ?? 70) + influence)
        ));
      }
    }
  }
  return next;
}
