import React, { createContext } from "react";
import Peer from "simple-peer";
import sockets from "../utils/sockets";

const RTCContext = createContext();

function RTCContextProvider({ children }) {
  async function getMediaStream() {
    return await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
  }

  function initCall(playerToCall, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (callerSignal) => {
      sockets.emit("starting-call", { playerToCall, caller, callerSignal });
    });

    return peer;
  }

  function answerCall(callerSignal, caller, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (answerSignal) => {
      sockets.emit("answering-call", { answerSignal, caller });
    });

    peer.signal(callerSignal);

    return peer;
  }

  return (
    <RTCContext.Provider value={{ getMediaStream, initCall, answerCall }}>
      {children}
    </RTCContext.Provider>
  );
}

export { RTCContext, RTCContextProvider };
