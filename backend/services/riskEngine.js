/**
 * PrimeLink Risk Engine
 * Cross-sector correlation, composite scoring, alert generation
 * Zero IoT — five sectors: health, agriculture, environment, finance, climate
 */

const SECTORS = ['health', 'agriculture', 'environment', 'finance', 'climate'];

// How sectors influence each other (source → target)
const SECTOR_CORRELATIONS = {
  climate:     { agriculture: { delay: 2, weight: 0.7 }, environment: { delay: 1, weight: 0.5 } },
  environment: { agriculture: { delay: 2, weight: 0.5 }, health: { delay: 3, weight: 0.3 } },
  agriculture: { finance: { delay: 1, weight: 0.5 }, health: { delay: 3, weight: 0.3 } },
  health:      { finance: { delay: 2, weight: 0.2 } },
  finance:     { agriculture: { delay: 1, weight: 0.2 } },
};

const ALERT_TEMPLATES = {
  health: {
    drop:     [
      'Clinic utilisation rising in {zone} — capacity approaching 80%',
      'Elevated fever cases reported across {zone} wards',
      'Malnutrition indicators trending upward — {zone}',
    ],
    rise:     [
      'Clinic capacity normalising in {zone}',
      'Community health index recovering — {zone}',
    ],
    critical: [
      'HEALTH CRITICAL: Clinic overflow imminent in {zone}',
      'ALERT: Outbreak pattern detected across {zone} — urgent response needed',
    ],
  },
  agriculture: {
    drop:     [
      'Crop stress indicators rising in {zone} farms',
      'Vegetation index declining — potential yield impact in {zone}',
      'Pest or disease markers detected in {zone} farm clusters',
    ],
    rise:     [
      'Crop health recovering in {zone} — field conditions improving',
      'Harvest forecast revised upward for {zone}',
    ],
    critical: [
      'AGRICULTURE CRITICAL: High crop failure risk in {zone}',
      'ALERT: 40%+ harvest loss projected without intervention in {zone}',
    ],
  },
  environment: {
    drop:     [
      'Soil moisture declining in {zone} — 46% to 38% over 48 hours',
      'Air quality index deteriorating — PM2.5 elevated in {zone}',
      'Water table levels dropping below seasonal average in {zone}',
    ],
    rise:     [
      'Soil conditions improving in {zone} — moisture normalising',
      'Air quality index recovering in {zone}',
    ],
    critical: [
      'ENVIRONMENT CRITICAL: Drought or flood conditions detected in {zone}',
      'ALERT: Extreme environmental readings across {zone}',
    ],
  },
  finance: {
    drop:     [
      'Loan default risk rising among farmers in {zone}',
      'Market activity declining in {zone}',
      'Micro-credit stress: repayment delays increasing in {zone}',
    ],
    rise:     [
      'Financial resilience recovering in {zone}',
      'Loan repayment rates improving — parametric cover active',
    ],
    critical: [
      'FINANCE CRITICAL: Mass default risk in {zone} — intervention required',
      'ALERT: Parametric insurance trigger threshold approaching in {zone}',
    ],
  },
  climate: {
    drop:     [
      'Rainfall 30% below seasonal average in {zone} — drought watch active',
      'Dry conditions persisting — water conservation advised in {zone}',
      'Temperature deviation above normal for {zone}',
    ],
    rise:     [
      'Rainfall recovering in {zone} — seasonal norms approaching',
      'Climate conditions normalising across {zone}',
    ],
    critical: [
      'CLIMATE CRITICAL: Drought risk elevated in {zone} — immediate water conservation required',
      'ALERT: Rainfall 50%+ below average in {zone} — emergency response advised',
    ],
  },
};

const ZONES = ['Kano North', 'Ibadan Central', 'Maiduguri', 'Jos North', 'Enugu East', 'Sokoto Central', 'Port Harcourt', 'Abuja Municipal'];

export function compositeScore(scores) {
  return Math.round(SECTORS.reduce((sum, s) => sum + (scores[s] ?? 70), 0) / SECTORS.length);
}

export function riskLevel(score) {
  if (score >= 80) return { level: 'OPTIMAL',  color: '#00C896', type: 'green' };
  if (score >= 65) return { level: 'STABLE',   color: '#00C896', type: 'green' };
  if (score >= 50) return { level: 'MODERATE', color: '#F5A623', type: 'amber' };
  if (score >= 35) return { level: 'ELEVATED', color: '#F5A623', type: 'amber' };
  return                  { level: 'CRITICAL', color: '#FF3A5C', type: 'red'   };
}

export function detectAlerts(prevScores, nextScores, communityName) {
  const alerts = [];
  for (const sector of SECTORS) {
    const delta = (nextScores[sector] ?? 70) - (prevScores[sector] ?? 70);
    const val   = nextScores[sector] ?? 70;
    const type  = val < 35 ? 'red' : val < 55 ? 'amber' : 'green';

    if (Math.abs(delta) >= 8 || (val < 35 && Math.random() < 0.35)) {
      const which = delta < 0 ? (val < 35 ? 'critical' : 'drop') : 'rise';
      const pool  = ALERT_TEMPLATES[sector][which];
      const text  = pool[Math.floor(Math.random() * pool.length)]
        .replace('{zone}', communityName)
        .replace('{count}', Math.floor(Math.random() * 20) + 5);

      alerts.push({
        id:        `alert-${Date.now()}-${sector}`,
        type,
        sector,
        community: communityName,
        text,
        time:      new Date().toISOString(),
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
