import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003153",
      light: "#24577f",
      dark: "#001f3a",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#f5b841",
      contrastText: "#0f172a"
    },
    background: {
      default: "#f6f8fb",
      paper: "#ffffff"
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: "\"Quantico\", \"Inter\", \"Roboto\", sans-serif",
    button: {
      fontWeight: 700,
      textTransform: "none"
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained"
      },
      styleOverrides: {
        root: {
          minHeight: 42,
          boxShadow: "none"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        margin: "normal",
        variant: "outlined"
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          transition: "box-shadow 160ms ease, border-color 160ms ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#24577f"
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(0, 49, 83, 0.12)"
          }
        },
        notchedOutline: {
          borderColor: "#cbd5e1"
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#4b5563",
          "&.Mui-focused": {
            color: "#003153"
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0
        }
      }
    }
  }
});

export default theme;
