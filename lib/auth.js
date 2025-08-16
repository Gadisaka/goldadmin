import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Admin } from "./models/Admin.js";
import { dbConnect } from "./db.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function ensureDefaultAdmin() {
  try {
    await dbConnect();
    const count = await Admin.countDocuments();
    if (count === 0) {
      const phone = process.env.DEFAULT_ADMIN_PHONE || "0911223344";
      const password = process.env.DEFAULT_ADMIN_PASSWORD || "0911223344";
      const passwordHash = await bcrypt.hash(password, 12);
      await Admin.create({ phone, passwordHash });
      console.log("✅ Default admin created:", phone);
    }
  } catch (error) {
    console.error("❌ Error ensuring default admin:", error.message);
    throw error;
  }
}

export async function login(phone, password) {
  try {
    await dbConnect();
    const admin = await Admin.findOne({ phone }).lean();
    if (!admin) return null;
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return null;
    const token = jwt.sign({ sub: admin._id.toString(), phone }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
}

export async function setAuthCookie(token) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("❌ Error setting auth cookie:", error.message);
    throw error;
  }
}

export async function clearAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth");
  } catch (error) {
    console.error("❌ Error clearing auth cookie:", error.message);
    throw error;
  }
}

export async function verifyAuthFromCookies() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("❌ Error verifying auth from cookies:", error.message);
    return null;
  }
}
