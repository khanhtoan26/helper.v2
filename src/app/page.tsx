import { Box, Button, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { UtilityCard } from "@/components/UtilityCard";
import { utilities } from "@/lib/utilities";

export default function Home() {
  return (
    <Box>
      <Flex direction="column" gap="3" mb="8">
        <Heading size={{ base: "lg", md: "xl" }}>
          Lightweight utilities, right in your browser
        </Heading>
        <Text color="muted" maxW="2xl">
          Format JSON, decode Base64, and add more tools over time. Everything
          runs locally in your browser.
        </Text>
        <Flex gap="3" wrap="wrap" mt="2">
          <Button asChild colorPalette="brand">
            <NextLink href="/utilities/json-formatter">Open JSON Formatter</NextLink>
          </Button>
          <Button asChild variant="outline">
            <NextLink href="/utilities/base64">Open Base64 Tools</NextLink>
          </Button>
        </Flex>
      </Flex>

      <Heading size="md" mb="4">
        Utilities
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        {utilities.map((u) => (
          <UtilityCard key={u.id} utility={u} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
