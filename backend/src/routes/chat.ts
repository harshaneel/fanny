import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { chatWithLocalLLM } from '../services/llm.js';

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

    try {
      const replyText = await chatWithLocalLLM(message);
      return { reply: replyText };
    } catch (err) {
      request.log.error({ err }, 'LLM call failed');
      return reply.status(500).send({ error: 'LLM unavailable. Is Ollama running locally?' });
    }
  });
}


