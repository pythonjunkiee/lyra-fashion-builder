import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
import { config } from 'dotenv';

config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy backend/.env.example to backend/.env and fill in your Neon DB URL.');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
