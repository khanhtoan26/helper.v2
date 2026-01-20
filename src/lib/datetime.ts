export function unixSecondsToIso(seconds: number): string {
  const ms = seconds * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export function unixMillisToIso(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

