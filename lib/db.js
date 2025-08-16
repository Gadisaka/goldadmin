import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

let cached = global.mongooseConn || { conn: null, promise: null };
global.mongooseConn = cached;

export async function dbConnect() {
  try {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: process.env.MONGODB_DB,
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        socketTimeoutMS: 45000, // 45 second timeout
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    // Reset the promise so we can retry
    cached.promise = null;
    throw error;
  }
}
