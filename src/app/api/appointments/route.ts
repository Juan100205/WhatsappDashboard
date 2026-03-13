import { NextRequest, NextResponse } from "next/server";
import { ensureDb, serializeRows } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const db   = await ensureDb();
  const rows = await db.execute(`
    SELECT
      a.id, a.client_id, a.date, a.status, a.calendar_event_id, a.notes,
      c.name  AS client_name,
      c.phone AS client_phone
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    ORDER BY a.date ASC
  `);
  return NextResponse.json(serializeRows(rows.rows as Record<string, unknown>[]));

}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, date, notes, calendar_event_id, client_phone } = body;

  if (!client_id || !date) {
    return NextResponse.json({ error: "client_id y date son requeridos" }, { status: 400 });
  }

  const db  = await ensureDb();
  const now = new Date().toISOString();
  const id  = randomUUID();

  await db.execute({
    sql:  "INSERT INTO appointments (id, client_id, date, notes, calendar_event_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    args: [id, client_id, date, notes ?? "", calendar_event_id ?? "", now],
  });

  await db.execute({
    sql:  "INSERT INTO analytics_events (id, type, client_phone, timestamp) VALUES (?, 'appointment_created', ?, ?)",
    args: [randomUUID(), client_phone ?? "", now],
  });

  const result = await db.execute({ sql: "SELECT * FROM appointments WHERE id = ?", args: [id] });
  return NextResponse.json(result.rows[0], { status: 201 });
}
