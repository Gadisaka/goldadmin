import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../lib/models/Admin.js";
import { dbConnect } from "../lib/db.js";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

async function seedAdmin() {
  try {
    console.log("🌱 Starting admin seed...");

    // Connect to database
    await dbConnect();
    console.log("✅ Connected to database");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ phone: "0911223344" });

    if (existingAdmin) {
      console.log("⚠️ Admin with phone 0911223344 already exists");
      console.log("📱 Phone:", existingAdmin.phone);
      console.log("🆔 ID:", existingAdmin._id);
      console.log("📅 Created:", existingAdmin.createdAt);
      return;
    }

    // Create admin user
    const password = "0911223344";
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      phone: "0911223344",
      passwordHash: passwordHash,
    });

    console.log("✅ Admin created successfully!");
    console.log("📱 Phone:", admin.phone);
    console.log("🆔 ID:", admin._id);
    console.log("📅 Created:", admin.createdAt);
    console.log("");
    console.log("🔑 Login Credentials:");
    console.log("   Phone: 0911223344");
    console.log("   Password: 0911223344");
    console.log("");
    console.log("🚀 You can now login at /login");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  }
}

// Run the seed
seedAdmin();
