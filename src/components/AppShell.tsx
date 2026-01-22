"use client";

import NextLink from "next/link";
import {
  Badge,
  Box,
  Button,
  Container,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Flex,
  HStack,
  Link,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { utilities } from "@/lib/utilities";

function UtilitiesMenu(props: { variant: "desktop" | "mobile" }) {
  const items = utilities;
  if (props.variant === "mobile") {
    return (
      <Stack gap="1">
        <Text fontSize="sm" color="fg.muted" mt="2">
          Utilities
        </Text>
        {items.map((u) => (
          <Button
            key={u.id}
            asChild
            variant="solid"
            justifyContent="space-between"
          >
            <NextLink href={u.path}>
              <Box textAlign="left">
                <Text fontWeight="600">{u.name}</Text>
                <Text fontSize="sm" color="muted">
                  {u.description}
                </Text>
              </Box>
              {u.isNew ? <Badge colorPalette="brand">New</Badge> : null}
            </NextLink>
          </Button>
        ))}
      </Stack>
    );
  }

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="ghost">Utilities</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent minW="320px" p="1" bg="surface" borderWidth="1px" borderColor="border">
          {items.map((u) => (
            <MenuItem key={u.id} asChild value={u.id}>
              <NextLink href={u.path}>
                <Flex align="center" gap="3" py="1">
                  <Box flex="1">
                    <Flex align="center" gap="2">
                      <Text fontWeight="600">{u.name}</Text>
                      {u.isNew ? (
                        <Badge size="sm" colorPalette="brand">
                          New
                        </Badge>
                      ) : null}
                    </Flex>
                    <Text fontSize="sm" color="muted">
                      {u.description}
                    </Text>
                  </Box>
                </Flex>
              </NextLink>
            </MenuItem>
          ))}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
}

export function AppShell(props: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" bg="bg">
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="10"
        bg="surface"
        borderBottomWidth="1px"
        borderColor="border"
      >
        <Container maxW="960px" py="2">
          <Flex align="center" gap="2">
            <Link asChild fontWeight="700">
              <NextLink href="/">Helper.v2</NextLink>
            </Link>

            <HStack gap="1" display={{ base: "none", md: "flex" }} ml="4">
              <Button asChild variant="ghost">
                <NextLink href="/">Home</NextLink>
              </Button>
              <UtilitiesMenu variant="desktop" />
              <Button asChild variant="ghost">
                <NextLink href="/about">About</NextLink>
              </Button>
            </HStack>

            <Spacer />

            <HStack gap="2">
              <Link
                asChild
                fontSize="sm"
                color="muted"
                display={{ base: "none", md: "inline-flex" }}
              >
                <a
                  href="https://github.com/khanhtoan26"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </Link>

              <DrawerRoot placement="top">
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    display={{ base: "inline-flex", md: "none" }}
                  >
                    Menu
                  </Button>
                </DrawerTrigger>
                  <DrawerBackdrop />
                  <DrawerPositioner padding="4">
                    <DrawerContent rounded="md" bg="surface">
                      <DrawerCloseTrigger />
                      <DrawerHeader>
                        <DrawerTitle>Menu</DrawerTitle>
                      </DrawerHeader>
                      <DrawerBody>
                        <Stack gap="2">
                          <Button asChild variant="ghost" justifyContent="flex-start">
                            <NextLink href="/">Home</NextLink>
                          </Button>
                          <Button asChild variant="ghost" justifyContent="flex-start">
                            <NextLink href="/about">About</NextLink>
                          </Button>
                          <UtilitiesMenu variant="desktop" />
                        </Stack>
                      </DrawerBody>
                    </DrawerContent>
                  </DrawerPositioner>
              </DrawerRoot>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="960px" py={{ base: "6", md: "10" }}>
        {props.children}
      </Container>

      {/* <Box as="footer" borderTopWidth="1px" borderColor="border" bg="surface">
        <Container maxW="960px" py="6">
          <Text fontSize="sm" color="muted">
            Built for quick, safe conversions in the browser. No data leaves your
            device.
          </Text>
        </Container>
      </Box> */}
    </Box>
  );
}

