import React, { createContext, useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import sockets from "../utils/sockets";

const RTCContext = createContext();

function RTCContextProvider({ children }) {
  const [peers, setPeers] = useState();
  const peersRef = useRef();
  const userMediaRef = useRef();

  useEffect(() => {
    try {
      const stream = getMediaStream();

      if (userMediaRef.current) {
        userMediaRef.current.srcObject = stream;
      }

      // receive player socket ids from backend and invoke initCall() for each player
      // add each newly created peer to state
      sockets.on("get-player-socket-ids", (playerIds) => {
        const peersToCall = [];
        playerIds.forEach((id) => {
          const playerToCall = initCall(id, sockets.id, stream);
          peersRef.current.push({
            peerId: id,
            peer: playerToCall,
          });
          peersToCall.push({
            peerId: id,
            peer: playerToCall,
          });
        });
        setPeers(peersToCall);
      });

      // add caller to list of peers to render and peersRef
      // invoke answerCall() to accept caller signal and send returning signal to caller
      sockets.on("receiving-call", ({ callerSignal, caller }) => {
        console.log(`receiving call from ${caller}`);
        const peerToAnswer = answerCall(callerSignal, caller, stream);
        peersRef.current.push({
          peerId: caller,
          peer: peerToAnswer,
        });
        setPeers((prevPeers) => [
          ...prevPeers,
          { peerId: caller, peer: peerToAnswer },
        ]);
      });

      // look through each peer in peersRef and accept each individual returning signal/call back
      sockets.on("accept-call-back", ({ answerSignal, playerAnsweringId }) => {
        const peerToAccept = peersRef.current.find(
          (peer) => peer.peerId === playerAnsweringId
        );
        // accept returned call
        peerToAccept.signal(answerSignal);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

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

    // accept initiated call
    peer.signal(callerSignal);

    return peer;
  }

  async function getMediaStream() {
    return await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
  }

  return (
    <RTCContext.Provider
      value={{ peers, userMediaRef, getMediaStream, initCall, answerCall }}
    >
      {children}
    </RTCContext.Provider>
  );
}

export { RTCContext, RTCContextProvider };
