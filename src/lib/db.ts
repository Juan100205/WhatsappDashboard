import { createClient } from "@libsql/client";

export const db = createClient({
  url:       process.env.TURSO_DATABASE_URL ?? "file:vecino-alquila.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let schemaReady = false;

export async function ensureDb() {
  if (schemaReady) return db;

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS clients (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      phone             TEXT UNIQUE NOT NULL,
      created_at        TEXT NOT NULL,
      last_interaction  TEXT NOT NULL,
      message_count     INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id             TEXT PRIMARY KEY,
      client_id      TEXT NOT NULL,
      role           TEXT NOT NULL,
      type           TEXT NOT NULL DEFAULT 'text',
      message        TEXT NOT NULL DEFAULT '',
      transcription  TEXT,
      timestamp      TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id                TEXT PRIMARY KEY,
      client_id         TEXT NOT NULL,
      date              TEXT NOT NULL,
      status            TEXT NOT NULL DEFAULT 'scheduled',
      calendar_event_id TEXT DEFAULT '',
      notes             TEXT DEFAULT '',
      created_at        TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id           TEXT PRIMARY KEY,
      type         TEXT NOT NULL,
      client_phone TEXT NOT NULL DEFAULT '',
      timestamp    TEXT NOT NULL
    );
  `);

  schemaReady = true;
  return db;
}
