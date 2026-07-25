import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_GATEWAY_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${API_BASE}/api/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
