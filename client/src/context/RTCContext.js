import React, { createContext, useState, useRef, useCallback } from "react";
import Peer from "simple-peer";
import sockets from "../utils/sockets";

const RTCContext = createContext();

function RTCContextProvider(props) {
  const [peers, setPeers] = useState({});
  const peersRef = useRef([]);
  const currentPlayerVideo = useRef();
  const [playerVideoOn, setPlayerVideoOn] = useState(false);
  const [playerAudioOn, setPlayerAudioOn] = useState(false);

  const initVideoCall = useCallback((gameId) => {
    try {
      getMediaStream().then(stream => {
        setPlayerVideoOn(true);
        setPlayerAudioOn(true);
        currentPlayerVideo.current.srcObject = stream;
        // receive player socket ids from backend and invoke initCall() for each player
        // add each newly created peer to state
        sockets.on("FE-players-in-room", (players) => {
          const peers = {};
          players.forEach(({ socketId, email }) => {
            console.log(`calling to ${email}`);
            const peer = initCall(socketId, sockets.id, stream);
            peersRef.current.push({
              peerId: socketId,
              peer: peer,
              email: email
            });
            peers[email] = peer;
          });
          setPeers(peers);
        });

        // add caller to list of peers to render and peersRef
        // invoke answerCall() to accept caller signal and send returning signal to caller
        sockets.on("FE-receive-call", ({ callerEmail, callerSignal, caller }) => {
          console.log(`receiving call from ${callerEmail}`);
          const peerToAnswer = answerCall(callerSignal, caller, stream);
          peersRef.current.push({
            peerId: caller,
            peer: peerToAnswer,
            email: callerEmail
          });
          setPeers((prevPeers) => ({
            ...prevPeers,
            [callerEmail]: peerToAnswer,
          }));
        });

        // look through each peer in peersRef and accept each individual returning signal/call back
        sockets.on("FE-accept-call-back", ({ playerEmail, answerSignal, playerAnsweringId }) => {
          console.log(`accepting call back from ${playerEmail}`);
          const peerToAccept = peersRef.current.find(
            (peer) => peer.peerId === playerAnsweringId
          );
          // accept returned call
          peerToAccept.peer.signal(answerSignal);
        });

        const user = JSON.parse(localStorage.getItem('user'));
        sockets.emit("BE-join-video-call", { gameId, userEmail: user.email })
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  function initCall(playerToCall, caller, stream) {
    const user = JSON.parse(localStorage.getItem("user"))
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (callerSignal) => {
      sockets.emit("BE-send-call", { callerEmail: user.email, playerToCall, caller, callerSignal });
    });
    peer.on("error", (err) => {
      console.log("peer initiator error", err)
    })
    peer.on("close", () => {
      console.log("peer initiator closed",)
    })

    return peer;
  }

  function answerCall(callerSignal, caller, stream) {
    const user = JSON.parse(localStorage.getItem("user"))
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", answerSignal => {
      // accept initiated call
      if (answerSignal.type === "answer") {
        sockets.emit("BE-answer-call", { playerEmail: user.email, answerSignal, caller });
      }
    });
    peer.on("error", (err) => {
      console.log("peer non initiator error", err)
    })
    peer.on("close", () => {
      console.log("peer non initiator closed",)
    })

    peer.signal(callerSignal);

    return peer;
  }

  function switchVideo() {
    setPlayerVideoOn(isOn => {
      currentPlayerVideo.current.srcObject
        .getVideoTracks()[0].enabled = !isOn
      return !isOn;
    });
  }
  function switchAudio() {
    setPlayerAudioOn(isOn => {
      currentPlayerVideo.current.srcObject
        .getAudioTracks()[0].enabled = !isOn
      return !isOn;
    });
  }

  async function getMediaStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <RTCContext.Provider value={
      {
        peers,
        currentPlayerVideo,
        initVideoCall,
        playerAudioOn,
        playerVideoOn,
        switchVideo,
        switchAudio
      }
    }>
      {props.children}
    </RTCContext.Provider>
  );
}

export { RTCContext, RTCContextProvider };
