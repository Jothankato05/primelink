// The PrimeLink REST API as a plain Express app. server.js adds Socket.io and listens (long-running
// hosts); api/index.js exports it as a Vercel function. Both serve the same deterministic live data.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import communitiesRouter from './routes/communities.js';
import alertsRouter from './routes/alerts.js';
import { getCommunities, getRecentAlerts, currentTick, TICK_MS } from './services/sensorSimulator.js';

export const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://primelink.primersgroup.ng',
  'https://primelink-frontend.onrender.com',
  'https://jothankato05.github.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5177',
  'http://localhost:4173',
];

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false }));

const started = Date.now();
app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    service: 'PrimeLink API',
    version: '1.1.0',
    uptime: Math.round((Date.now() - started) / 1000),
    timestamp: new Date().toISOString(),
  });
});

// Everything a live dashboard needs in one poll (for hosts without sockets): overview + new alerts.
app.get('/api/live', (req, res) => {
  const tick = currentTick();
  res.set('Cache-Control', `public, max-age=${Math.floor(TICK_MS / 1000)}`);
  res.json({
    success: true,
    tick,
    nextUpdateInMs: (tick + 1) * TICK_MS - Date.now(),
    overview: getCommunities().map(({ id, name, state, composite, scores }) => ({ id, name, state, composite, scores })),
    alerts: getRecentAlerts(Math.min(parseInt(req.query.alerts, 10) || 10, 50)),
  });
});

app.use('/api/communities', communitiesRouter);
app.use('/api/alerts', alertsRouter);

app.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Something went wrong' });
});

export default app;
