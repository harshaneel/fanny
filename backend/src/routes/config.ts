import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

type AppConfig = {
  documentsDir: string | null;
};

async function readConfig(): Promise<AppConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw) as AppConfig;
  } catch {
    return { documentsDir: null };
  }
}

async function writeConfig(config: AppConfig): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

const updateConfigSchema = z.object({
  documentsDir: z.string().min(1),
});

export async function configRoutes(server: FastifyInstance) {
  server.get('/', async () => {
    return await readConfig();
  });

  server.post('/', async (request, reply) => {
    const parseResult = updateConfigSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Invalid payload' });
    }

    const { documentsDir } = parseResult.data;
    const resolved = path.resolve(documentsDir);
    const stat = await fs
      .stat(resolved)
      .catch(() => null);

    if (!stat || !stat.isDirectory()) {
      return reply.status(400).send({ error: 'documentsDir must be an existing directory' });
    }

    await writeConfig({ documentsDir: resolved });
    return { documentsDir: resolved };
  });
}


