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

