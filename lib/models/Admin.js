import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
