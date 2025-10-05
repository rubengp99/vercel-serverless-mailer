export type EncryptedPassword = {
    iv: string;
    ciphertext: string;
    expiresAt: number;
};

const FRAME_SIZE = 60 * 1000; // 1 min rotation frame

// --- HEX HELPERS ---
export function toHex(data: ArrayBuffer | Uint8Array): string {
    const u8 = data instanceof Uint8Array ? data : new Uint8Array(data);
    return Array.from(u8).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

// --- KEY DERIVATION ---
async function getCryptoKey(secret: string, offset = 0, usage: KeyUsage[] = ["encrypt", "decrypt"]) {
    const frame = Math.floor(Date.now() / FRAME_SIZE) + offset;
    const encoder = new TextEncoder();
    const keyMaterial = encoder.encode(secret + frame.toString());
    const hash = await crypto.subtle.digest("SHA-256", keyMaterial);
    return crypto.subtle.importKey("raw", hash, "AES-GCM", false, usage);
}

export async function decryptPassword(pwd: EncryptedPassword): Promise<string> {
  const secret = process.env.ENCRYPTION_BASE_SECRET || "fallback-secret";
  const { iv, ciphertext, expiresAt } = pwd;

  // quick reject if payload expired
  if (expiresAt < Date.now()) {
    throw new Error("Encrypted payload has expired (rotation window)");
  }

  const ivBytes = hexToBytes(iv);
  const ciphertextBytes = hexToBytes(ciphertext);

  // try current, previous, and next frames (tolerate small clock drift)
  for (const offset of [0, -1, 1]) {
    try {
      const key = await getCryptoKey(secret, offset, ["decrypt"]);

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBytes as BufferSource },
        key,
        ciphertextBytes as BufferSource
      );

      const decoded = new TextDecoder().decode(decrypted);

      const payload = JSON.parse(decoded);

      if (payload.expiresAt && payload.expiresAt < Date.now()) {
        throw new Error("Decrypted password payload has expired");
      }

      if (!payload.password) {
        throw new Error("Decrypted payload missing password field");
      }

      return payload.password as string;
    } catch (err) {
      // continue to next offset
      continue;
    }
  }

  throw new Error("Decryption failed (all offsets tried)");
}
