import React from "react";
import {
    Grid,
    Card,
    CardMedia,
    makeStyles
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

function CurrentPlayerTile({ email, videoStream }) {
    const classes = useStyles();

    return (
        <Grid item xs={6}>
            <Card className={classes.card} raised>
                <CardMedia className={classes.playerCam} component="video" ref={videoStream} muted autoPlay />
                <div className={classes.playerInfoContainer}>
                    <div className={classes.playerInfo}>
                        {email}:<strong className={classes.clue}>Clue</strong>
                    </div>
                    <CheckCircleIcon className={classes.icon} />
                </div>
            </Card>
        </Grid>
    )
};

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: "350px",
        margin: "0 auto",
        borderRadius: theme.shape.borderRadius,
    },
    playerCam: {
        minWidth: "250px",
        height: "250px",
        backgroundSize: "contain", // change to cover with video I think is best option - Darren
        borderBottom: "solid 1px rgba(255,255,255,0.15)",
    },
    playerInfoContainer: {
        margin: "0.75rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // border: "solid pink 1px",
    },
    playerInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        // border: "solid green 1px",
    },
    clue: {
        margin: "0 0 0.25rem 1rem",
        fontSize: "2rem",
    },
    icon: {
        fontSize: theme.icon.small.fontSize,
    },
    video: {
        maxWidth: "350px",
        margin: "0 auto",
        borderRadius: theme.shape.borderRadius,
    }
}));


export default CurrentPlayerTile
