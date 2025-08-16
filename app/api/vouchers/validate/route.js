import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Voucher } from "@/lib/models/Voucher";

export async function POST(req) {
  try {
    await dbConnect();
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Voucher code is required" },
        { status: 400 }
      );
    }

    // Find the voucher by code
    const voucher = await Voucher.findOne({ code: code.trim() });

    if (!voucher) {
      return NextResponse.json(
        { error: "Incorrect voucher number" },
        { status: 404 }
      );
    }

    // Check if voucher is already claimed
    if (voucher.status === "claimed") {
      return NextResponse.json(
        { error: "This voucher has been claimed" },
        { status: 409 }
      );
    }

    // Update voucher status to claimed and set claimed timestamp
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucher._id,
      {
        status: "claimed",
        claimedAt: new Date(),
      },
      { new: true }
    );

    // Return success with voucher details
    return NextResponse.json({
      success: true,
      message: "Voucher claimed successfully",
      voucher: {
        code: updatedVoucher.code,
        amount: updatedVoucher.amount,
        status: updatedVoucher.status,
        claimedAt: updatedVoucher.claimedAt,
      },
    });
  } catch (error) {
    console.error("Voucher validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support GET requests for easier testing
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Voucher code is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const voucher = await Voucher.findOne({ code: code.trim() });

    if (!voucher) {
      return NextResponse.json(
        { error: "Incorrect voucher number" },
        { status: 404 }
      );
    }

    if (voucher.status === "claimed") {
      return NextResponse.json(
        { error: "This voucher has been claimed" },
        { status: 409 }
      );
    }

    // Return voucher details without claiming it (for validation only)
    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        amount: voucher.amount,
        status: voucher.status,
        available: true,
      },
    });
  } catch (error) {
    console.error("Voucher validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
