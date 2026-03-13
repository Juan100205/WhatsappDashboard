import { NextResponse } from "next/server";
import { ensureDb, serializeRows } from "@/lib/db";

export async function GET() {
  const db     = await ensureDb();
  const result = await db.execute("SELECT * FROM clients ORDER BY last_interaction DESC");
  return NextResponse.json(serializeRows(result.rows as Record<string, unknown>[]));
}
