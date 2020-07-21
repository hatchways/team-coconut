import React, { useContext, useEffect } from "react";
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  Card
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { GameplayContext } from "../../context/GameplayContext";
import TypingNotification from "./TypingNotification";
import CurrentPlayerVideo from './CurrentPlayerVideo';
import { RTCContext } from '../../context/RTCContext';
import PlayerVideo from "./PlayerVideo";

function PlayerPanel({ gameId }) {
  const classes = useStyles();
  const { gameState, showTypingNotification } = useContext(GameplayContext);
  const { email: currentUser } = JSON.parse(localStorage.getItem("user"));

  let players;
  if (gameState.hasOwnProperty("state")) {
    players = gameState.state.players;
  } else {
    players = gameState.players;
  }
  const { currentPlayerVideo, initVideoCall, peers } = useContext(RTCContext);
  useEffect(() => {
    initVideoCall(gameId);
  }, [gameId, initVideoCall])

  return (
    <Container className={classes.sectionContainer} component="section">
      <Grid container spacing={6}>
        {players.map((player) => (
          <Grid key={player.id} item xs={6}>
            <Card className={classes.card} raised>
              {
                player.id === currentUser
                  ? <CurrentPlayerVideo videoStream={currentPlayerVideo} />
                  : <PlayerVideo videoPeer={peers[player.id]} />
              }
              <div className={classes.playerInfoContainer}>
                <div>
                  <div className={classes.playerInfo}>
                    <Typography variant="h6" component="p">
                      {player.name}
                      {currentUser === player.id ? " — You" : ": "}
                    </Typography>
                    {currentUser !== player.id && (
                      <div className={classes.clue}>
                        {showTypingNotification ? (
                          <TypingNotification />
                        ) : (
                            <p>Clue</p>
                          )}
                      </div>
                    )}
                  </div>
                  <div className={classes.scoreText}>{player.point} pts</div>
                </div>
                <CheckCircleIcon className={classes.icon} />
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

const staticImg =
  "https://www.bungie.net/common/destiny2_content/icons/28f45711da09ad4b22c67be7bacf038a.png";


// Uncomment all borders to see where things line up on the page
// There could be a better way of laying out where things should be
// but I am currently unsure - Darren
const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    maxWidth: "350px",
    margin: "0 auto",
    borderRadius: theme.shape.borderRadius,
  },
  playerCam: {
    minWidth: "250px",
    height: "250px",
    backgroundSize: "contain",
    borderBottom: "solid 1px rgba(255,255,255,0.15)",
  },
  playerInfoContainer: {
    margin: "0.75rem 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
  },
  scoreText: {
    marginBottom: "0.25rem",
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.secondary,
  },
  clue: {
    margin: "0 0 0 1rem",
    //fontSize: "1rem",
  },
  icon: {
    fontSize: theme.icon.small.fontSize,
  },
}));

export default PlayerPanel;
