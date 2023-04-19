import { Box, ChakraProvider, useColorMode } from "@chakra-ui/react";
import type { Decorator, Preview } from "@storybook/react";
import React, { useEffect } from "react";
import theme from '../src/theme';
import { useDarkMode } from 'storybook-dark-mode';
import { themes } from '@storybook/theming';

const withTheme: Decorator = (StoryFn, context) => {
  return (
    <ChakraProvider theme={theme}  >
      <DocumentationWrapper context={context}>
        <StoryFn />
      </DocumentationWrapper>
    </ChakraProvider>
  )
}


const DocumentationWrapper = ({ children, context }) => {
  const isDarkMode = useDarkMode();
  const { colorMode, setColorMode } = useColorMode();

  // Update color mode
  useEffect(() => {
    // Add timeout to prevent unsync color mode between docs and classic modes
    const timer = setTimeout(() => {
      console.log(isDarkMode);
      if (isDarkMode) {
        setColorMode('dark');
      } else {
        setColorMode('light');
      }
    });
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  return (
    <Box
      id="storybook-wrapper"
      p="4"
      pb="8"
      bg={colorMode === 'dark' ? 'gray.900' : 'white'}
      flex="1"
    >
      {children}
    </Box>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      dark: {
        ...themes.dark,
      },
      light: {
        ...themes.normal,
      },
    },
  },
};


export default preview;
