import { diffLines } from "diff";

export type DiffLine =
  | { type: "added"; text: string }
  | { type: "removed"; text: string }
  | { type: "unchanged"; text: string };

export function diffTextByLines(left: string, right: string): DiffLine[] {
  const parts = diffLines(left, right);
  const out: DiffLine[] = [];

  for (const p of parts) {
    const type: DiffLine["type"] = p.added
      ? "added"
      : p.removed
        ? "removed"
        : "unchanged";
    out.push({ type, text: p.value });
  }

  return out;
}

