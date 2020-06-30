import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      // could customize the h1 variant as well
    },
  },
  palette: {
    text: {
      primary: "#FFFFFF",
      secondary: "#FF701C",
    },
    background: {
      paper: "#232549",
      default: "#292E59",
    },
  },
});
