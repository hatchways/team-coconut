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
  logo: {
    fontSize: "2em",
    fontWeight: "800",
    color: white,
  },
  gradient: {
    blue: {
      background:
        "linear-gradient(90deg, rgba(86,96,255,1) 0%, rgba(86,151,255,1) 100%)",
    },
    orange: {
      background:
        "linear-gradient(90deg, rgba(255,108,32,1) 0%, rgba(255,143,2,1) 100%)",
    },
  },
  icon: {
    small: {
      fontSize: "25px",
    },
    large: {
      fontSize: "100px",
    },
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
  },
});
