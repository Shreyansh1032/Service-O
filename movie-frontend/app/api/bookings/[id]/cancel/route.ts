import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_GATEWAY_URL || "http://localhost:8000";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
