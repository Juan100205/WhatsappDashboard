-- ================================================================
-- Funciones auxiliares — ejecutar en SQL Editor después del schema
-- ================================================================

-- Incrementa message_count del cliente por phone
create or replace function increment_message_count(client_phone text)
returns void as $$
  update clients
  set message_count    = message_count + 1,
      last_interaction = now()
  where phone = client_phone;
$$ language sql;
