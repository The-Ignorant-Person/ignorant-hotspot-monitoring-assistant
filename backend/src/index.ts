import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import keywordsRouter from './routes/keywords.js';
import hotspotsRouter from './routes/hotspots.js';
import trendsRouter from './routes/trends.js';
import settingsRouter from './routes/settings.js';
import scanRouter, { setScanBroadcast } from './routes/scan.js';
import { initScheduler } from './lib/scheduler.js';
import db from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/keywords', keywordsRouter);
app.use('/api/hotspots', hotspotsRouter);
app.use('/api/trends', trendsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/scan', scanRouter);

// Health check
app.get('/api/status', (_req, res) => {
  const totalHotspots = (db.prepare('SELECT COUNT(*) as count FROM hotspots').get() as any).count;
  const activeKeywords = (db.prepare('SELECT COUNT(*) as count FROM keywords WHERE active = 1').get() as any).count;
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    totalHotspots,
    activeKeywords,
  });
});

// Create HTTP server and attach WebSocket
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

// WebSocket heartbeat
function heartbeat(this: WebSocket & { isAlive?: boolean }) {
  this.isAlive = true;
}

wss.on('connection', (ws: WebSocket & { isAlive?: boolean }) => {
  ws.isAlive = true;
  ws.on('error', console.error);
  ws.on('pong', heartbeat);

  ws.send(JSON.stringify({ type: 'connected', data: { message: '信号站已连接' } }));
});

// Ping all clients every 30s
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as WebSocket & { isAlive?: boolean };
    if (client.isAlive === false) return client.terminate();
    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on('close', () => clearInterval(heartbeatInterval));

// Broadcast helper
export function broadcast(event: { type: string; data: unknown }) {
  const msg = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// Wire broadcast into scan route (avoids circular import)
setScanBroadcast(broadcast);

server.listen(PORT, () => {
  console.log(`🛰️  信号站后端已启动: http://localhost:${PORT}`);
  console.log(`📡 WebSocket 已就绪: ws://localhost:${PORT}/ws`);
  initScheduler(broadcast);
});
