"use client";

import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Separator,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { calculateSum, formatNumber, parseNumbers } from "@/lib/calculator";

export default function SumCalculatorPage() {
  const [input, setInput] = useState<string>("");

  const result = useMemo(() => {
    if (!input.trim()) {
      return null;
    }

    const parsed = parseNumbers(input);
    
    if (parsed.error) {
      return { error: parsed.error, parsed };
    }

    if (parsed.numbers.length === 0 && parsed.invalidValues.length > 0) {
      return {
        error: "No valid numbers found",
        parsed,
      };
    }

    const stats = calculateSum(parsed.numbers);

    return {
      parsed,
      stats,
    };
  }, [input]);

  function handleClear() {
    setInput("");
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">Sum Calculator</Heading>
        <Text color="muted" mt="2">
          Enter numbers separated by spaces, newlines, or commas. Get instant sum
          and statistics.
        </Text>
      </Box>

      <Box>
        <Flex justify="space-between" align="center" mb="2">
          <Text fontWeight="600">Numbers</Text>
          <HStack gap="2">
            <Text fontSize="sm" color="muted">
              {input.trim() ? `${input.split(/[\s,]+/).filter(s => s.trim()).length} items` : "Empty"}
            </Text>
            {input.trim() && (
              <Button size="sm" variant="ghost" onClick={handleClear}>
                Clear
              </Button>
            )}
          </HStack>
        </Flex>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter numbers (one per line or space-separated):&#10;123&#10;456&#10;789&#10;&#10;Or: 123 456 789"
          fontFamily="mono"
          fontSize="sm"
          rows={10}
          bg="surface"
          borderColor="border"
        />
        <Text fontSize="xs" color="muted" mt="2">
          Supports decimals, negative numbers, and mixed separators (spaces, newlines, commas)
        </Text>
      </Box>

      {result?.error && (
        <Alert.Root status="warning" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Warning</Alert.Title>
            <Alert.Description>{result.error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {result?.parsed && result.parsed.invalidValues.length > 0 && (
        <Alert.Root status="warning" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Invalid Values Ignored</Alert.Title>
            <Alert.Description>
              {result.parsed.invalidValues.length} value(s) could not be parsed as numbers:{" "}
              <Text as="span" fontFamily="mono" fontSize="sm">
                {result.parsed.invalidValues.slice(0, 5).join(", ")}
                {result.parsed.invalidValues.length > 5 && "..."}
              </Text>
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {result?.stats && (
        <>
          <Separator />

          {/* Main Sum Display */}
          <Box
            bg="surface"
            borderWidth="1px"
            borderColor="border"
            borderRadius="lg"
            p="6"
            textAlign="center"
          >
            <Text fontSize="sm" color="muted" mb="2">
              Total Sum
            </Text>
            <Flex justify="center" align="baseline" gap="2">
              <Heading size="2xl" fontFamily="mono">
                {formatNumber(result.stats.sum)}
              </Heading>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(String(result.stats.sum))}
              >
                Copy
              </Button>
            </Flex>
            <Badge colorPalette="brand" mt="3">
              {result.stats.count} number{result.stats.count !== 1 ? "s" : ""}
            </Badge>
          </Box>

          {/* Statistics Grid */}
          <Box>
            <Heading size="md" mb="3">
              Statistics
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap="4"
            >
              <Box
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p="4"
              >
                <Text fontSize="sm" color="muted" mb="1">
                  Count
                </Text>
                <Text fontSize="xl" fontWeight="600" fontFamily="mono">
                  {formatNumber(result.stats.count, 0)}
                </Text>
              </Box>

              <Box
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p="4"
              >
                <Text fontSize="sm" color="muted" mb="1">
                  Average
                </Text>
                <Text fontSize="xl" fontWeight="600" fontFamily="mono">
                  {formatNumber(result.stats.average)}
                </Text>
              </Box>

              <Box
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p="4"
              >
                <Text fontSize="sm" color="muted" mb="1">
                  Minimum
                </Text>
                <Text fontSize="xl" fontWeight="600" fontFamily="mono">
                  {formatNumber(result.stats.min)}
                </Text>
              </Box>

              <Box
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p="4"
              >
                <Text fontSize="sm" color="muted" mb="1">
                  Maximum
                </Text>
                <Text fontSize="xl" fontWeight="600" fontFamily="mono">
                  {formatNumber(result.stats.max)}
                </Text>
              </Box>
            </Grid>
          </Box>

          {/* Number List */}
          <Box>
            <Heading size="md" mb="3">
              Valid Numbers ({result.parsed.numbers.length})
            </Heading>
            <Box
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
              p="4"
              maxH="300px"
              overflow="auto"
            >
              <Flex flexWrap="wrap" gap="2">
                {result.parsed.numbers.map((num, idx) => (
                  <Badge
                    key={idx}
                    colorPalette="gray"
                    fontFamily="mono"
                    fontSize="sm"
                    px="3"
                    py="1"
                  >
                    {formatNumber(num)}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </Box>
        </>
      )}

      {!input.trim() && (
        <Box
          bg="surface"
          borderWidth="1px"
          borderColor="border"
          borderRadius="md"
          p="6"
          textAlign="center"
        >
          <Text color="muted">
            Enter numbers above to see calculations
          </Text>
        </Box>
      )}
    </Stack>
  );
}
