import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    button: {
      letterSpacing: "1.5px", // increased letter spacing for readability
    },
  },
  palette: {
    text: {
      primary: "#FFFFFF", // primary font color is white
      secondary: "#FF701C", // accent font color is a dark orange
    },
    background: {
      paper: "#232549", // all paper components are a dark blue
    },
  },
  shape: {
    borderRadius: 20,
  },
});
