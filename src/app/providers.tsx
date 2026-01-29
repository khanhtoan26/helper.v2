"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { system } from "@/theme";

export function Providers(props: { 
  children: React.ReactNode;
}) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider defaultTheme="dark">
        {props.children}
      </ColorModeProvider>
    </ChakraProvider>
  );
}

