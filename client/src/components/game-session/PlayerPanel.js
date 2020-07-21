import React, { useContext, useEffect } from "react";
import {
  Container,
  Grid,
  makeStyles,
} from "@material-ui/core";
import CurrentPlayerTile from './CurrentPlayerTile';
import { RTCContext } from '../../context/RTCContext';
import PlayerTile from "./PlayerTile";

function PlayerPanel({ players, gameId }) {
  const classes = useStyles();
  const currentPlayer = JSON.parse(localStorage.getItem('user'));
  const { currentPlayerVideo, initVideoCall, peers } = useContext(RTCContext);
  useEffect(()=>{
    initVideoCall(gameId);
  },[gameId, initVideoCall])

  return (
    <Container className={classes.sectionContainer} component="section">
      <Grid container spacing={6}>
        <CurrentPlayerTile email={currentPlayer.email} videoStream={currentPlayerVideo} />
        {
          players.map((player) => (
            player.email !== currentPlayer.email &&
            <PlayerTile key={player.email} email={player.email} videoPeer={peers[player.email]} />
          ))
        }
      </Grid>
    </Container>
  );
}


// Uncomment all borders to see where things line up on the page
// There could be a better way of laying out where things should be
// but I am currently unsure - Darren
const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // border: "solid white 1px",
  }
}));

export default PlayerPanel;
