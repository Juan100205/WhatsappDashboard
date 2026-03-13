import { NextRequest, NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { randomUUID } from "crypto";

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
    const db  = await ensureDb();
    const now = new Date().toISOString();

    // 1. Upsert cliente
    const existing = await db.execute({ sql: "SELECT id FROM clients WHERE phone = ?", args: [phone] });

    let clientId: string;

    if (existing.rows.length > 0) {
      clientId = existing.rows[0].id as string;
      await db.execute({
        sql:  "UPDATE clients SET name = ?, last_interaction = ?, message_count = message_count + 1 WHERE id = ?",
        args: [name, now, clientId],
      });
    } else {
      clientId = randomUUID();
      await db.execute({
        sql:  "INSERT INTO clients (id, name, phone, created_at, last_interaction, message_count) VALUES (?, ?, ?, ?, ?, 1)",
        args: [clientId, name, phone, now, now],
      });
    }

    // 2. Guardar mensaje del usuario
    await db.execute({
      sql:  "INSERT INTO messages (id, client_id, role, type, message, timestamp) VALUES (?, ?, 'user', ?, ?, ?)",
      args: [randomUUID(), clientId, type, message, now],
    });

    await db.execute({
      sql:  "INSERT INTO analytics_events (id, type, client_phone, timestamp) VALUES (?, 'message_received', ?, ?)",
      args: [randomUUID(), phone, now],
    });

    // 3. Guardar respuesta del asistente
    if (reply) {
      await db.execute({
        sql:  "INSERT INTO messages (id, client_id, role, type, message, timestamp) VALUES (?, ?, 'assistant', 'text', ?, ?)",
        args: [randomUUID(), clientId, reply, now],
      });

      await db.execute({
        sql:  "INSERT INTO analytics_events (id, type, client_phone, timestamp) VALUES (?, 'message_sent', ?, ?)",
        args: [randomUUID(), phone, now],
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
