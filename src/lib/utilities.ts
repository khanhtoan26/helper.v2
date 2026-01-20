export type UtilityMeta = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "Encoding" | "JSON" | "DateTime" | "Other";
  path: string;
  isNew?: boolean;
};

export const utilities: UtilityMeta[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, minify, validate, and copy JSON safely.",
    category: "JSON",
    path: "/utilities/json-formatter",
  },
  {
    id: "base64",
    name: "Base64 Encode/Decode",
    slug: "base64",
    description: "Encode plain text to Base64 and decode back.",
    category: "Encoding",
    path: "/utilities/base64",
  },
  {
    id: "timestamp-date",
    name: "Timestamp ↔ Date",
    slug: "timestamp-date",
    description: "Convert Unix timestamps and human-readable dates.",
    category: "DateTime",
    path: "/utilities/timestamp-date",
    isNew: true,
  },
];

