const FRAME_SIZE = 10 * 60 * 1000; // 10 minutes

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

export async function decryptPassword(
    ivHex: string,
    ciphertextHex: string,
) {
    const secret = process.env.ENCRYPTION_BASE_SECRET || "fallback-secret";
    const iv = hexToBytes(ivHex);
    const ciphertext = hexToBytes(ciphertextHex);

    // try current and previous frame (to tolerate clock drift / frame rotation)
    for (const offset of [0, -1]) {
        try {
            const key = await getCryptoKey(secret, offset);

            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv as BufferSource },
                key,
                ciphertext as BufferSource
            );

            const decoder = new TextDecoder();
            const payload = JSON.parse(decoder.decode(decrypted));

            if (payload.expiresAt && payload.expiresAt < Date.now()) {
                throw new Error("Password has expired");
            }

            return payload.password;
        } catch (err) {
            continue
        }
    }

    throw new Error("Decryption failed");
}
