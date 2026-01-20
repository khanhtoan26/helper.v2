"use client";

import { decodeBase64Safe, encodeBase64 } from "@/lib/base64";
import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function Base64Page() {
  const [plain, setPlain] = useState("hello world");
  const [b64, setB64] = useState("");
  const [error, setError] = useState("");

  function onEncode() {
    const res = encodeBase64(plain);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError("");
    setB64(res.value);
  }

  function onDecode() {
    const res = decodeBase64Safe(b64);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError("");
    setPlain(res.value);
  }

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">Base64 Encode/Decode</Heading>
        <Text color="muted" mt="2">
          Encode plain text to Base64 and decode it back. UTF-8 safe. Runs
          locally in your browser.
        </Text>
      </Box>

      {error ? (
        <Alert.Root status="error" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Conversion error</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : null}

      <Box
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="md"
        p={{ base: "4", md: "5" }}
      >
        <Stack gap="4">
          <Stack gap="2">
            <Flex align="center" justify="space-between" wrap="wrap" gap="3">
              <Text fontWeight="600">Plain text</Text>
              <HStack gap="2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if (!plain) return;
                    await copyToClipboard(plain);
                  }}
                  disabled={!plain}
                >
                  Copy
                </Button>
              </HStack>
            </Flex>
            <Textarea
              value={plain}
              onChange={(e) => setPlain(e.target.value)}
              placeholder="Type plain text here…"
              fontFamily="mono"
              minH="160px"
              resize="vertical"
            />
          </Stack>

          <HStack gap="2" wrap="wrap">
            <Button colorPalette="brand" onClick={onEncode}>
              Encode →
            </Button>
            <Button variant="outline" onClick={onDecode}>
              ← Decode
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPlain((p) => {
                  const next = b64;
                  setB64(p);
                  return next;
                });
                setError("");
              }}
            >
              Swap
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPlain("");
                setB64("");
                setError("");
              }}
            >
              Clear
            </Button>
          </HStack>

          <Separator />

          <Stack gap="2">
            <Flex align="center" justify="space-between" wrap="wrap" gap="3">
              <Text fontWeight="600">Base64</Text>
              <HStack gap="2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if (!b64) return;
                    await copyToClipboard(b64);
                  }}
                  disabled={!b64}
                >
                  Copy
                </Button>
              </HStack>
            </Flex>
            <Textarea
              value={b64}
              onChange={(e) => setB64(e.target.value)}
              placeholder="Base64 appears here…"
              fontFamily="mono"
              minH="160px"
              resize="vertical"
            />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

