import React, { createContext, useState, useRef, useCallback } from "react";
import Peer from "simple-peer";
import sockets from "../utils/sockets";

const RTCContext = createContext();

function RTCContextProvider(props) {
  const [peers, setPeers] = useState({});
  const peersRef = useRef([]);
  const currentPlayerVideo = useRef();
  const currentPlayerAudio = useRef();
  const [playerVideoOn, setPlayerVideoOn] = useState(false);
  const [playerAudioOn, setPlayerAudioOn] = useState(false);

  const initVideoCall = useCallback((gameId) => {
    try {
      setPlayerVideoOn(false);
      setPlayerAudioOn(false);
      // receive player socket ids from backend and invoke initCall() for each player
      // add each newly created peer to state
      sockets.on("FE-players-in-room", (players) => {
        const peers = {};
        players.forEach(({ socketId, email }) => {
          const peer = initCall(socketId, sockets.id, email);
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
        const peerRefIdx = peersRef.current.findIndex(p => p.email === callerEmail);
        if (peerRefIdx !== -1) {
          peersRef.current[peerRefIdx].peer.signal(callerSignal);
        } else {
          const peerToAnswer = answerCall(callerSignal, caller, callerEmail);
          peersRef.current.push({
            peerId: caller,
            peer: peerToAnswer,
            email: callerEmail
          });

          setPeers((prevPeers) => ({
            ...prevPeers,
            [callerEmail]: peerToAnswer,
          }));
        }

      });

      // look through each peer in peersRef and accept each individual returning signal/call back
      sockets.on("FE-accept-call-back", ({ playerEmail, answerSignal, playerAnsweringId }) => {
        const peerToAccept = peersRef.current.find(
          (peer) => peer.peerId === playerAnsweringId
        );
        // accept returned call
        peerToAccept.peer.signal(answerSignal);
      });

      const user = JSON.parse(localStorage.getItem('user'));
      sockets.emit("BE-join-video-call", { gameId, userEmail: user.email })
    } catch (error) {
      console.error(error);
    }
  }, []);

  function initCall(playerToCall, caller, email) {
    const user = JSON.parse(localStorage.getItem("user"))
    const peer = new Peer({
      initiator: true,
      trickle: false,
    });

    peer.on("signal", (callerSignal) => {
      sockets.emit("BE-send-call", { callerEmail: user.email, playerToCall, caller, callerSignal });
    });
    peer.on("error", (err) => {
      console.log("peer initiator error", err)
    })
    peer.on("close", () => {
      peersRef.current = peersRef.current.filter(p => p.peerId !== playerToCall);
      setPeers(peers=>{
        delete peers[email];
        return peers;
      });
    })

    return peer;
  }

  function answerCall(callerSignal, caller, callerEmail) {
    const user = JSON.parse(localStorage.getItem("user"))
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentPlayerVideo.current.srcObject
    });

    peer.on("signal", answerSignal => {
      // accept initiated call
      sockets.emit("BE-answer-call", { playerEmail: user.email, answerSignal, caller });
    });
    peer.on("error", (err) => {
      console.log("peer non initiator error", err)
    })
    peer.on("close", () => {
      console.log("peer non initiator closed", caller)
      peersRef.current = peersRef.current.filter(p => p.peerId !== caller);
      setPeers(peers=>{
        delete peers[callerEmail];
        return peers;
      });
    })

    peer.signal(callerSignal);

    return peer;
  }

  function switchVideo() {
    setPlayerVideoOn(isOn => {
      if (currentPlayerVideo.current.srcObject) {
        peersRef.current.forEach(peerRef => {
          peerRef.peer.removeStream(currentPlayerVideo.current.srcObject);
        });
        currentPlayerVideo.current.srcObject = null;
      } else {
        getMediaStream({ video: true, audio: false }).then((stream) => {
          currentPlayerVideo.current.srcObject = stream;
          peersRef.current.forEach(peerRef => {
            peerRef.peer.addStream(stream);
          });
        }).catch((err) => {
          console.log(err)
          return false;
        });
      }
      return !isOn;
    });

  }
  function switchAudio() {
    setPlayerAudioOn(isOn => {
      if (currentPlayerAudio.current) {
        peersRef.current.forEach(peerRef => {
          peerRef.peer.removeStream(currentPlayerAudio.current);
        });
        currentPlayerAudio.current = null;
      } else {
        getMediaStream({ video: false, audio: true }).then((stream) => {
          currentPlayerAudio.current = stream;
          peersRef.current.forEach(peerRef => {
            peerRef.peer.addStream(stream);
          });
        }).catch((err) => {
          console.log(err)
          return false;
        });
      }
      return !isOn;
    });
  }

  async function getMediaStream(constrains) {
    return await navigator.mediaDevices.getUserMedia(constrains);
  }

  return (
    <RTCContext.Provider value={
      {
        peers,
        currentPlayerVideo: currentPlayerVideo,
        initVideoCall,
        playerAudioOn,
        playerVideoOn,
        switchVideo,
        switchAudio,
      }
    }>
      {props.children}
    </RTCContext.Provider>
  );
}

export { RTCContext, RTCContextProvider };
