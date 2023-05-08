import tailwindColors from './tailwindColors';

const darkBlue = {
  50: '#93c5fd',
  100: '#60a5fa',
  200: '#3b82f6',
  300: '#2563eb',
  400: '#1d4ed8',
  500: '#1e40af',
  600: '#1e3a8a',
  700: '#1c2b6d',
  800: '#152540',
  900: '#0e182a',
};

export const colors = {
  // Update me with other Tailwind colors or with https://smart-swatch.netlify.app/
  brand: darkBlue,
  gray: tailwindColors.blueGray,

  success: tailwindColors.lime,
  green: tailwindColors.lime,

  error: tailwindColors.rose,
  red: tailwindColors.rose,

  warning: tailwindColors.amber,
  orange: tailwindColors.amber,

  info: tailwindColors.sky,
  blue: tailwindColors.sky,
  darkBlue: darkBlue
};
