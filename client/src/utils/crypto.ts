import crypto from "crypto";

export const getHash = (plaintext: string) => {
  return crypto.createHash("sha256").update(plaintext).digest("hex");
}