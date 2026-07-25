import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_GATEWAY_URL || "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/api/bookings/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
