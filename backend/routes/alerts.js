import { Router } from 'express';
import { getCommunities } from '../services/sensorSimulator.js';
import { riskLevel } from '../services/riskEngine.js';

const router = Router();

// In-memory recent alerts store (last 100)
const recentAlerts = [];

export function pushAlert(alert) {
  recentAlerts.unshift(alert);
  if (recentAlerts.length > 100) recentAlerts.pop();
}

// GET /api/alerts
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  res.json({ success: true, data: recentAlerts.slice(0, limit) });
});

// GET /api/status  — overall system health snapshot
router.get('/status', (req, res) => {
  const communities = getCommunities();
  const critical    = communities.filter(c => c.composite < 35);
  const elevated    = communities.filter(c => c.composite >= 35 && c.composite < 50);
  const totalSensors = communities.reduce((s, c) => s + c.totalSensors, 0);
  const onlineSensors = communities.reduce((s, c) => s + c.onlineSensors, 0);

  res.json({
    success: true,
    data: {
      totalCommunities: communities.length,
      criticalCount:    critical.length,
      elevatedCount:    elevated.length,
      stableCount:      communities.length - critical.length - elevated.length,
      totalSensors,
      onlineSensors,
      sensorHealth:     Math.round((onlineSensors / totalSensors) * 100),
      recentAlertCount: recentAlerts.length,
      timestamp:        new Date().toISOString(),
    },
  });
});

export default router;
