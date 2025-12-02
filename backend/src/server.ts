import Fastify from 'fastify';
import cors from '@fastify/cors';
import { configRoutes } from './routes/config.js';
import { chatRoutes } from './routes/chat.js';

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: true,
});

server.register(configRoutes, { prefix: '/api/config' });
server.register(chatRoutes, { prefix: '/api/chat' });

server.get('/api/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT ?? 3001);
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Backend listening on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

void start();


