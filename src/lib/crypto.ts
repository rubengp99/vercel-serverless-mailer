export type EncryptedPassword = {
    iv: string;
    ciphertext: string;
    expiresAt: number;
}

const FRAME_SIZE = 1 * 60 * 1000; // 1 minute

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

async function getCryptoKey(secret: string, offset = 0) {
    const frame = Math.floor(Date.now() / FRAME_SIZE) + offset;
    const encoder = new TextEncoder();
    const keyMaterial = encoder.encode(secret + frame.toString());
    const hash = await crypto.subtle.digest("SHA-256", keyMaterial);
    return crypto.subtle.importKey("raw", hash, "AES-GCM", false, ["decrypt"]);
}

export async function decryptPassword(pwd: EncryptedPassword) {
    const secret = process.env.ENCRYPTION_BASE_SECRET || "fallback-secret";
    const { iv, expiresAt, ciphertext } = pwd

    // quick reject if rotation TTL expired
    if (expiresAt < Date.now()) {
        throw new Error("Encrypted payload has expired (rotation window)");
    }

    const ivBytes = hexToBytes(iv);
    const ciphertextBytes = hexToBytes(ciphertext);

    // try current and previous frame (handles drift)
    for (const offset of [0, -1]) {
        try {
            const key = await getCryptoKey(secret, offset);

            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: ivBytes as BufferSource },
                key,
                ciphertextBytes as BufferSource
            );

            const decoder = new TextDecoder();
            const payload = JSON.parse(decoder.decode(decrypted));

            // validate embedded payload expiration
            if (payload.expiresAt && payload.expiresAt < Date.now()) {
                throw new Error("Decrypted password payload has expired");
            }

            return payload.password as string;
        } catch {
            // try next frame
        }
    }

    throw new Error("Decryption failed");
}
