import React, { useRef, useEffect } from "react";
import {
    CardMedia,
    makeStyles
} from "@material-ui/core";

function PlayerVideoAudio({ peerMedia }) {
    const classes = useStyles();
    const videoRef = useRef();
    const audioRef = useRef();

    useEffect(() => {
        if (peerMedia) {
            peerMedia.on("stream", stream => {
                if (stream.getVideoTracks()[0]) {
                    videoRef.current.id = stream.id;
                    videoRef.current.srcObject = stream;
                } else if (stream.getAudioTracks()[0]) {
                    audioRef.current.id = stream.id;
                    audioRef.current.srcObject = stream;
                }
            });
        }
    }, [peerMedia]);

    return (
        <>
            <CardMedia className={classes.playerCam} component="video" ref={videoRef} autoPlay />
            <CardMedia component="audio" ref={audioRef} autoPlay />
        </>
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

export default PlayerVideoAudio;
