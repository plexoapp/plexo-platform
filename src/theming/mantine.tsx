import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { setCookie } from "cookies-next";
import { useState, ReactNode } from "react";

import Fonts from "theming/fonts";
import { colorBrandDark, colorBrandPrimary } from "theming";

export const useColorScheme = (initialColorScheme: ColorScheme) => {
  const [currentColorScheme, setColorScheme] = useState<ColorScheme>(initialColorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (currentColorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };
  return { currentColorScheme, toggleColorScheme };
};

interface MantineProviderProps {
  children: ReactNode;
  colorScheme: ColorScheme;
}

export const MyMantineProvider = ({ children, colorScheme }: MantineProviderProps) => {
  const { currentColorScheme, toggleColorScheme } = useColorScheme(colorScheme);
  return (
    <>
      <ColorSchemeProvider colorScheme={currentColorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: currentColorScheme,
            fontFamily: "Open Sans",
            colors: {
              brand: colorBrandPrimary,
              dark: colorBrandDark,
            },
            primaryColor: "brand",
            components: {
              Tooltip: {
                styles: theme => ({
                  tooltip: {
                    fontSize: theme.fontSizes.xs,
                    background:
                      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
                    color:
                      theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.dark[4],
                  },
                }),
              },
            },
          }}
        >
          <ModalsProvider>
            <Notifications />
            <Fonts />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};
