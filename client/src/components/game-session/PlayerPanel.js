import React, { useContext, useEffect } from "react";
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  Card,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { GameplayContext } from "../../context/GameplayContext";
import TypingNotification from "./TypingNotification";
import CurrentPlayerVideo from "./CurrentPlayerVideo";
import { RTCContext } from "../../context/RTCContext";
import PlayerVideoAudio from "./PlayerVideoAudio";
import Settings from "../Settings";
import Avatar from "../../icons/Avatar.png";

function PlayerPanel({ gameId }) {
  const classes = useStyles();
  const { gameState, isGuessPhase } = useContext(GameplayContext);
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
  }, [gameId, initVideoCall]);

  function renderPlayerInfo(player, playersArr) {
    if (!isGuessPhase) {
      if (player.isTyping && !player.clue) return <TypingNotification />;
      else if (player.clue) return <p>Submitted</p>;
    } else {
      const uniqueClues = playersArr
        .map(player => player["clue"])
        .filter((clue, index, a) => {
          return a.indexOf(clue) === a.lastIndexOf(clue);
        });
      let clueToRender;
      for (let i = 0; i < uniqueClues.length; i++) {
        if (uniqueClues[i] === player.clue) {
          return (clueToRender = <p>{player.clue}</p>);
        }
        clueToRender = <p className={classes.invalidClue}>* * * * * *</p>;
      }
      return clueToRender;
    }
  }

  return (
    <>
      <div className={classes.settings}>
        <Settings />
      </div>
      <Container className={classes.sectionContainer} component="section">
        <Grid container spacing={3}>
          {players.map((player, index, arr) => (
            <Grid key={player.id} item xs={6}>
              <Card className={classes.card} raised>
                {player.id === currentUser ? (
                  <div className={classes.avatar}>
                    <CurrentPlayerVideo videoStream={currentPlayerVideo} />
                  </div>
                ) : (
                  <div className={classes.avatar}>
                    <PlayerVideoAudio peerMedia={peers[player.id]} />
                  </div>
                )}
                <div className={classes.playerInfoContainer}>
                  <div>
                    <div className={classes.playerInfo}>
                      <Typography variant="h6" component="p">
                        {player.name}
                        {currentUser === player.id
                          ? " — You"
                          : player.isGuesser
                          ? " — Guesser"
                          : ": "}
                      </Typography>
                      {currentUser !== player.id && (
                        <div className={classes.clue}>
                          {renderPlayerInfo(player, arr)}
                        </div>
                      )}
                    </div>
                    <div className={classes.scoreText}>{player.point} pts</div>
                  </div>
                  {player.clue && <CheckCircleIcon className={classes.icon} />}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  sectionContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  settings: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: "1em 1em 0 0",
  },
  card: {
    maxWidth: "350px",
    margin: "0 auto",
    borderRadius: theme.shape.borderRadius,
  },
  avatar: {
    backgroundImage: `url(${Avatar})`,
    backgroundSize: "100px 100px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
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
    margin: "0 0 0.15rem 1rem",
    fontSize: "1.25rem",
    fontWeight: theme.typography.fontWeightBold,
  },
  invalidClue: {
    color: "red",
  },
  icon: {
    fontSize: theme.icon.small.fontSize,
  },
}));

export default PlayerPanel;
