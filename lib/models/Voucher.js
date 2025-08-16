import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, index: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["unclaimed", "claimed"],
      default: "unclaimed",
    },
    claimedAt: { type: Date },
    claimedBy: { type: String },
  },
  { timestamps: true }
);

export const Voucher =
  mongoose.models.Voucher || mongoose.model("Voucher", VoucherSchema);
