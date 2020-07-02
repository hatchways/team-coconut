import { createMuiTheme } from "@material-ui/core";

const blue = "#232549";
const orange = "#FF701C";
const white = "#FFFFFF";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h6: {
      fontWeight: 300,
    },
  },
  palette: {
    text: {
      primary: white, // primary font color is white
      secondary: orange, // accent font color is a dark orange
    },
    background: {
      paper: blue, // all paper components are a dark blue
    },
  },
  shape: {
    borderRadius: 20,
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        "&$focused $notchedOutline": {
          borderColor: orange, // larger border on focus with dark orange color
          borderWidth: 3,
        },
      },
      notchedOutline: {
        borderRadius: "4px",
      },
    },
    MuiFormHelperText: {
      root: {
        color: orange,
        fontSize: "0.825rem",
        fontWeight: "bold",
      },
    },
    MuiSvgIcon: {
      root: {
        fontSize: "100px",
      },
    },
  },
});
