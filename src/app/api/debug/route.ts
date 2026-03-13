import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const db = await ensureDb();

    // Contar tablas existentes
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );

    // Contar registros en cada tabla
    const clientsCount     = await db.execute("SELECT COUNT(*) as n FROM clients");
    const messagesCount    = await db.execute("SELECT COUNT(*) as n FROM messages");
    const analyticsCount   = await db.execute("SELECT COUNT(*) as n FROM analytics_events");

    // Intentar insert de prueba
    const testId    = randomUUID();
    const testPhone = `test_${Date.now()}`;
    let   insertOk  = false;
    let   insertErr = "";

    try {
      await db.execute({
        sql:  "INSERT INTO clients (id, name, phone, created_at, last_interaction, message_count) VALUES (?, ?, ?, ?, ?, 0)",
        args: [testId, "Test", testPhone, new Date().toISOString(), new Date().toISOString()],
      });
      // Borrar el test
      await db.execute({ sql: "DELETE FROM clients WHERE id = ?", args: [testId] });
      insertOk = true;
    } catch (e: unknown) {
      insertErr = e instanceof Error ? e.message : String(e);
    }

    return NextResponse.json({
      tables:         tables.rows.map((r: Record<string, unknown>) => r.name),
      clients:        (clientsCount.rows[0] as unknown as { n: number }).n,
      messages:       (messagesCount.rows[0] as unknown as { n: number }).n,
      analytics:      (analyticsCount.rows[0] as unknown as { n: number }).n,
      insert_test_ok: insertOk,
      insert_error:   insertErr || null,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
