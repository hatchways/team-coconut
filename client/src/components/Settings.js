import React, { useState, useContext } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import VideocamIcon from "@material-ui/icons/Videocam";
import Mic from "@material-ui/icons/Mic";
import { makeStyles, IconButton, Menu, MenuItem } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import { RTCContext } from "../context/RTCContext";

function Settings() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { playerAudioOn, playerVideoOn, switchVideo, switchAudio } = useContext(
    RTCContext
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <SettingsIcon className={classes.icon} />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock
      >
        <MenuItem disableTouchRipple={true}>
          <VideocamIcon />
          <Switch
            checked={playerVideoOn}
            onChange={switchVideo}
            size="small"
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </MenuItem>
        <MenuItem disableTouchRipple={true}>
          <Mic />
          <Switch
            checked={playerAudioOn}
            onChange={switchAudio}
            size="small"
            name="checkedB"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </MenuItem>
      </Menu>
    </>
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
