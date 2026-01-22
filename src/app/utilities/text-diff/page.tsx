"use client";

import { diffTextWords } from "@/lib/textDiff";
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

function Segment(props: { kind: "added" | "removed" | "unchanged"; text: string }) {
  if (!props.text) return null;
  const bg =
    props.kind === "added"
      ? { base: "green.50", _dark: "green.900" }
      : props.kind === "removed"
        ? { base: "red.50", _dark: "red.900" }
        : "transparent";
  const color =
    props.kind === "added"
      ? { base: "green.800", _dark: "green.200" }
      : props.kind === "removed"
        ? { base: "red.800", _dark: "red.200" }
        : "inherit";
  const deco =
    props.kind === "removed"
      ? "line-through"
      : props.kind === "added"
        ? "none"
        : "none";

  return (
    <Box
      as="span"
      px="1"
      py="0.5"
      borderRadius="sm"
      bg={bg}
      color={color}
      textDecoration={deco}
      fontFamily="mono"
      whiteSpace="pre-wrap"
    >
      {props.text}
    </Box>
  );
}

export default function TextDiffPage() {
  const [left, setLeft] = useState("The quick brown fox\njumps over the lazy dog.");
  const [right, setRight] = useState(
    "The quick brown cat\njumped over a very lazy dog.",
  );

  const diff = useMemo(() => diffTextWords(left, right), [left, right]);

  const summary = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const d of diff) {
      const words = d.text.split(/\s+/).filter(Boolean).length;
      if (d.type === "added") added += words;
      if (d.type === "removed") removed += words;
    }
    return { added, removed };
  }, [diff]);

  return (
    <Stack gap="6">
      <Box>
        <Heading size="lg">Text Diff</Heading>
        <Text color="muted" mt="2">
        Compare two text segments and highlight additions/deletions at the word/character level.
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
              <Text fontWeight="600">Text A</Text>
              <Textarea
                value={left}
                onChange={(e) => setLeft(e.target.value)}
                fontFamily="mono"
                minH="160px"
                resize="vertical"
              />
            </Stack>
            <Stack gap="2">
              <Text fontWeight="600">Text B</Text>
              <Textarea
                value={right}
                onChange={(e) => setRight(e.target.value)}
                fontFamily="mono"
                minH="160px"
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
                +{summary.added} / -{summary.removed} (words)
              </Text>
            </Flex>
          </HStack>

          <Separator />

          <Box>
            <Text fontWeight="600" mb="2">
              Diff view (merged)
            </Text>
            <Box
              bg="bg"
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
              p="3"
              minH="140px"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              fontFamily="mono"
            >
              {diff.map((d, idx) => (
                <Segment key={`merged-${idx}-${d.type}`} kind={d.type} text={d.text} />
              ))}
            </Box>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            <Box>
              <Text fontWeight="600" mb="2">
                View A (perspective of A)
              </Text>
              <Box
                bg="bg"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p="3"
                minH="140px"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                fontFamily="mono"
              >
                {diff.map((d, idx) => (
                  <Segment
                    key={`left-${idx}-${d.type}`}
                    kind={
                      d.type === "added"
                        ? "removed"
                        : d.type === "removed"
                          ? "added"
                          : "unchanged"
                    }
                    text={d.text}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Text fontWeight="600" mb="2">
                View B (perspective of B)
              </Text>
              <Box
                bg="bg"
                borderWidth="1px"
                borderColor="border"
                borderRadius="md"
                p="3"
                minH="140px"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                fontFamily="mono"
              >
                {diff.map((d, idx) => (
                  <Segment
                    key={`right-${idx}-${d.type}`}
                    kind={d.type}
                    text={d.text}
                  />
                ))}
              </Box>
            </Box>
          </SimpleGrid>
        </Stack>
      </Box>
    </Stack>
  );
}

