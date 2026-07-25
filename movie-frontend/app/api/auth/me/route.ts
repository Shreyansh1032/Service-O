import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_GATEWAY_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    const json = await res.json();
    return NextResponse.json({ loggedIn: true, user: json.data });
  } catch (err) {
    console.error("GET /api/auth/me failed to reach gateway:", err);
    return NextResponse.json(
      { loggedIn: false, error: "Could not reach auth service" },
      { status: 200 }
    );
  }
}
