import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';

import app, { ALLOWED_ORIGINS } from './app.js';
import { startSimulator } from './services/sensorSimulator.js';

const server = createServer(app);
const PORT = process.env.PORT || 4000;

// Live push for long-running hosts. Serverless hosts serve the same data through GET /api/live.
const io = new Server(server, { cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'] } });
io.on('connection', (socket) => {
  socket.emit('connected', { message: 'PrimeLink live feed connected', timestamp: new Date().toISOString() });
  socket.on('subscribe:community', (communityId) => socket.join(`community:${communityId}`));
});

startSimulator(io);

server.listen(PORT, () => console.log(`PrimeLink API on http://localhost:${PORT} (REST + Socket.io)`));
