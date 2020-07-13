import React from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  makeStyles,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

function PlayerPanel() {
  const classes = useStyles();
  return (
    <Container className={classes.sectionContainer} component="section">
      <Grid container spacing={6}>
        {players.map((player) => (
          <Grid key={player} item xs={6}>
            <Card className={classes.card} raised>
              <CardMedia className={classes.playerCam} image={staticImg} />
              <div className={classes.playerInfoContainer}>
                <div className={classes.playerInfo}>
                  {player}:<strong className={classes.clue}>Clue</strong>
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

const players = ["BOT Vitaliy", "BOT Cayde-6", "BOT Cortana", "BOT Doomslayer"];
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
    // border: "solid white 1px",
  },
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
}));

export default PlayerPanel;
