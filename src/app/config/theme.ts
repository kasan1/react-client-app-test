import { ThemeOptions } from '@material-ui/core/styles';

export const darkTheme: ThemeOptions = {
  palette: {
    type: 'dark',
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: 'Open sans',
    htmlFontSize: 10,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1367,
      xl: 1920,
    },
  },
};

export const lightTheme: ThemeOptions = {
  palette: {
    type: 'light',
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: 'Open sans',
    htmlFontSize: 10,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1367,
      xl: 1920,
    },
  },
};
