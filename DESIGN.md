# Helper.v2 - Design & Architecture Documentation

## Overview

Helper.v2 is a modern, static Next.js utilities site designed for GitHub Pages deployment. It provides browser-based tools for common data transformations (JSON formatting, Base64 encoding, timestamp conversion) with a clean, flat UI and extensible architecture.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **UI Library**: Chakra UI v3
- **Deployment**: Static export for GitHub Pages
- **Styling**: Chakra UI's design system with custom flat theme
- **State Management**: React hooks (useState) for client-side utilities

## Architecture Overview

```
helper.v2/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with Chakra providers
│   │   ├── page.tsx           # Home page (utilities grid)
│   │   ├── about/             # About page
│   │   └── utilities/         # Utility pages
│   │       ├── json-formatter/
│   │       ├── base64/
│   │       └── timestamp-date/
│   ├── components/            # Reusable UI components
│   │   ├── AppShell.tsx       # Main layout with header/nav/footer
│   │   └── UtilityCard.tsx    # Card component for utility grid
│   ├── lib/                   # Pure utility functions
│   │   ├── utilities.ts       # Utility registry (metadata)
│   │   ├── json.ts            # JSON parsing/formatting logic
│   │   ├── base64.ts          # Base64 encode/decode logic
│   │   └── datetime.ts        # Timestamp/date conversion logic
│   └── theme/                 # Chakra UI theme configuration
│       └── index.ts           # Custom flat theme tokens
├── next.config.ts             # Static export + GitHub Pages config
├── .github/workflows/         # GitHub Actions deployment
└── package.json               # Dependencies & scripts
```

## Design System

### Theme Tokens

The app uses a **modern flat design** with minimal shadows and clean borders:

- **Colors**:
  - `bg`: Page background (light: `#f6f8fa`, dark: `#0b0f14`)
  - `surface`: Card/panel background (light: `#ffffff`, dark: `#0f1720`)
  - `border`: Border color (light: `#d0d7de`, dark: `#243040`)
  - `muted`: Secondary text (light: `#57606a`, dark: `#8b949e`)
  - `brand`: Primary accent color (indigo palette: `#6366f1`)

- **Radii**: Small (`8px`), Medium (`12px`), Large (`16px`)

- **Typography**: System fonts (sans-serif) with clear hierarchy

### Layout Principles

1. **Max Width**: Content constrained to `960px` for readability
2. **Spacing**: Consistent padding (`py="6"` mobile, `py="10"` desktop)
3. **Borders**: `1px` solid borders instead of heavy shadows
4. **Responsive**: Mobile-first breakpoints (`base` → `md`)

## Navigation Architecture

### Header Structure

```
[Logo] [Home] [Utilities ▼] [About] ... [GitHub] [Menu ☰]
```

- **Desktop**: Horizontal nav with dropdown menu for utilities
- **Mobile**: Hamburger menu (drawer) with full navigation

### Utilities Registry Pattern

All utilities are registered in `src/lib/utilities.ts`:

```typescript
export interface Utility {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  path: string;
  isNew?: boolean;
}

export const utilities: Utility[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Format, minify, and validate JSON",
    category: "data",
    path: "/utilities/json-formatter",
  },
  // ... more utilities
];
```

**Benefits**:
- Single source of truth for utility metadata
- Auto-generates navigation menus
- Auto-generates home page grid
- Easy to add new utilities (just add entry + page)

## Utility Page Pattern

Each utility follows a consistent structure:

### 1. Page Component (`app/utilities/[slug]/page.tsx`)

```typescript
"use client";

import { useState } from "react";
import { Box, Button, Textarea, VStack, ... } from "@chakra-ui/react";
import { formatJson, parseJsonSafe } from "@/lib/json";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    const result = parseJsonSafe(input);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    setOutput(formatJson(result.data));
  };

  return (
    <VStack gap="6" align="stretch">
      {/* Input section */}
      {/* Output section */}
      {/* Action buttons */}
    </VStack>
  );
}
```

### 2. Pure Functions (`lib/[utility].ts`)

All transformation logic lives in pure functions:

```typescript
export interface JsonParseResult {
  data?: any;
  error?: string;
}

export function parseJsonSafe(input: string): JsonParseResult {
  try {
    const data = JSON.parse(input);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
```

**Benefits**:
- Testable in isolation
- Reusable across components
- No side effects
- Type-safe

### 3. Shared UI Patterns

- **Textarea**: Consistent styling with `fontFamily="mono"`
- **Error Display**: Alert/Toast component for validation errors
- **Copy Button**: Reusable copy-to-clipboard functionality
- **Action Buttons**: Primary actions (Format, Encode, etc.) + secondary (Clear, Copy)

## Adding a New Utility

### Step 1: Add Registry Entry

Edit `src/lib/utilities.ts`:

```typescript
export const utilities: Utility[] = [
  // ... existing utilities
  {
    id: "url-encoder",
    name: "URL Encoder",
    slug: "url-encoder",
    description: "Encode and decode URL strings",
    category: "web",
    path: "/utilities/url-encoder",
    isNew: true, // Optional: show "New" badge
  },
];
```

### Step 2: Create Pure Functions

Create `src/lib/url.ts`:

```typescript
export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrlSafe(input: string): { data?: string; error?: string } {
  try {
    return { data: decodeURIComponent(input) };
  } catch (e) {
    return { error: "Invalid URL encoding" };
  }
}
```

### Step 3: Create Page Component

Create `src/app/utilities/url-encoder/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Box, Button, Textarea, VStack, HStack, Alert } from "@chakra-ui/react";
import { encodeUrl, decodeUrlSafe } from "@/lib/url";

export default function UrlEncoderPage() {
  const [plainText, setPlainText] = useState("");
  const [encoded, setEncoded] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEncode = () => {
    setError(null);
    setEncoded(encodeUrl(plainText));
  };

  const handleDecode = () => {
    const result = decodeUrlSafe(encoded);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    setPlainText(result.data || "");
  };

  return (
    <VStack gap="6" align="stretch">
      <Box>
        <h1>URL Encoder / Decoder</h1>
        <p>Encode or decode URL-encoded strings</p>
      </Box>

      {error && <Alert status="error">{error}</Alert>}

      <VStack gap="4" align="stretch">
        <Box>
          <label>Plain Text</label>
          <Textarea
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            fontFamily="mono"
            rows={6}
          />
        </Box>

        <HStack>
          <Button onClick={handleEncode}>Encode →</Button>
          <Button onClick={handleDecode}>← Decode</Button>
          <Button variant="outline" onClick={() => { setPlainText(""); setEncoded(""); }}>
            Clear
          </Button>
        </HStack>

        <Box>
          <label>Encoded</label>
          <Textarea
            value={encoded}
            onChange={(e) => setEncoded(e.target.value)}
            fontFamily="mono"
            rows={6}
          />
        </Box>
      </VStack>
    </VStack>
  );
}
```

### Step 4: Test & Deploy

1. Run `npm run dev` to test locally
2. Verify navigation menu includes new utility
3. Verify home page grid shows new card
4. Push to GitHub → auto-deploys via Actions

## GitHub Pages Deployment

### Configuration

`next.config.ts` is configured for static export:

```typescript
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "",
  assetPrefix: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "",
};
```

**Key Points**:
- `output: "export"` → generates static HTML in `out/`
- `basePath` → handles GitHub Pages subdirectory routing
- `trailingSlash: true` → ensures GitHub Pages routing works correctly
- `images.unoptimized: true` → no Next.js Image Optimization (static export)

### Deployment Workflow

`.github/workflows/deploy.yml`:

1. Triggers on push to `main`
2. Checks out code
3. Installs dependencies (`npm ci`)
4. Builds static export (`npm run build`)
5. Deploys `out/` directory to `gh-pages` branch
6. GitHub Pages serves from `gh-pages` branch

### Local Testing

To test GitHub Pages routing locally:

```bash
# Build
npm run build

# Serve from out/ directory
npx serve out/
```

Or use the provided script:

```bash
npm run serve:out
```

## Component Patterns

### AppShell

The main layout wrapper (`src/components/AppShell.tsx`):

- **Sticky Header**: Navigation stays visible on scroll
- **Responsive Menu**: Desktop dropdown vs mobile drawer
- **Footer**: Simple footer with privacy message
- **Container**: Max-width constraint for content

### UtilityCard

Reusable card component for home page grid:

- Displays utility name, description, tags
- Links to utility page
- Shows "New" badge if `isNew: true`
- Responsive grid layout (1 col mobile → 2-3 cols desktop)

## Error Handling Patterns

All utilities follow consistent error handling:

1. **Validation**: Pure functions return `{ data?, error? }` objects
2. **Display**: Errors shown in Alert/Toast components
3. **User Feedback**: Clear error messages, no technical jargon
4. **Recovery**: Users can clear/reset and try again

## Performance Considerations

- **Static Export**: All pages pre-rendered at build time
- **Client-Side Only**: No server-side processing (works on GitHub Pages)
- **Minimal Dependencies**: Only Chakra UI + Next.js (no heavy editors)
- **Code Splitting**: Next.js automatically splits by route
- **No External APIs**: All processing happens in browser

## Accessibility

- **Keyboard Navigation**: All interactive elements keyboard accessible
- **ARIA Labels**: Icon buttons have descriptive labels
- **Color Contrast**: Theme tokens meet WCAG AA standards
- **Focus States**: Visible focus indicators on all interactive elements
- **Semantic HTML**: Proper heading hierarchy, landmarks

## Future Enhancements

Potential additions following the same patterns:

1. **More Utilities**:
   - HTML Entity Encoder/Decoder
   - UUID Generator
   - Hash Generator (MD5, SHA256)
   - Color Converter (HEX ↔ RGB ↔ HSL)
   - QR Code Generator
   - Markdown Preview

2. **UI Improvements**:
   - Dark mode toggle (currently uses system preference)
   - Search/filter utilities
   - Recent utilities history (localStorage)
   - Export results as files

3. **Developer Experience**:
   - Unit tests for `lib/` functions
   - E2E tests for critical flows
   - Storybook for component documentation

## File Structure Reference

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Chakra providers)
│   ├── providers.tsx           # Chakra UI provider wrapper
│   ├── page.tsx                # Home page
│   ├── about/
│   │   └── page.tsx            # About page
│   └── utilities/
│       ├── json-formatter/
│       │   └── page.tsx        # JSON utility page
│       ├── base64/
│       │   └── page.tsx        # Base64 utility page
│       └── timestamp-date/
│           └── page.tsx        # Timestamp utility page
├── components/
│   ├── AppShell.tsx            # Main layout component
│   └── UtilityCard.tsx         # Utility card component
├── lib/
│   ├── utilities.ts            # Utility registry
│   ├── json.ts                 # JSON functions
│   ├── base64.ts               # Base64 functions
│   └── datetime.ts             # Date/time functions
└── theme/
    └── index.ts                # Chakra theme config
```

## Key Design Decisions

1. **Static Export Only**: Ensures compatibility with GitHub Pages (no server required)

2. **Registry Pattern**: Centralized utility metadata makes navigation and discovery automatic

3. **Pure Functions**: Separation of UI and logic makes utilities testable and reusable

4. **Client Components**: All utility pages are `"use client"` to enable interactivity

5. **Flat Design**: Minimal shadows, clean borders → modern, fast-loading aesthetic

6. **Mobile-First**: Responsive design starts with mobile, enhances for desktop

7. **No External Dependencies**: All utilities use browser APIs (no third-party services)

8. **Privacy-First**: All processing happens client-side (no data leaves device)

## Troubleshooting

### Build Errors

- **Type Errors**: Run `npm run build` to see TypeScript errors
- **Missing Dependencies**: Run `npm install` after adding new packages
- **Export Errors**: Ensure all pages can be statically generated (no `getServerSideProps`)

### Deployment Issues

- **404 on Routes**: Check `basePath` in `next.config.ts` matches repo name
- **Assets Not Loading**: Verify `assetPrefix` matches `basePath`
- **Routing Broken**: Ensure `trailingSlash: true` in config

### UI Issues

- **Dropdown Transparent**: Add `bg="surface"` to `MenuContent`
- **Colors Wrong**: Check theme tokens in `src/theme/index.ts`
- **Layout Broken**: Verify Chakra UI providers are in root layout

---

**Last Updated**: 2024
**Maintainer**: See README.md
