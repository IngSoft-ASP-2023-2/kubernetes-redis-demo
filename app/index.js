const express = require('express');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let redisClient;

async function initRedis() {
  redisClient = redis.createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT
    }
  });

  redisClient.on('error', (err) => console.error('Redis error:', err));
  redisClient.on('connect', () => console.log('Conectado a Redis'));

  await redisClient.connect();
}

app.get('/', async (req, res) => {
  try {
    const visits = await redisClient.get('visits');
    const count = visits ? parseInt(visits) + 1 : 1;
    await redisClient.set('visits', count);

    res.json({
      message: 'Demo Kubernetes + Redis',
      visits: count,
      pod: process.env.HOSTNAME || 'local',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error conectando a Redis',
      details: error.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', pod: process.env.HOSTNAME });
});

app.get('/reset', async (req, res) => {
  try {
    await redisClient.set('visits', 0);
    res.json({ message: 'Contador reseteado', visits: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initRedis().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Conectado a Redis en ${REDIS_HOST}:${REDIS_PORT}`);
  });
}).catch(err => {
  console.error('Error iniciando aplicación:', err);
  process.exit(1);
});
