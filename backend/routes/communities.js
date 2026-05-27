import { Router } from 'express';
import { getCommunities, getCommunity } from '../services/sensorSimulator.js';

const router = Router();

// GET /api/communities
router.get('/', (req, res) => {
  res.json({ success: true, data: getCommunities() });
});

// GET /api/communities/:id
router.get('/:id', (req, res) => {
  const community = getCommunity(req.params.id);
  if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
  res.json({ success: true, data: community });
});

export default router;
