/**
 * Run this once to enable Row Level Security on all tables.
 *
 *   npm run db:rls
 *
 * What this does:
 *  - Enables RLS on every table so no row is readable/writable by default.
 *  - Forces RLS even for the table owner (FORCE ROW LEVEL SECURITY), so the
 *    backend service role must explicitly match a policy.
 *  - Creates a permissive "backend_access" policy for the role derived from
 *    DATABASE_URL, granting it full access — all access still flows through
 *    the API layer with its own auth checks.
 *  - Any other role (e.g. a leaked read-only connection, a Neon console query
 *    from a different role) will see no rows and cannot write anything.
 *
 * Safe to re-run: drops existing policies before recreating them.
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL env var is required');

const sql = neon(DATABASE_URL);

const TABLES = ['categories', 'products', 'clients', 'client_purchases'] as const;

async function main() {
  const [{ current_user: dbRole }] = await sql('SELECT current_user') as [{ current_user: string }];
  console.log(`Configuring RLS for database role: ${dbRole}\n`);

  for (const table of TABLES) {
    // Enable RLS — no row accessible unless a policy permits it
    await sql(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`);

    // Force RLS for the table owner too (without this, owners bypass RLS)
    await sql(`ALTER TABLE ${table} FORCE ROW LEVEL SECURITY`);

    // Drop any existing backend_access policy so we can recreate it cleanly
    await sql(`DROP POLICY IF EXISTS backend_access ON ${table}`);

    // Grant full access to the backend service role
    await sql(
      `CREATE POLICY backend_access ON ${table} TO "${dbRole}" USING (true) WITH CHECK (true)`,
    );

    console.log(`  ✓ ${table}`);
  }

  console.log('\nRLS enabled on all tables.');
}

main().catch((err) => {
  console.error('RLS setup failed:', err);
  process.exit(1);
});
