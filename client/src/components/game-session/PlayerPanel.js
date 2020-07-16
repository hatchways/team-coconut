import React, { useContext } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { GameplayContext } from "../../context/GameplayContext";

function PlayerPanel() {
  const classes = useStyles();
  const { gameState } = useContext(GameplayContext);
  const { email: currentUser } = JSON.parse(localStorage.getItem("user"));

  let players;
  if (gameState.hasOwnProperty("state")) {
    players = gameState.state.players;
  } else {
    players = gameState.players;
  }

  return (
    <Container className={classes.sectionContainer} component="section">
      <Grid container spacing={6}>
        {players.map((player) => (
          <Grid key={player.id} item xs={6}>
            <Card className={classes.card} raised>
              <CardMedia className={classes.playerCam} image={staticImg} />
              <div className={classes.playerInfoContainer}>
                <div>
                  <div className={classes.playerInfo}>
                    <Typography variant="h6" component="p">
                      {player.name}
                      {currentUser === player.id ? " — You" : ": "}
                    </Typography>
                    {currentUser !== player.id && (
                      <Typography
                        variant="h6"
                        component="p"
                        className={classes.clue}
                      >
                        Clue
                      </Typography>
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
