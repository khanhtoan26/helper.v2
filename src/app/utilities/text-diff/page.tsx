"use client";

import { diffTextByLines } from "@/lib/textDiff";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

function Line(props: { kind: "added" | "removed" | "unchanged"; text: string }) {
  const bg =
    props.kind === "added"
      ? { base: "green.50", _dark: "green.900" }
      : props.kind === "removed"
        ? { base: "red.50", _dark: "red.900" }
        : "transparent";
  const borderColor =
    props.kind === "added"
      ? { base: "green.200", _dark: "green.700" }
      : props.kind === "removed"
        ? { base: "red.200", _dark: "red.700" }
        : "transparent";

  return (
    <Box
      px="2"
      py="1"
      bg={bg}
      borderLeftWidth={props.kind === "unchanged" ? "0" : "3px"}
      borderLeftColor={borderColor}
      fontFamily="mono"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
    >
      {props.text}
    </Box>
  );
}

export default function TextDiffPage() {
  const [left, setLeft] = useState("line 1\nline 2\nline 3\n");
  const [right, setRight] = useState("line 1\nline 2 changed\nline 3\nline 4\n");

  const diff = useMemo(() => diffTextByLines(left, right), [left, right]);

  const summary = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const d of diff) {
      if (d.type === "added") added += d.text.split("\n").filter(Boolean).length;
      if (d.type === "removed")
        removed += d.text.split("\n").filter(Boolean).length;
    }
    return { added, removed };
  }, [diff]);

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">Text Diff</Heading>
        <Text color="muted" mt="2">
          Compare two texts by lines and highlight added/removed content. Runs
          locally in your browser.
        </Text>
      </Box>

      <Box
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="md"
        p={{ base: "4", md: "5" }}
      >
        <Stack gap="4">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            <Stack gap="2">
              <Text fontWeight="600">Left</Text>
              <Textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                fontFamily="mono"
                minH="180px"
                resize="vertical"
              />
            </Stack>
            <Stack gap="2">
              <Text fontWeight="600">Right</Text>
              <Textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                fontFamily="mono"
                minH="180px"
                resize="vertical"
              />
            </Stack>
          </SimpleGrid>

          <HStack gap="2" wrap="wrap">
            <Button
              variant="ghost"
              onClick={() => {
                setLeft("");
                setRight("");
              }}
            >
              Clear
            </Button>
            <Flex align="center" gap="3" ml="auto">
              <Text fontSize="sm" color="muted">
                +{summary.added} / -{summary.removed}
              </Text>
            </Flex>
          </HStack>

          <Separator />

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            <Box>
              <Text fontWeight="600" mb="2">
                Left view
              </Text>
              <Box
                bg="bg"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                overflow="auto"
                maxH="360px"
              >
                {diff.map((d, idx) =>
                  d.type === "added" ? null : (
                    <Line
                      key={`${idx}-${d.type}`}
                      kind={d.type === "removed" ? "removed" : "unchanged"}
                      text={d.text}
                    />
                  ),
                )}
              </Box>
            </Box>

            <Box>
              <Text fontWeight="600" mb="2">
                Right view
              </Text>
              <Box
                bg="bg"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                overflow="auto"
                maxH="360px"
              >
                {diff.map((d, idx) =>
                  d.type === "removed" ? null : (
                    <Line
                      key={`${idx}-${d.type}`}
                      kind={d.type === "added" ? "added" : "unchanged"}
                      text={d.text}
                    />
                  ),
                )}
              </Box>
            </Box>
          </SimpleGrid>
        </Stack>
      </Box>
    </Stack>
  );
}

