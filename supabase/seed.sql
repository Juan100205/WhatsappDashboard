-- ================================================================
-- VECINO ALQUILA — Datos de prueba
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ================================================================

-- Limpiar datos existentes (sin borrar tablas)
truncate table analytics_events restart identity cascade;
truncate table appointments     restart identity cascade;
truncate table messages         restart identity cascade;
truncate table clients          restart identity cascade;

-- ─── CLIENTS ─────────────────────────────────────────────────────
insert into clients (id, name, phone, created_at, last_interaction, message_count) values
  ('11111111-0000-0000-0000-000000000001', 'Juan García',      '+573001234567', '2024-11-01T10:00:00Z', '2024-12-15T14:32:00Z', 24),
  ('11111111-0000-0000-0000-000000000002', 'María López',      '+573009876543', '2024-11-10T09:00:00Z', '2024-12-15T09:15:00Z', 12),
  ('11111111-0000-0000-0000-000000000003', 'Carlos Ruiz',      '+573005551234', '2024-11-20T11:00:00Z', '2024-12-14T16:45:00Z',  8),
  ('11111111-0000-0000-0000-000000000004', 'Ana Martínez',     '+573007778899', '2024-12-01T08:00:00Z', '2024-12-13T11:20:00Z', 31),
  ('11111111-0000-0000-0000-000000000005', 'Pedro Sánchez',    '+573002223344', '2024-12-05T14:00:00Z', '2024-12-12T17:00:00Z',  5),
  ('11111111-0000-0000-0000-000000000006', 'Valentina Torres', '+573006667788', '2024-12-08T10:00:00Z', '2024-12-16T08:45:00Z', 18);

-- ─── MESSAGES — Juan García ──────────────────────────────────────
insert into messages (client_id, role, type, message, timestamp) values
  ('11111111-0000-0000-0000-000000000001', 'user',      'text', 'Hola, buenas tardes. Quiero información sobre apartamentos en arriendo.', '2024-12-15T14:00:00Z'),
  ('11111111-0000-0000-0000-000000000001', 'assistant', 'text', '¡Hola Juan! Claro, con gusto te ayudo. ¿En qué zona de la ciudad estás buscando?', '2024-12-15T14:00:30Z'),
  ('11111111-0000-0000-0000-000000000001', 'user',      'text', 'En el norte, cerca de la calle 100', '2024-12-15T14:01:00Z'),
  ('11111111-0000-0000-0000-000000000001', 'assistant', 'text', 'Perfecto, tenemos varias opciones disponibles en esa zona. ¿Cuántas habitaciones necesitas?', '2024-12-15T14:01:20Z'),
  ('11111111-0000-0000-0000-000000000001', 'user',      'audio', '', '2024-12-15T14:02:00Z'),
  ('11111111-0000-0000-0000-000000000001', 'assistant', 'text', 'Entendido. Tengo un apartamento de 2 habitaciones en la calle 97 con carrera 15, parqueadero incluido, por $1.180.000. ¿Te gustaría agendar una visita?', '2024-12-15T14:02:30Z'),
  ('11111111-0000-0000-0000-000000000001', 'user',      'text', 'Sí, me interesa. ¿Puedo verlo el jueves?', '2024-12-15T14:03:00Z'),
  ('11111111-0000-0000-0000-000000000001', 'assistant', 'text', 'Por supuesto. He agendado tu visita para el jueves 19 de diciembre a las 3:00 PM. ¡Te esperamos!', '2024-12-15T14:03:30Z');

-- Actualizar transcripción del audio de Juan
update messages
set transcription = 'Necesito un apartamento de dos habitaciones, preferiblemente con parqueadero y que no supere el millón doscientos.'
where client_id = '11111111-0000-0000-0000-000000000001' and type = 'audio';

-- ─── MESSAGES — María López ──────────────────────────────────────
insert into messages (client_id, role, type, message, timestamp) values
  ('11111111-0000-0000-0000-000000000002', 'user',      'text',  'Buenos días, ¿tienen casas disponibles en Chapinero?', '2024-12-15T09:00:00Z'),
  ('11111111-0000-0000-0000-000000000002', 'assistant', 'text',  '¡Buenos días María! Sí, tenemos algunas opciones en Chapinero. ¿Cuál es tu presupuesto aproximado?', '2024-12-15T09:00:45Z'),
  ('11111111-0000-0000-0000-000000000002', 'user',      'audio', '', '2024-12-15T09:01:30Z'),
  ('11111111-0000-0000-0000-000000000002', 'assistant', 'text',  'Tengo justo lo que buscas. Una casa de 3 habitaciones con terraza en Chapinero Alto por $1.950.000. ¿Agendamos una visita?', '2024-12-15T09:02:00Z'),
  ('11111111-0000-0000-0000-000000000002', 'user',      'text',  'Sí, me gustaría verla esta semana si es posible.', '2024-12-15T09:03:00Z'),
  ('11111111-0000-0000-0000-000000000002', 'assistant', 'text',  'Perfecto, quedamos para el miércoles 18 a las 10:00 AM. Te envío la dirección exacta al confirmar.', '2024-12-15T09:03:30Z');

update messages
set transcription = 'Mi presupuesto es de dos millones de pesos. Necesito mínimo tres habitaciones y patio o terraza.'
where client_id = '11111111-0000-0000-0000-000000000002' and type = 'audio';

-- ─── MESSAGES — Carlos Ruiz ──────────────────────────────────────
insert into messages (client_id, role, type, message, timestamp) values
  ('11111111-0000-0000-0000-000000000003', 'user',      'text', 'Hola, vi su anuncio en internet. ¿El apartamento de la 72 sigue disponible?', '2024-12-14T16:40:00Z'),
  ('11111111-0000-0000-0000-000000000003', 'assistant', 'text', '¡Hola Carlos! Sí, ese apartamento sigue disponible. ¿Quieres que te cuente más detalles?', '2024-12-14T16:40:30Z'),
  ('11111111-0000-0000-0000-000000000003', 'user',      'text', 'Sí por favor, ¿cuánto vale y qué incluye?', '2024-12-14T16:41:00Z'),
  ('11111111-0000-0000-0000-000000000003', 'assistant', 'text', 'El apartamento de la calle 72 tiene 2 habitaciones, sala-comedor, cocina integral y parqueadero. Valor: $1.350.000/mes. ¿Te interesa agendarlo?', '2024-12-14T16:42:00Z');

-- ─── MESSAGES — Ana Martínez ─────────────────────────────────────
insert into messages (client_id, role, type, message, timestamp) values
  ('11111111-0000-0000-0000-000000000004', 'user',      'text', '¡Hola! Ya hice la visita al apartamento de Rosales. Me gustó mucho, ¿cómo sigo el proceso?', '2024-12-13T11:00:00Z'),
  ('11111111-0000-0000-0000-000000000004', 'assistant', 'text', '¡Qué bueno Ana! Para continuar necesitamos fotocopia de tu cédula, desprendibles de nómina de los últimos 3 meses y referencias personales. ¿Los tienes a mano?', '2024-12-13T11:01:00Z'),
  ('11111111-0000-0000-0000-000000000004', 'user',      'text', 'Sí, los consigo hoy mismo y los envío mañana.', '2024-12-13T11:05:00Z'),
  ('11111111-0000-0000-0000-000000000004', 'assistant', 'text', 'Perfecto, en cuanto los recibamos iniciamos el estudio de crédito. El proceso toma 2-3 días hábiles.', '2024-12-13T11:06:00Z');

-- ─── MESSAGES — Valentina Torres ─────────────────────────────────
insert into messages (client_id, role, type, message, timestamp) values
  ('11111111-0000-0000-0000-000000000006', 'user',      'text', 'Buenas noches, busco algo pequeño para una persona, estudio o apartaestudio.', '2024-12-16T08:00:00Z'),
  ('11111111-0000-0000-0000-000000000006', 'assistant', 'text', '¡Hola Valentina! Tenemos varios apartaestudios disponibles. ¿En qué sector de la ciudad prefieres?', '2024-12-16T08:01:00Z'),
  ('11111111-0000-0000-0000-000000000006', 'user',      'text', 'Cerca a la Universidad de Los Andes o La Candelaria', '2024-12-16T08:02:00Z'),
  ('11111111-0000-0000-0000-000000000006', 'assistant', 'text', 'Tenemos un apartaestudio en La Macarena, 35m², completamente amoblado, $1.100.000/mes. ¿Te interesa verlo?', '2024-12-16T08:03:00Z'),
  ('11111111-0000-0000-0000-000000000006', 'user',      'text', '¡Sí! ¿Cuándo puedo visitarlo?', '2024-12-16T08:04:00Z'),
  ('11111111-0000-0000-0000-000000000006', 'assistant', 'text', 'Podemos coordinar para mañana viernes o el lunes. ¿Cuál te queda mejor?', '2024-12-16T08:05:00Z');

-- ─── APPOINTMENTS ─────────────────────────────────────────────────
insert into appointments (client_id, date, status, calendar_event_id, notes) values
  ('11111111-0000-0000-0000-000000000001', '2024-12-19T15:00:00Z', 'scheduled',  'gcal_001', 'Visita apartamento calle 97 #15-32. 2 hab, parqueadero. Cliente muy interesado.'),
  ('11111111-0000-0000-0000-000000000002', '2024-12-18T10:00:00Z', 'scheduled',  'gcal_002', 'Visita casa Chapinero Alto. 3 hab, terraza. Presupuesto $2M.'),
  ('11111111-0000-0000-0000-000000000004', '2024-12-10T14:00:00Z', 'completed',  'gcal_003', 'Visita apartamento Rosales. Cliente muy interesada, inició proceso de documentos.'),
  ('11111111-0000-0000-0000-000000000005', '2024-12-12T09:00:00Z', 'cancelled',  'gcal_004', 'No confirmó asistencia. Intentar reagendar.'),
  ('11111111-0000-0000-0000-000000000003', '2024-12-20T11:00:00Z', 'scheduled',  'gcal_005', 'Visita apartamento calle 72. 2 hab, cocina integral.'),
  ('11111111-0000-0000-0000-000000000006', '2024-12-20T16:00:00Z', 'scheduled',  'gcal_006', 'Visita apartaestudio La Macarena. 35m², amoblado.');

-- ─── ANALYTICS EVENTS ────────────────────────────────────────────
insert into analytics_events (type, client_phone, timestamp) values
  ('message_received',    '+573001234567', '2024-12-15T14:00:00Z'),
  ('message_sent',        '+573001234567', '2024-12-15T14:00:30Z'),
  ('message_received',    '+573001234567', '2024-12-15T14:01:00Z'),
  ('message_sent',        '+573001234567', '2024-12-15T14:01:20Z'),
  ('audio_transcribed',   '+573001234567', '2024-12-15T14:02:00Z'),
  ('message_sent',        '+573001234567', '2024-12-15T14:02:30Z'),
  ('message_received',    '+573001234567', '2024-12-15T14:03:00Z'),
  ('appointment_created', '+573001234567', '2024-12-15T14:03:30Z'),
  ('message_received',    '+573009876543', '2024-12-15T09:00:00Z'),
  ('message_sent',        '+573009876543', '2024-12-15T09:00:45Z'),
  ('audio_transcribed',   '+573009876543', '2024-12-15T09:01:30Z'),
  ('message_sent',        '+573009876543', '2024-12-15T09:02:00Z'),
  ('appointment_created', '+573009876543', '2024-12-15T09:03:30Z'),
  ('message_received',    '+573005551234', '2024-12-14T16:40:00Z'),
  ('message_sent',        '+573005551234', '2024-12-14T16:40:30Z'),
  ('message_received',    '+573005551234', '2024-12-14T16:41:00Z'),
  ('message_sent',        '+573005551234', '2024-12-14T16:42:00Z'),
  ('appointment_created', '+573005551234', '2024-12-14T16:43:00Z'),
  ('message_received',    '+573007778899', '2024-12-13T11:00:00Z'),
  ('message_sent',        '+573007778899', '2024-12-13T11:01:00Z'),
  ('appointment_created', '+573007778899', '2024-12-10T14:00:00Z'),
  ('message_received',    '+573006667788', '2024-12-16T08:00:00Z'),
  ('message_sent',        '+573006667788', '2024-12-16T08:01:00Z'),
  ('message_received',    '+573006667788', '2024-12-16T08:02:00Z'),
  ('message_sent',        '+573006667788', '2024-12-16T08:03:00Z'),
  ('appointment_created', '+573006667788', '2024-12-16T08:05:00Z');
