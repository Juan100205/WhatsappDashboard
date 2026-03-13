import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const events      = db.prepare("SELECT * FROM analytics_events WHERE timestamp >= ? ORDER BY timestamp DESC").all(sevenDaysAgo) as { type: string; timestamp: string; client_phone: string }[];
  const clients     = db.prepare("SELECT COUNT(*) as count FROM clients").get() as { count: number };
  const appointments = db.prepare("SELECT status FROM appointments").all() as { status: string }[];

  // Agrupar por día
  const byDay: Record<string, { messages_received: number; messages_sent: number; appointments: number }> = {};

  for (let i = 6; i >= 0; i--) {
    const d   = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    byDay[key] = { messages_received: 0, messages_sent: 0, appointments: 0 };
  }

  events.forEach(e => {
    const key = e.timestamp.split("T")[0];
    if (!byDay[key]) return;
    if (e.type === "message_received")    byDay[key].messages_received++;
    if (e.type === "message_sent")        byDay[key].messages_sent++;
    if (e.type === "appointment_created") byDay[key].appointments++;
  });

  return NextResponse.json({
    clients:      clients.count,
    appointments: appointments.filter(a => a.status !== "cancelled").length,
    audios:       events.filter(e => e.type === "audio_transcribed").length,
    messages:     events.filter(e => e.type === "message_received").length,
    dailyMetrics: Object.entries(byDay).map(([date, v]) => ({ date, ...v })),
    recentEvents: events.slice(0, 20),
  });
}
