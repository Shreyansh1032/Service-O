import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_GATEWAY_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    return NextResponse.json(json, { status: res.status });
  }

  const response = NextResponse.json({ success: true, user: json.data.user });

  response.cookies.set("token", json.data.token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
