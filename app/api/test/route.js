import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    env: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasAdminPhone: !!process.env.DEFAULT_ADMIN_PHONE,
      hasAdminPassword: !!process.env.DEFAULT_ADMIN_PASSWORD,
      hasMongoDb: !!process.env.MONGODB_DB,
    },
  });
}
