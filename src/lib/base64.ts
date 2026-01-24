export type Base64Result =
  | { ok: true; value: string }
  | { ok: false; error: string };

export function encodeBase64(input: string): Base64Result {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return { ok: true, value: btoa(binary) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to encode";
    return { ok: false, error: msg };
  }
}

export function decodeBase64Safe(input: string): Base64Result {
  try {
    const binary = atob(input);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid Base64";
    return { ok: false, error: msg };
  }
}

/**
 * Decode Base64URL to string
 * JWT uses Base64URL encoding which replaces + with - and / with _
 * and omits padding characters
 */
export function decodeBase64Url(input: string): Base64Result {
  try {
    // Convert Base64URL to standard Base64
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    
    // Add padding if needed
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        return { ok: false, error: "Invalid Base64URL string" };
      }
      base64 += "=".repeat(4 - pad);
    }

    // Reuse the existing safe Base64 decoding logic
    return decodeBase64Safe(base64);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid Base64URL";
    return { ok: false, error: msg };
  }
}

