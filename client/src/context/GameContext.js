import React, { createContext, useState, useEffect, useCallback } from "react";
import sockets from "../utils/sockets";

const GameContext = createContext();

const GameContextProvider = ({ children }) => {
  const [game, setGame] = useState({ gameId: null, players: [], round: 0, word: '' });
  const [errors, setErrors] = useState({
    inviteError: "",
    joinError: "",
  });
  const [gameNotification, setGameNotification] = useState({
    open: false,
    msg: "",
  });

  //subcribe on events only once
  useEffect(() => {
    //user joins to the game
    sockets.on("FE-user-joined", (joinedPlayer) => {
      setGame((game) => {
        const players = [...game.players];
        const idx = players.findIndex(
          (player) => player.email === joinedPlayer
        );
        if (idx !== -1) {
          players[idx].status = "Joined";
        } else {
          players.push({ email: joinedPlayer, status: "Joined" });
        }
        return { ...game, players };
      });
      setGameNotification({
        open: true,
        msg: `${joinedPlayer} joined the game!`,
      });
    });
  }, []);

  const createGame = async () => {
    try {
      const response = await fetch("/game/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const { _id, players } = await response.json();
      setGame((game) => ({ ...game, gameId: _id, players }));
      sockets.emit("BE-user-joined", {
        gameId: _id,
        player: currentUser,
      });
      return _id;
    } catch (error) {
      console.log(error);
    }
  };

  const getGame = useCallback(async (gameId) => {
    try {
      const response = await fetch(`/game/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { _id, players } = await response.json();
      setGame((game) => ({ ...game, gameId: _id, players }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const joinGame = useCallback(async (gameId) => {
    try {
      const response = await fetch(`/game/${gameId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 400) {
        const { errors } = await response.json();
        const errorMsg = errors[0].msg;
        setErrors({ joinError: errorMsg });
        throw new Error(errorMsg);
      }
      const { _id, players } = await response.json();
      setGame((game) => ({ ...game, gameId: _id, players }));
      //notify other players
      const currentUser = JSON.parse(localStorage.getItem("user"));
      sockets.emit("BE-user-joined", {
        gameId: _id,
        player: currentUser,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const sendInvitation = async (email) => {
    const regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      setErrors({ inviteError: "Invalid email" });
      return;
    }

    const exists = game.players.find((player) => player.email === email);
    if (exists) {
      setErrors({ inviteError: "Player already invited" });
      return;
    }
    try {
      const response = await fetch(`/game/${game.gameId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const { players } = await response.json();
      setGame((game) => ({ ...game, players }));
      setErrors({ inviteError: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const setGameId = (gameId) => {
    setGame((game) => ({ ...game, gameId }));
  };

  const closeGameNotification = () => {
    setGameNotification({ open: false, msg: "" });
  };

  //checks if the user is the host of the game
  const isCurrentUserHost = () => {
    console.log("Game", game);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (game.players[0] && game.players[0].email === currentUser.email) {
      return true;
    }
    return false;
  };

  return (
    <GameContext.Provider
      value={{
        game,
        errors,
        gameNotification,
        createGame,
        sendInvitation,
        joinGame,
        getGame,
        closeGameNotification,
        isCurrentUserHost,
        setGameId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
