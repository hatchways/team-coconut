import React from "react";
import { CardMedia, makeStyles } from "@material-ui/core";

function CurrentPlayerVideo({ videoStream }) {
  const classes = useStyles();

  return (
    <CardMedia
      className={classes.playerCam}
      component="video"
      ref={videoStream}
      muted
      autoPlay
    />
  );
}

const useStyles = makeStyles((theme) => ({
  playerCam: {
    minWidth: "250px",
    height: "250px",
    backgroundSize: "contain",
    borderBottom: "solid 1px rgba(255,255,255,0.15)",
  },
}));

export default CurrentPlayerVideo;
