import { NextResponse } from "next/server";
import { verifyAuthFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const user = await verifyAuthFromCookies();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.sub,
      phone: user.phone,
      iat: user.iat,
      exp: user.exp,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
