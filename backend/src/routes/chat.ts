import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

const chatRequestSchema = z.object({
  message: z.string().min(1),
});

export async function chatRoutes(server: FastifyInstance) {
  server.post('/', async (request, reply) => {
    const parseResult = chatRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid payload' });
    }

    const { message } = parseResult.data;

    // Placeholder: later this will call the local LLM + tools pipeline.
    // For now, echo back with a stub.
    return {
      reply: `You said: "${message}". AI pipeline not wired yet, but backend is ready.`,
    };
  });
}


