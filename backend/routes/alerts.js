import { Router } from 'express';
import { getCommunities, getRecentAlerts } from '../services/sensorSimulator.js';
import { riskLevel } from '../services/riskEngine.js';

const router = Router();

// GET /api/alerts
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  res.json({ success: true, data: getRecentAlerts(limit) });
});

// GET /api/status  — overall system health snapshot
router.get('/status', (req, res) => {
  const communities = getCommunities();
  const critical    = communities.filter(c => c.composite < 35);
  const elevated    = communities.filter(c => c.composite >= 35 && c.composite < 50);
  // Data sources per community: its clinics plus field reporters (one per 500 farms).
  const totalSensors = communities.reduce((s, c) => s + c.clinics + Math.ceil(c.farms / 500), 0);
  const onlineSensors = totalSensors;

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
      recentAlertCount: getRecentAlerts(100).length,
      timestamp:        new Date().toISOString(),
    },
  });
});

export default router;
