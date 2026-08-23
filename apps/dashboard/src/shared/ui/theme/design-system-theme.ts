import {createTheme, type Theme} from "@mui/material/styles";

import type {HorizonTheme} from "@/shared/preferences/preferences";

type PaletteTokens = {
  mode: "dark" | "light";
  primary: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  bgDefault: string;
  bgPaper: string;
  textPrimary: string;
  textSecondary: string;
  divider: string;
  hover: string;
  selected: string;
};

const palettes: Record<HorizonTheme, PaletteTokens> = {
  dark: {
    mode: "dark",
    primary: "#6b7cff",
    primaryLight: "#8593ff",
    primaryDark: "#4f5fd6",
    onPrimary: "#ffffff",
    bgDefault: "#0b0f18",
    bgPaper: "#12182a",
    textPrimary: "#e8eaed",
    textSecondary: "#9aa3b5",
    divider: "#24304a",
    hover: "#1a2238",
    selected: "rgba(107, 124, 255, 0.14)",
  },
  light: {
    mode: "light",
    primary: "#3f51d8",
    primaryLight: "#6b7cff",
    primaryDark: "#2f3fbf",
    onPrimary: "#ffffff",
    bgDefault: "#f3f5fa",
    bgPaper: "#ffffff",
    textPrimary: "#151b2b",
    textSecondary: "#5b657a",
    divider: "#d0d7e6",
    hover: "#eef1f8",
    selected: "rgba(63, 81, 216, 0.12)",
  },
  contrast: {
    mode: "dark",
    primary: "#ff6a00",
    primaryLight: "#ff8533",
    primaryDark: "#ff6a00",
    onPrimary: "#000000",
    bgDefault: "#000000",
    bgPaper: "#000000",
    textPrimary: "#ff6a00",
    textSecondary: "#ff8533",
    divider: "#ff6a00",
    hover: "#140a00",
    selected: "#1a0c00",
  },
};

export function createDesignSystemTheme(themeName: HorizonTheme = "dark"): Theme {
  const tokens = palettes[themeName];

  return createTheme({
    palette: {
      mode: tokens.mode,
      primary: {
        main: tokens.primary,
        light: tokens.primaryLight,
        dark: tokens.primaryDark,
        contrastText: tokens.onPrimary,
      },
      background: {
        default: tokens.bgDefault,
        paper: tokens.bgPaper,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
      },
      divider: tokens.divider,
      action: {
        hover: tokens.hover,
        selected: tokens.selected,
      },
    },
    typography: {
      fontFamily: "system-ui, sans-serif",
      fontSize: 14,
    },
    shape: {
      borderRadius: themeName === "contrast" ? 0 : 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "transparent",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: tokens.bgPaper,
            border: `1px solid ${tokens.divider}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: tokens.divider,
          },
          head: {
            color: tokens.textSecondary,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            backgroundColor: tokens.bgPaper,
          },
          body: {
            fontSize: "0.9rem",
            color: tokens.textPrimary,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&.MuiTableRow-hover:hover": {
              backgroundColor: tokens.hover,
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor: tokens.bgDefault,
              "& fieldset": {
                borderColor: tokens.divider,
              },
              "&:hover fieldset": {
                borderColor: tokens.primary,
              },
              "&.Mui-focused fieldset": {
                borderColor: tokens.primary,
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: tokens.textSecondary,
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: tokens.textSecondary,
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "inherit",
          },
        },
      },
    },
  });
}
