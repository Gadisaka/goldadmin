import { NextResponse } from "next/server";
import { ensureDefaultAdmin, login, setAuthCookie } from "@/lib/auth";

export async function POST(req) {
  await ensureDefaultAdmin();
  const { phone, password } = await req.json();
  const token = await login(phone, password);
  if (!token)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  await setAuthCookie(token);
  return NextResponse.json({ ok: true });
}
