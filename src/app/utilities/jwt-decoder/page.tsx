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
import { decodeJwt, formatTimestamp, isExpired } from "@/lib/jwt";

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function JwtDecoderPage() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  function handleDecode() {
    if (!input.trim()) {
      setError("Please enter a JWT token");
      setResult(null);
      return;
    }

    const decoded = decodeJwt(input);
    
    if (!decoded.isValid) {
      setError(decoded.error || "Invalid JWT token");
      setResult(null);
      return;
    }

    setError("");
    setResult(decoded);
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setError("");
  }

  function renderJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">JWT Decoder</Heading>
        <Text color="muted" mt="2">
          Decode and inspect JWT tokens. Decoding happens locally in your browser
          - no data is sent to any server.
        </Text>
        <Alert.Root status="info" variant="subtle" mt="4">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description fontSize="sm">
              This tool only <strong>decodes</strong> JWT tokens. It does not verify
              signatures or validate tokens.
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
          <Text fontWeight="600">JWT Token</Text>
          <Text fontSize="sm" color="muted">
            Paste your JWT token below
          </Text>
        </Flex>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          fontFamily="mono"
          fontSize="sm"
          rows={6}
          bg="surface"
          borderColor="border"
        />
      </Box>

      <HStack>
        <Button onClick={handleDecode} colorPalette="brand">
          Decode
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </HStack>

      {result && (
        <>
          <Separator />

          {/* Header Section */}
          <Box>
            <Flex justify="space-between" align="center" mb="3">
              <Heading size="md">Header</Heading>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(renderJson(result.header))}
              >
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
            >
              <Code
                as="pre"
                fontSize="sm"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                bg="transparent"
              >
                {renderJson(result.header)}
              </Code>
            </Box>
            
            {/* Header info */}
            {result.header && (
              <Flex gap="2" mt="2" flexWrap="wrap">
                {result.header.alg && (
                  <Badge colorPalette="blue">Algorithm: {result.header.alg}</Badge>
                )}
                {result.header.typ && (
                  <Badge colorPalette="gray">Type: {result.header.typ}</Badge>
                )}
              </Flex>
            )}
          </Box>

          {/* Payload Section */}
          <Box>
            <Flex justify="space-between" align="center" mb="3">
              <Heading size="md">Payload</Heading>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(renderJson(result.payload))}
              >
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
            >
              <Code
                as="pre"
                fontSize="sm"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                bg="transparent"
              >
                {renderJson(result.payload)}
              </Code>
            </Box>

            {/* Payload claims info */}
            {result.payload && (
              <Stack gap="2" mt="3">
                {result.payload.iss && (
                  <Flex gap="2" fontSize="sm">
                    <Text fontWeight="600" color="muted">Issuer (iss):</Text>
                    <Text>{result.payload.iss}</Text>
                  </Flex>
                )}
                {result.payload.sub && (
                  <Flex gap="2" fontSize="sm">
                    <Text fontWeight="600" color="muted">Subject (sub):</Text>
                    <Text>{result.payload.sub}</Text>
                  </Flex>
                )}
                {result.payload.aud && (
                  <Flex gap="2" fontSize="sm">
                    <Text fontWeight="600" color="muted">Audience (aud):</Text>
                    <Text>{Array.isArray(result.payload.aud) ? result.payload.aud.join(", ") : result.payload.aud}</Text>
                  </Flex>
                )}
                {result.payload.exp && (
                  <Flex gap="2" fontSize="sm" align="center">
                    <Text fontWeight="600" color="muted">Expires (exp):</Text>
                    <Text>{formatTimestamp(result.payload.exp)}</Text>
                    {isExpired(result.payload.exp) ? (
                      <Badge colorPalette="red">Expired</Badge>
                    ) : (
                      <Badge colorPalette="green">Valid</Badge>
                    )}
                  </Flex>
                )}
                {result.payload.nbf && (
                  <Flex gap="2" fontSize="sm">
                    <Text fontWeight="600" color="muted">Not Before (nbf):</Text>
                    <Text>{formatTimestamp(result.payload.nbf)}</Text>
                  </Flex>
                )}
                {result.payload.iat && (
                  <Flex gap="2" fontSize="sm">
                    <Text fontWeight="600" color="muted">Issued At (iat):</Text>
                    <Text>{formatTimestamp(result.payload.iat)}</Text>
                  </Flex>
                )}
                {result.payload.jti && (
                  <Flex gap="2" fontSize="sm">
                    <Text fontWeight="600" color="muted">JWT ID (jti):</Text>
                    <Text fontFamily="mono" fontSize="xs">{result.payload.jti}</Text>
                  </Flex>
                )}
              </Stack>
            )}
          </Box>

          {/* Signature Section */}
          <Box>
            <Flex justify="space-between" align="center" mb="3">
              <Heading size="md">Signature</Heading>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(result.signature || "")}
              >
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
            >
              <Code
                fontSize="sm"
                fontFamily="mono"
                whiteSpace="pre-wrap"
                wordBreak="break-all"
                bg="transparent"
              >
                {result.signature}
              </Code>
            </Box>
            <Text fontSize="sm" color="muted" mt="2">
              The signature is base64url encoded. To verify the signature, you need the
              secret key or public key (for asymmetric algorithms).
            </Text>
          </Box>
        </>
      )}
    </Stack>
  );
}
