import { NextRequest, NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone requerido" }, { status: 400 });

  const db = await ensureDb();

  const clientRes = await db.execute({ sql: "SELECT id FROM clients WHERE phone = ?", args: [phone] });
  if (clientRes.rows.length === 0) return NextResponse.json([]);

  const clientId = clientRes.rows[0].id;
  const messages = await db.execute({
    sql:  "SELECT * FROM messages WHERE client_id = ? ORDER BY timestamp ASC",
    args: [clientId],
  });

  return NextResponse.json(messages.rows);
}
