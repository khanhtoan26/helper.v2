export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string };

export function parseJsonSafe(input: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return { ok: false, error: msg };
  }
}

export function formatJson(input: string, spaces = 2): JsonParseResult {
  const parsed = parseJsonSafe(input);
  if (!parsed.ok) return parsed;
  return { ok: true, value: JSON.stringify(parsed.value, null, spaces) };
}

export function minifyJson(input: string): JsonParseResult {
  const parsed = parseJsonSafe(input);
  if (!parsed.ok) return parsed;
  return { ok: true, value: JSON.stringify(parsed.value) };
}

