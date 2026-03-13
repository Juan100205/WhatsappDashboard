import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const rows = db.prepare(`
    SELECT
      a.id, a.client_id, a.date, a.status, a.calendar_event_id, a.notes,
      c.name  AS client_name,
      c.phone AS client_phone
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    ORDER BY a.date ASC
  `).all();

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { client_id, date, notes, calendar_event_id, client_phone } = body;

  if (!client_id || !date) {
    return NextResponse.json({ error: "client_id y date son requeridos" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const id  = randomUUID();

  db.prepare(
    "INSERT INTO appointments (id, client_id, date, notes, calendar_event_id, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, client_id, date, notes ?? "", calendar_event_id ?? "", now);

  db.prepare(
    "INSERT INTO analytics_events (id, type, client_phone, timestamp) VALUES (?, 'appointment_created', ?, ?)"
  ).run(randomUUID(), client_phone ?? "", now);

  const appointment = db.prepare("SELECT * FROM appointments WHERE id = ?").get(id);

  return NextResponse.json(appointment, { status: 201 });
}
