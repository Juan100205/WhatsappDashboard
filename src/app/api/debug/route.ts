import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";

export async function GET() {
  const db      = await ensureDb();
  const result  = await db.execute("SELECT COUNT(*) as count FROM clients");
  const count   = (result.rows[0] as unknown as { count: number }).count;

  return NextResponse.json({ db: "Turso (libSQL)", clients: count, status: "ok" });
}
