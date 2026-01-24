"use client";

import {
  Alert,
  Badge,
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
import { useState } from "react";
import { autoDecodeJson } from "@/lib/jsonDecode";

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function JsonDecoderPage() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [decoded, setDecoded] = useState<string>("");
  const [error, setError] = useState<string>("");

  function handleDecode() {
    if (!input.trim()) {
      setError("Input is empty");
      setOutput("");
      setDecoded("");
      return;
    }

    const result = autoDecodeJson(input);

    if (!result.success) {
      setError(result.error || "Failed to decode");
      setOutput("");
      setDecoded(result.decoded || "");
      return;
    }

    setError("");
    setDecoded(result.decoded || "");
    setOutput(result.formatted || "");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setDecoded("");
    setError("");
  }

  function handleCopyFormatted() {
    copyToClipboard(output);
  }

  function handleCopyDecoded() {
    copyToClipboard(decoded);
  }

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">JSON Decoder</Heading>
        <Text color="muted" mt="2">
          Decode escaped/stringified JSON from server logs. Handles multiple levels
          of escaping including <Code>\n</Code>, <Code>\"</Code>, <Code>\\</Code>, etc.
        </Text>
        <Alert.Root status="info" variant="subtle" mt="4">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description fontSize="sm">
              This tool automatically detects and decodes multiple levels of JSON
              stringification. Perfect for logs that have been JSON.stringify() multiple times.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Box>

      {error && (
        <Alert.Root status="error" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Decode Failed</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      <Box>
        <Flex justify="space-between" align="center" mb="2">
          <Text fontWeight="600">Escaped JSON Input</Text>
          <Text fontSize="sm" color="muted">
            Paste your escaped/stringified JSON
          </Text>
        </Flex>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Example:\n"{\"name\":\"John\",\"message\":\"Hello\\nWorld\"}"\n\nOr:\n"{\\"userId\\":\\"123\\",\\"data\\":\\"test\\"}"`}
          fontFamily="mono"
          fontSize="sm"
          rows={8}
          bg="surface"
          borderColor="border"
        />
        <Flex mt="2" gap="2" align="center">
          <Text fontSize="xs" color="muted">
            Common in server logs, API responses, or multi-level JSON.stringify()
          </Text>
        </Flex>
      </Box>

      <HStack>
        <Button onClick={handleDecode} colorPalette="brand">
          Decode & Format
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear All
        </Button>
      </HStack>

      {decoded && decoded !== output && (
        <>
          <Separator />

          <Box>
            <Flex justify="space-between" align="center" mb="3">
              <Heading size="md">Decoded (Raw)</Heading>
              <Button size="sm" variant="ghost" onClick={handleCopyDecoded}>
                Copy
              </Button>
            </Flex>
            <Box
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
              p="4"
              overflow="auto"
              maxH="400px"
            >
              <Code
                as="pre"
                fontSize="sm"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                bg="transparent"
              >
                {decoded}
              </Code>
            </Box>
            <Text fontSize="xs" color="muted" mt="2">
              This is the unescaped version before formatting
            </Text>
          </Box>
        </>
      )}

      {output && (
        <>
          <Separator />

          <Box>
            <Flex justify="space-between" align="center" mb="3">
              <Flex align="center" gap="2">
                <Heading size="md">Formatted Output</Heading>
                <Badge colorPalette="green">Valid JSON</Badge>
              </Flex>
              <Button size="sm" variant="ghost" onClick={handleCopyFormatted}>
                Copy
              </Button>
            </Flex>
            <Box
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
              p="4"
              overflow="auto"
              maxH="500px"
            >
              <Code
                as="pre"
                fontSize="sm"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                bg="transparent"
              >
                {output}
              </Code>
            </Box>
            <Text fontSize="xs" color="muted" mt="2">
              Formatted with 2-space indentation
            </Text>
          </Box>
        </>
      )}

      {/* Example Section */}
      <Box
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="md"
        p="5"
      >
        <Heading size="sm" mb="3">
          Example Use Cases
        </Heading>
        <Stack gap="3" fontSize="sm">
          <Box>
            <Text fontWeight="600" mb="1">
              1. Server Logs with Escaped Newlines
            </Text>
            <Code
              display="block"
              p="2"
              bg="bg"
              borderRadius="sm"
              fontSize="xs"
              whiteSpace="pre-wrap"
            >
              {`"{\\"level\\":\\"error\\",\\"message\\":\\"Failed\\nto\\nconnect\\"}"`}
            </Code>
          </Box>

          <Box>
            <Text fontWeight="600" mb="1">
              2. Double-Stringified JSON
            </Text>
            <Code
              display="block"
              p="2"
              bg="bg"
              borderRadius="sm"
              fontSize="xs"
              whiteSpace="pre-wrap"
            >
              {`"{\\"data\\":\\"{\\\\\\"user\\\\\\":\\\\\\"John\\\\\\"}\\"}"`}
            </Code>
          </Box>

          <Box>
            <Text fontWeight="600" mb="1">
              3. Escaped Quotes in Values
            </Text>
            <Code
              display="block"
              p="2"
              bg="bg"
              borderRadius="sm"
              fontSize="xs"
              whiteSpace="pre-wrap"
            >
              {`"{\\"name\\":\\"John \\\\\\"Doe\\\\\\"\\",\\"status\\":\\"active\\"}"`}
            </Code>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
