import { Styles, mode } from '@chakra-ui/theme-tools';

export const styles: Styles = {
  global: (props) => ({
    html: {
      bg: 'gray.50',
    },
    body: {
      bg: mode('gray.50', 'gray.800')(props),
      WebkitTapHighlightColor: 'transparent',
    },
    main: {
      bg: mode('gray.50', 'gray.800')(props),
    },
    '#chakra-toast-portal > *': {
      pt: 'safe-top',
      pl: 'safe-left',
      pr: 'safe-right',
      pb: 'safe-bottom',
    },
  }),
};
