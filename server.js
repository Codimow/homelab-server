import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const devices = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/devices', (req, res) => {
  res.json(Array.from(devices.values()));
});

io.on('connection', (socket) => {
  socket.on('device-status', (data) => {
    devices.set(data.id, { ...data, lastSeen: Date.now(), online: true });
    io.emit('devices', Array.from(devices.values()));
  });
  socket.on('disconnect', () => {
    // Optionally handle device disconnects
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 