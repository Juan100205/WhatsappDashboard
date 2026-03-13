import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { randomUUID } from "crypto";

// ─── POST: recibe mensajes ya procesados desde n8n ────────────────
// Payload esperado:
// { phone, name, message, reply, type }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const contact = body?.ContactInfo?.[0];
  const msg     = body?.MensajeInfo?.[0];

  const phone   = msg?.from ?? body?.phone;
  const name    = contact?.profile?.name ?? body?.name ?? "Cliente";
  const message = msg?.text?.body ?? body?.message;
  const reply   = body?.Output ?? body?.reply;
  const type    = msg?.type ?? body?.type ?? "text";

  if (!phone || !message) {
    return NextResponse.json({ error: "phone y message son requeridos" }, { status: 400 });
  }

  try {
    const now = new Date().toISOString();

    // 1. Upsert cliente
    const existing = db
      .prepare("SELECT id FROM clients WHERE phone = ?")
      .get(phone) as { id: string } | undefined;

    let clientId: string;

    if (existing) {
      clientId = existing.id;
      db.prepare(
        "UPDATE clients SET name = ?, last_interaction = ?, message_count = message_count + 1 WHERE id = ?"
      ).run(name ?? "Cliente", now, clientId);
    } else {
      clientId = randomUUID();
      db.prepare(
        "INSERT INTO clients (id, name, phone, created_at, last_interaction, message_count) VALUES (?, ?, ?, ?, ?, 1)"
      ).run(clientId, name ?? "Cliente", phone, now, now);
    }

    // 2. Guardar mensaje del usuario
    db.prepare(
      "INSERT INTO messages (id, client_id, role, type, message, timestamp) VALUES (?, ?, 'user', ?, ?, ?)"
    ).run(randomUUID(), clientId, type, message, now);

    db.prepare(
      "INSERT INTO analytics_events (id, type, client_phone, timestamp) VALUES (?, 'message_received', ?, ?)"
    ).run(randomUUID(), phone, now);

    // 3. Guardar respuesta del asistente (si viene)
    if (reply) {
      db.prepare(
        "INSERT INTO messages (id, client_id, role, type, message, timestamp) VALUES (?, ?, 'assistant', 'text', ?, ?)"
      ).run(randomUUID(), clientId, reply, now);

      db.prepare(
        "INSERT INTO analytics_events (id, type, client_phone, timestamp) VALUES (?, 'message_sent', ?, ?)"
      ).run(randomUUID(), phone, now);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
