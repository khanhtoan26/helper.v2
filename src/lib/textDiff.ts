import { diffWordsWithSpace } from "diff";

export type DiffSegment =
  | { type: "added"; text: string }
  | { type: "removed"; text: string }
  | { type: "unchanged"; text: string };

export function diffTextWords(left: string, right: string): DiffSegment[] {
  // Add spaces around newlines so they are treated as tokens when diffing.
  const normalize = (s: string) => s.replace(/\n/g, " \n ");
  const parts = diffWordsWithSpace(normalize(left), normalize(right));
  return parts.map((p) => {
    if (p.added) return { type: "added", text: p.value };
    if (p.removed) return { type: "removed", text: p.value };
    return { type: "unchanged", text: p.value };
  });
}

