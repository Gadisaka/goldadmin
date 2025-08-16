import { randomBytes } from "crypto";

export function generateVoucherCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(16);
  let out = "";
  for (let i = 0; i < 16; i++) out += alphabet[bytes[i] % alphabet.length];
  return out.match(/.{1,4}/g).join("-");
}
