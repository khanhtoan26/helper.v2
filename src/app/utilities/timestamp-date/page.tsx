"use client";

import { unixMillisToIso, unixSecondsToIso } from "@/lib/datetime";
import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

export default function TimestampDatePage() {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<"seconds" | "millis">("seconds");

  const iso = useMemo(() => {
    const n = Number(value.trim());
    if (!Number.isFinite(n)) return "";
    return mode === "seconds" ? unixSecondsToIso(n) : unixMillisToIso(n);
  }, [mode, value]);

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">Timestamp ↔ Date</Heading>
        <Text color="muted" mt="2">
          Stub utility (extensible module pattern). Converts Unix timestamp to
          ISO date.
        </Text>
      </Box>

      <Box
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="md"
        p={{ base: "4", md: "5" }}
      >
        <Stack gap="3">
          <HStack gap="2" wrap="wrap">
            <Button
              variant={mode === "seconds" ? "solid" : "outline"}
              colorPalette={mode === "seconds" ? "brand" : undefined}
              onClick={() => setMode("seconds")}
            >
              Seconds
            </Button>
            <Button
              variant={mode === "millis" ? "solid" : "outline"}
              colorPalette={mode === "millis" ? "brand" : undefined}
              onClick={() => setMode("millis")}
            >
              Milliseconds
            </Button>
          </HStack>

          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1700000000"
            fontFamily="mono"
          />

          <Text fontWeight="600">ISO</Text>
          {iso ? (
            <Text fontFamily="mono">{iso}</Text>
          ) : (
            <Text fontSize="sm" color="muted">
              Enter a numeric timestamp to see an ISO date.
            </Text>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

