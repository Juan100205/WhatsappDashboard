import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const clients = db
    .prepare("SELECT * FROM clients ORDER BY last_interaction DESC")
    .all();

  return NextResponse.json(clients);
}
