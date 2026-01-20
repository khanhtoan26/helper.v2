"use client";

import NextLink from "next/link";
import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import type { UtilityMeta } from "@/lib/utilities";

export function UtilityCard(props: { utility: UtilityMeta }) {
  const u = props.utility;
  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      p="5"
    >
      <Flex align="start" justify="space-between" gap="3">
        <Box>
          <Flex align="center" gap="2">
            <Text fontWeight="700" fontSize="lg">
              {u.name}
            </Text>
            {u.isNew ? <Badge colorPalette="brand">New</Badge> : null}
          </Flex>
          <Text color="muted" mt="1">
            {u.description}
          </Text>
          <Text color="muted" fontSize="sm" mt="2">
            Category: {u.category}
          </Text>
        </Box>
      </Flex>

      <Button asChild mt="4" colorPalette="brand" variant="solid">
        <NextLink href={u.path}>Open</NextLink>
      </Button>
    </Box>
  );
}

