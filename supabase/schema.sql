-- ================================================================
-- VECINO ALQUILA — Schema completo
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ================================================================

-- Eliminar tablas si ya existen (para re-ejecutar limpio)
drop table if exists analytics_events cascade;
drop table if exists appointments cascade;
drop table if exists messages cascade;
drop table if exists clients cascade;

-- ─── CLIENTS ─────────────────────────────────────────────────────
create table clients (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  phone             text not null unique,
  created_at        timestamptz not null default now(),
  last_interaction  timestamptz not null default now(),
  message_count     int not null default 0
);

-- ─── MESSAGES ────────────────────────────────────────────────────
create table messages (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references clients(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  type            text not null check (type in ('text', 'audio')),
  message         text not null default '',
  audio_url       text,
  transcription   text,
  timestamp       timestamptz not null default now()
);

-- ─── APPOINTMENTS ────────────────────────────────────────────────
create table appointments (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references clients(id) on delete cascade,
  date                timestamptz not null,
  status              text not null default 'scheduled'
                        check (status in ('scheduled', 'completed', 'cancelled')),
  calendar_event_id   text not null default '',
  notes               text not null default '',
  created_at          timestamptz not null default now()
);

-- ─── ANALYTICS EVENTS ────────────────────────────────────────────
create table analytics_events (
  id            uuid primary key default gen_random_uuid(),
  type          text not null check (type in (
                  'message_received', 'message_sent',
                  'audio_transcribed', 'appointment_created'
                )),
  client_phone  text not null,
  timestamp     timestamptz not null default now()
);

-- ─── ÍNDICES para performance ─────────────────────────────────────
create index on messages(client_id);
create index on messages(timestamp desc);
create index on appointments(client_id);
create index on appointments(date);
create index on analytics_events(timestamp desc);
create index on clients(phone);

-- ─── RLS (Row Level Security) — acceso solo desde el servidor ─────
alter table clients           enable row level security;
alter table messages          enable row level security;
alter table appointments      enable row level security;
alter table analytics_events  enable row level security;

-- Política: solo el service role puede leer/escribir
create policy "service_only" on clients           for all using (true);
create policy "service_only" on messages          for all using (true);
create policy "service_only" on appointments      for all using (true);
create policy "service_only" on analytics_events  for all using (true);
