export interface DecodeResult {
  decoded?: string;
  formatted?: string;
  error?: string;
  success: boolean;
}

/**
 * Decode stringified/escaped JSON from server logs
 * Handles multiple levels of escaping and common patterns
 */
export function decodeEscapedJson(input: string): DecodeResult {
  if (!input || input.trim() === "") {
    return {
      success: false,
      error: "Input is empty",
    };
  }

  let current = input.trim();
  let iterations = 0;
  const maxIterations = 10; // Prevent infinite loops
  const steps: string[] = [current];

  try {
    // Try to decode multiple levels of stringification
    while (iterations < maxIterations) {
      iterations++;

      // Check if it's a JSON string (starts and ends with quotes)
      const isQuoted = (current.startsWith('"') && current.endsWith('"')) ||
                      (current.startsWith("'") && current.endsWith("'"));

      if (isQuoted) {
        // Try to parse as JSON string
        try {
          const parsed = JSON.parse(current);
          if (typeof parsed === "string") {
            current = parsed;
            steps.push(current);
            continue; // Continue decoding if still a string
          } else {
            // Successfully parsed to an object/array
            const formatted = JSON.stringify(parsed, null, 2);
            return {
              success: true,
              decoded: current,
              formatted,
            };
          }
        } catch (e) {
          // If JSON.parse fails, try manual unescaping
          current = manualUnescape(current);
          steps.push(current);
          continue;
        }
      } else {
        // Not quoted, try to parse directly
        try {
          const parsed = JSON.parse(current);
          const formatted = JSON.stringify(parsed, null, 2);
          return {
            success: true,
            decoded: current,
            formatted,
          };
        } catch (e) {
          // If this fails, return the last decoded version
          return {
            success: true,
            decoded: current,
            formatted: current,
          };
        }
      }
    }

    // Max iterations reached
    return {
      success: true,
      decoded: current,
      formatted: current,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to decode",
      decoded: current,
    };
  }
}

/**
 * Manually unescape a string (for cases where JSON.parse fails)
 */
function manualUnescape(str: string): string {
  // Remove surrounding quotes if present
  let result = str;
  if ((result.startsWith('"') && result.endsWith('"')) ||
      (result.startsWith("'") && result.endsWith("'"))) {
    result = result.slice(1, -1);
  }

  // Replace common escape sequences
  result = result
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");

  return result;
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
