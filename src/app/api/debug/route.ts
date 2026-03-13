import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const clients = db.prepare("SELECT COUNT(*) as count FROM clients").get() as { count: number };

  return NextResponse.json({
    db:      "SQLite (local)",
    clients: clients.count,
    status:  "ok",
  });
}
