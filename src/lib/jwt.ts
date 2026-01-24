import { decodeBase64Url } from "./base64";

export interface JwtDecodeResult {
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signature?: string;
  error?: string;
  isValid: boolean;
}

/**
 * Decode a JWT token into its parts (header, payload, signature)
 * Does NOT verify the signature - just decodes the Base64 parts
 */
export function decodeJwt(token: string): JwtDecodeResult {
  try {
    // Remove whitespace
    const trimmedToken = token.trim();
    
    if (!trimmedToken) {
      return {
        isValid: false,
        error: "Token is empty",
      };
    }

    // JWT should have exactly 3 parts separated by dots
    const parts = trimmedToken.split(".");
    
    if (parts.length !== 3) {
      return {
        isValid: false,
        error: `Invalid JWT format. Expected 3 parts (header.payload.signature), got ${parts.length}`,
      };
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header
    let header: any;
    const headerResult = decodeBase64Url(headerB64);
    if (!headerResult.ok) {
      return {
        isValid: false,
        error: "Failed to decode header: " + headerResult.error,
      };
    }
    try {
      header = JSON.parse(headerResult.value);
    } catch (e) {
      return {
        isValid: false,
        error: "Failed to parse header JSON: " + (e instanceof Error ? e.message : "Invalid JSON"),
      };
    }

    // Decode payload
    let payload: any;
    const payloadResult = decodeBase64Url(payloadB64);
    if (!payloadResult.ok) {
      return {
        isValid: false,
        error: "Failed to decode payload: " + payloadResult.error,
      };
    }
    try {
      payload = JSON.parse(payloadResult.value);
    } catch (e) {
      return {
        isValid: false,
        error: "Failed to parse payload JSON: " + (e instanceof Error ? e.message : "Invalid JSON"),
      };
    }

    return {
      header,
      payload,
      signature: signatureB64,
      isValid: true,
    };
  } catch (e) {
    return {
      isValid: false,
      error: e instanceof Error ? e.message : "Unknown error decoding JWT",
    };
  }
}

/**
 * Format Unix timestamp to human-readable date
 */
export function formatTimestamp(timestamp: number): string {
  try {
    const date = new Date(timestamp * 1000); // JWT timestamps are in seconds
    return date.toISOString() + " (" + date.toLocaleString() + ")";
  } catch {
    return "Invalid timestamp";
  }
}

/**
 * Check if a JWT timestamp has expired
 */
export function isExpired(exp: number): boolean {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  return exp <= now;
}
