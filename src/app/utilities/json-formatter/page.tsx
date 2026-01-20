"use client";

import { formatJson, minifyJson, parseJsonSafe } from "@/lib/json";
import {
  Alert,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function JsonFormatterPage() {
  const [input, setInput] = useState<string>('{"hello":"world"}');
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const stats = useMemo(() => {
    const lines = input.length === 0 ? 0 : input.split("\n").length;
    return { chars: input.length, lines };
  }, [input]);

  function onFormat() {
    const res = formatJson(input, 2);
    if (!res.ok) {
      setError(res.error);
      setOutput("");
      return;
    }
    setError("");
    setOutput(String(res.value));
  }

  function onMinify() {
    const res = minifyJson(input);
    if (!res.ok) {
      setError(res.error);
      setOutput("");
      return;
    }
    setError("");
    setOutput(String(res.value));
  }

  function onValidate() {
    const res = parseJsonSafe(input);
    if (!res.ok) {
      setError(res.error);
      setOutput("");
      return;
    }
    setError("");
    setOutput("Valid JSON");
  }

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">JSON Formatter</Heading>
        <Text color="muted" mt="2">
          Paste JSON, then format or minify it. All processing happens locally in
          your browser.
        </Text>
      </Box>

      {error ? (
        <Alert.Root status="error" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Invalid JSON</Alert.Title>
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
        <Stack gap="3">
          <Flex align="center" justify="space-between" wrap="wrap" gap="3">
            <Text fontWeight="600">Input</Text>
            <Text fontSize="sm" color="muted">
              {stats.lines} lines · {stats.chars} chars
            </Text>
          </Flex>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"a":1}'
            fontFamily="mono"
            minH="220px"
            resize="vertical"
          />
          <HStack gap="2" wrap="wrap">
            <Button colorPalette="brand" onClick={onFormat}>
              Format
            </Button>
            <Button variant="outline" onClick={onMinify}>
              Minify
            </Button>
            <Button variant="outline" onClick={onValidate}>
              Validate
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setInput("");
                setOutput("");
                setError("");
              }}
            >
              Clear
            </Button>
          </HStack>

          <Separator />

          <Flex align="center" justify="space-between" wrap="wrap" gap="3">
            <Text fontWeight="600">Output</Text>
            <HStack gap="2">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  if (!output) return;
                  await copyToClipboard(output);
                }}
                disabled={!output}
              >
                Copy
              </Button>
            </HStack>
          </Flex>

          {output ? (
            <Box
              bg="bg"
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
              p="4"
              overflow="auto"
            >
              {output === "Valid JSON" ? (
                <Text>
                  <Code colorPalette="green">Valid JSON</Code>
                </Text>
              ) : (
                <Code display="block" whiteSpace="pre" fontFamily="mono">
                  {output}
                </Code>
              )}
            </Box>
          ) : (
            <Text color="muted" fontSize="sm">
              Output will appear here.
            </Text>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

