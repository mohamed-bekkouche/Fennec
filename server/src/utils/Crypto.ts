// import crypto from "crypto";

// const cryptoKey = process.env.CRYPTO_KEY || "default_crypto_key";
// const iv = crypto.randomBytes(16);

// export const encrypt = (data: unknown): { iv: string; data: string } => {
//   const cipher = crypto.createCipheriv(
//     "aes-256-ccm",
//     Buffer.from(cryptoKey),
//     iv
//   );
//   let encrypted = cipher.update(JSON.stringify(data), "utf-8", "hex");
//   encrypted += cipher.final("hex");
//   return {
//     iv: iv.toString("hex"),
//     data: encrypted,
//   };
// };

// export const decrypt = (encryptedData: string, ivHex: string) => {
//   const decipher = crypto.createDecipheriv(
//     "aes-256-ccm",
//     Buffer.from(cryptoKey),
//     Buffer.from(ivHex, "hex")
//   );
//   let decrypted = decipher.update(encryptedData, "hex", "utf-8");
//   decrypted += decipher.final("utf-8");
//   return JSON.parse(decrypted);
// };
import crypto from "crypto";

// Load your 32-byte key (base64-encoded in .env)
const keyBase64 =
  process.env.CRYPTO_KEY ||
  "8b461c0b09bf08140dfd73582c739175b280b0a1ceaf262e5801178d66d24779";
const cryptoKey = Buffer.from(keyBase64, "base64");

// if (cryptoKey.length !== 32) {
//   throw new Error("CRYPTO_KEY must decode to 32 bytes for AES-256.");
// }

// Encrypt function
export const encrypt = (data: unknown): { iv: string; data: string } => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", cryptoKey, iv);

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    data: encrypted,
  };
};

// Decrypt function
export const decrypt = (encryptedData: string, ivHex: string) => {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", cryptoKey, iv);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};
