import React from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/core";

function Settings() {
  const classes = useStyles();
  return (
    <div>
      <SettingsIcon className={classes.icon} />
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: theme.icon.small.fontSize,
    color: theme.palette.text.primary,
    cursor: "pointer",
  },
}));

export default Settings;
