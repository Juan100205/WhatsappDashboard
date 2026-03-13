import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "phone requerido" }, { status: 400 });

  const client = db
    .prepare("SELECT id FROM clients WHERE phone = ?")
    .get(phone) as { id: string } | undefined;

  if (!client) return NextResponse.json([]);

  const messages = db
    .prepare("SELECT * FROM messages WHERE client_id = ? ORDER BY timestamp ASC")
    .all(client.id);

  return NextResponse.json(messages);
}
