import { serve } from '@hono/node-server';
import { config } from 'dotenv';

config();

import app from './app';

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  console.log(`\n🌸 Lyra backend running → http://localhost:${port}`);
  console.log(`   Health check: http://localhost:${port}/api/health\n`);
});
