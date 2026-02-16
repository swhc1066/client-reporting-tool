import { getClientById, getClientPresentationData } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = getClientById(id);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    const data = getClientPresentationData(id);
    return NextResponse.json({ client, data });
  } catch {
    return NextResponse.json(
      { error: "Failed to load client" },
      { status: 500 }
    );
  }
}
