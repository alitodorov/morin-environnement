// Script pour pousser le schéma Payload vers Neon via Drizzle
// Usage: node scripts/push-schema.mjs

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false }
})

// SQL minimal pour créer les tables Payload de base
const sql = `
-- Tables de base Payload CMS
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "email" varchar NOT NULL,
  "reset_password_token" varchar,
  "reset_password_expiration" timestamp(3) with time zone,
  "salt" varchar,
  "hash" varchar,
  "login_attempts" numeric DEFAULT 0,
  "lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "users_sessions" (
  "_order" integer NOT NULL,
  "_parent_id" uuid NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp(3) with time zone NOT NULL,
  FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_sessions_order_parent_idx" ON "users_sessions" ("_order", "_parent_id");
`

const client = await pool.connect()
try {
  await client.query(sql)
  console.log('✅ Schema pushed successfully')
} catch (err) {
  console.error('Error:', err.message)
  process.exit(1)
} finally {
  client.release()
  await pool.end()
}
