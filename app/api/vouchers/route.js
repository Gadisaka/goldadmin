import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Voucher } from "@/lib/models/Voucher";
import { verifyAuthFromCookies } from "@/lib/auth";
import { generateVoucherCode } from "@/lib/voucher";

export async function GET(req) {
  if (!(await verifyAuthFromCookies()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query = {};
  if (status === "claimed" || status === "unclaimed") query.status = status;
  const items = await Voucher.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req) {
  if (!(await verifyAuthFromCookies()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const { amount, quantity } = await req.json();
  const toCreate = Array.from({ length: quantity || 1 }, () => ({
    code: generateVoucherCode(),
    amount,
    status: "unclaimed",
  }));
  const created = await Voucher.insertMany(toCreate);
  return NextResponse.json({ items: created });
}
