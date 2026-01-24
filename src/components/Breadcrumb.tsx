"use client";

import { Box, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { utilities } from "@/lib/utilities";

export function Breadcrumb() {
  const pathname = usePathname();
  
  if (pathname === "/") {
    return null;
  }

  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbItems: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
  ];

  // Build breadcrumb path
  let currentPath = "";
  for (let i = 0; i < paths.length; i++) {
    currentPath += `/${paths[i]}`;
    
    let label = paths[i];
    
    // Special handling for utility pages
    if (paths[i] === "utilities" && i < paths.length - 1) {
      const utilitySlug = paths[i + 1];
      const utility = utilities.find((u) => u.slug === utilitySlug);
      if (utility) {
        breadcrumbItems.push({ label: "Utilities", href: "/" });
        breadcrumbItems.push({ label: utility.name, href: utility.path });
        break; // Skip the next iteration since we've handled it
      }
    } else if (paths[i] === "about") {
      label = "About";
      breadcrumbItems.push({ label, href: currentPath });
    } else if (i === 0 && paths[i] !== "utilities") {
      // Capitalize first letter for other pages
      label = label.charAt(0).toUpperCase() + label.slice(1);
      breadcrumbItems.push({ label, href: currentPath });
    }
  }

  return (
    <Box mb="4">
      <Flex align="center" gap="2" fontSize="sm" color="muted">
        {breadcrumbItems.map((item, index) => (
          <Flex key={item.href} align="center" gap="2">
            {index > 0 && (
              <Text color="muted" userSelect="none">
                /
              </Text>
            )}
            {index === breadcrumbItems.length - 1 ? (
              <Text color="fg" fontWeight="500">
                {item.label}
              </Text>
            ) : (
              <Link asChild _hover={{ color: "brand" }}>
                <NextLink href={item.href}>{item.label}</NextLink>
              </Link>
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
