export interface DecodeResult {
  decoded?: string;
  formatted?: string;
  error?: string;
  success: boolean;
}

/**
 * Decode stringified/escaped JSON from server logs
 * Tries to parse as-is first, then unescapes if needed
 */
export function decodeEscapedJson(input: string): DecodeResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      error: "Input is empty",
    };
  }

  let current = input.trim();

  try {
    try {
      const parsed = JSON.parse(current);
      const formatted = JSON.stringify(parsed, null, 2);
      return {
        success: true,
        decoded: current,
        formatted,
      };
    } catch (e) {
      // If direct parse fails, unescape and try again
      current = manualUnescape(current);
      const parsed = JSON.parse(current);
      const formatted = JSON.stringify(parsed, null, 2);
      return {
        success: true,
        decoded: current,
        formatted,
      };
    }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to decode",
      decoded: current,
    };
  }
}

function manualUnescape(str: string): string {
  return str.replace(/\\"/g, '"').replace(/\\n\s*/g, " ");
}

/**
 * Try to format JSON if it's valid
 * Includes fallback to unescape double quotes if first parse fails
 */
export function tryFormatJson(input: string): DecodeResult {
  const process = (value: string) => {
    const parsed = JSON.parse(value);
    const formatted = JSON.stringify(parsed, null, 2);
    return {
      success: true,
      decoded: value,
      formatted,
    };
  };

  try {
    // First attempt: try to parse normally
    return process(input);
  } catch (e1) {
    try {
      // Second attempt: unescape double quotes and try again
      const unescapedInput = input.replace(/\\"/g, '"');
      return process(unescapedInput);
    } catch (e2) {
      // Both attempts failed. Return error from second attempt (e2)
      // as it reflects the parsing failure after the unescape fix attempt,
      // which provides more useful feedback for debugging
      return {
        success: false,
        error: e2 instanceof Error ? e2.message : "Invalid JSON",
      };
    }
  }
}

/**
 * Auto-detect and decode escaped JSON
 * Combines decoding and formatting in one step
 */
export function autoDecodeJson(input: string): DecodeResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      error: "Input is empty",
    };
  }

  const trimmed = input.trim();

  // First, try to decode if it looks escaped
  if (trimmed.includes("\\n") || trimmed.includes('\\"') || trimmed.includes("\\\\")) {
    const decoded = decodeEscapedJson(trimmed);
    if (decoded.success && decoded.formatted) {
      return decoded;
    }
  }

  // If not escaped or decoding failed, try direct formatting
  return tryFormatJson(trimmed);
}
