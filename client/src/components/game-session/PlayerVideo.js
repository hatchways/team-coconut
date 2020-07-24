import React, { useRef, useEffect } from "react";
import {
    CardMedia,
    makeStyles
} from "@material-ui/core";

function PlayerVideo({ videoPeer }) {
    const classes = useStyles();
    const videoRef = useRef();
    useEffect(() => {
        if (videoPeer) {
            videoPeer.on("stream", stream => {
                videoRef.current.srcObject = stream;
            });
        }
    }, [videoPeer]);

    return (
        <CardMedia className={classes.playerCam} component="video" ref={videoRef} autoPlay />
    )
};

const useStyles = makeStyles((theme) => ({
  playerCam: {
    minWidth: "250px",
    height: "250px",
    backgroundSize: "contain",
    borderBottom: "solid 1px rgba(255,255,255,0.15)",
  },
}));

export default PlayerVideo;
