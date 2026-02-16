import { getClients } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clients = getClients();
    return NextResponse.json(clients);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to load clients" },
      { status: 500 }
    );
  }
}
