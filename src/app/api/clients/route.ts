import { NextResponse } from "next/server";
import { ensureDb } from "@/lib/db";

export async function GET() {
  const db      = await ensureDb();
  const clients = await db.execute("SELECT * FROM clients ORDER BY last_interaction DESC");
  return NextResponse.json(clients.rows);
}
