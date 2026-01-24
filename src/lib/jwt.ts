export interface JwtDecodeResult {
  header?: any;
  payload?: any;
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
    try {
      const headerJson = base64UrlDecode(headerB64);
      header = JSON.parse(headerJson);
    } catch (e) {
      return {
        isValid: false,
        error: "Failed to decode header: " + (e instanceof Error ? e.message : "Invalid Base64"),
      };
    }

    // Decode payload
    let payload: any;
    try {
      const payloadJson = base64UrlDecode(payloadB64);
      payload = JSON.parse(payloadJson);
    } catch (e) {
      return {
        isValid: false,
        error: "Failed to decode payload: " + (e instanceof Error ? e.message : "Invalid Base64"),
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
 * Decode Base64URL to string
 * JWT uses Base64URL encoding (not standard Base64)
 */
function base64UrlDecode(str: string): string {
  // Replace Base64URL chars with standard Base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  
  // Add padding if needed
  const pad = base64.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error("Invalid Base64 string");
    }
    base64 += "=".repeat(4 - pad);
  }

  // Decode from Base64
  try {
    const decoded = atob(base64);
    // Convert to UTF-8
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    throw new Error("Invalid Base64 encoding");
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
  return exp < now;
}
