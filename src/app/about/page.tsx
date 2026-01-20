import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";

export default function AboutPage() {
  return (
    <Stack gap="4">
      <Box>
        <Heading size="lg">About</Heading>
        <Text color="muted" mt="2">
          Helper.v2 is a small, static site of developer utilities (JSON, Base64,
          timestamps, and more). Everything runs locally in your browser.
        </Text>
      </Box>

      <Text>
        Want to add a new module? Add an entry to <code>src/lib/utilities.ts</code>{" "}
        and create a page under <code>src/app/utilities/&lt;slug&gt;/page.tsx</code>.
      </Text>

      <Text color="muted" fontSize="sm">
        Tip: When deployed to GitHub Pages project sites, routes are served under
        a base path like <code>/repo-name</code>. This project is configured to
        handle that automatically during GitHub Actions builds.
      </Text>

      <Link
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        color="brand.600"
      >
        View on GitHub
      </Link>
    </Stack>
  );
}

