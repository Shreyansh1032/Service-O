"use client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");
  return json.user as User;
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed");
  return json.user as User;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getSession(): Promise<{ loggedIn: boolean; user?: User }> {
  const res = await fetch("/api/auth/me");
  return res.json();
}
