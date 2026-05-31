import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import communitiesRouter from './routes/communities.js';
import alertsRouter, { pushAlert } from './routes/alerts.js';
import { startSimulator } from './services/sensorSimulator.js';

const app    = express();
const server = createServer(app);
const PORT   = process.env.PORT || 4000;

// ─── Socket.io ───────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL         || 'http://localhost:5173',
  'https://primelink-frontend.onrender.com',
  'https://jothankato05.github.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5177',
  'http://localhost:4173',
];

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'] },
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    service: 'PrimeLink API',
    version: '1.0.0',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/communities', communitiesRouter);
app.use('/api/alerts',      alertsRouter);

// ─── Socket.io connections ───────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // Send welcome payload
  socket.emit('connected', {
    message: 'PrimeLink live feed connected',
    timestamp: new Date().toISOString(),
  });

  // Client can subscribe to a specific community
  socket.on('subscribe:community', (communityId) => {
    socket.join(`community:${communityId}`);
    console.log(`   ${socket.id} subscribed to community ${communityId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});

// Forward alerts to in-memory store so REST /api/alerts stays fresh
io.on('alert:new', (alert) => pushAlert(alert));

// ─── Start ────────────────────────────────────────────────────────────────────
startSimulator(io);

server.listen(PORT, () => {
  console.log('');
  console.log('PrimeLink API running');
  console.log(`  http://localhost:${PORT}`);
  console.log('  Socket.io + REST + IoT Sensor Simulator');
  console.log('');
});
