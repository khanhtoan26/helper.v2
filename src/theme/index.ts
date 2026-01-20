import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          200: { value: "#c7d2fe" },
          300: { value: "#a5b4fc" },
          400: { value: "#818cf8" },
          500: { value: "#6366f1" },
          600: { value: "#4f46e5" },
          700: { value: "#4338ca" },
          800: { value: "#3730a3" },
          900: { value: "#312e81" },
        },
      },
      radii: {
        sm: { value: "8px" },
        md: { value: "12px" },
        lg: { value: "16px" },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { _light: "#f6f8fa", _dark: "#0b0f14" } },
        surface: { value: { _light: "#ffffff", _dark: "#0f1720" } },
        border: { value: { _light: "#d0d7de", _dark: "#243040" } },
        muted: { value: { _light: "#57606a", _dark: "#8b949e" } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);

