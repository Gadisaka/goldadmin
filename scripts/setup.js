#!/usr/bin/env node

import { config } from "dotenv";
import { dbConnect } from "../lib/db.js";
import { ensureDefaultAdmin } from "../lib/auth.js";

// Load environment variables
config({ path: ".env.local" });

async function setup() {
  console.log("🚀 Setting up Gold Bingo Admin...\n");

  try {
    // Test database connection
    console.log("📡 Testing database connection...");
    await dbConnect();
    console.log("✅ Database connected successfully!\n");

    // Ensure default admin exists
    console.log("👤 Creating default admin...");
    await ensureDefaultAdmin();
    console.log("✅ Default admin ready!\n");

    console.log("🎉 Setup complete!");
    console.log("\n📱 Default credentials:");
    console.log("   Phone: 0911223344");
    console.log("   Password: 0911223344");
    console.log("\n🌐 Start your app with: npm run dev");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    console.log("\n💡 Make sure you have:");
    console.log("   1. Created a .env.local file with MONGODB_URI");
    console.log("   2. Whitelisted your IP in MongoDB Atlas");
    console.log("   3. Set the correct database credentials");
    process.exit(1);
  }
}

setup();
