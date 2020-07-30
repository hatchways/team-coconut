## JustOne Online with Friends

JustOne is a word guessing game that is essentially a clone of [the real JustOne game](https://justone-the-game.com/index.php?lang=en) with the same ruleset and also has login/signup and real-time video chat features. 

The game is **deployed** at: https://play-just-one.herokuapp.com/

**Technologies Used**
- MongoDB
- Express.js
- React
- Node.js
- WebRTC
- Socket.io
- Material UI
- HowlerJS

**Contributors:** [Insaf Khamzin](https://github.com/InsafKhamzin), [Hyunse Kim](https://github.com/Hyunse), [Darren Mabbayad](https://github.com/darrenMabbayad)

---

## Features

**User authentication**
- Users are created and stored in a MongoDB collection. 
- On login, a jsonwebtoken is given to the user in an httpOnly cookie
- Verify the jwt on every subsequent request, otherwise redirect to login route
- The jwt is also checked on socket connections through a socket.io middleware

**Video chat**
- Used the [simple-peer](https://github.com/feross/simple-peer) library to implement WebRTC protocols for handling user streaming data
- Used Socket.io to handle signalling events between each client to establish peer to peer connections
- Established a [mesh network](https://en.wikipedia.org/wiki/Mesh_networking) through socket.io signalling events and simple-peer library methods to create group video calls (in short, all clients need to create connections to one another — not have client 1 -> client 2 -> client 3 -> client 4 -> client 1)

**Real time multiplayer gameplay**
- All game logic for a particular game instance is handled in server memory
- Used several socket.io events and React's Context API to maintain a consistent gameplay experience and to display all relevant information in the UI

---

## Demo

**Login/Sign up and Creating/Joining Games**
1. Create a new account or login to the application. You can either host a game or join an existing game with a game ID (given to you by the host) or you can join through an invite link in an email. 
![register](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/login-signup.gif)

2. You can invite someone by linking them the game ID in the lobby. Then they can enter the link in the join section of /create-game
![game ID invite](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/gameId-invite.gif)

3. You have an option to email someone an invite link.
![email invite](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/email-invite.gif)

4. You can only start a game when **four players** are in the pre-game lobby, no more, no less. 
![create game](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/create-game.gif)

---

**Playing the game**
1. When the game starts, click on the **settings button at the top right** and you can stream your video camera and your microphone to the other players in the game.

2. Play the game! There's two phases, a clue giving phase and a guessing phase. Submit a clue and hope that you don't accidentally enter the same clue as another player. 
![guessing](https://github.com/hatchways/team-coconut/blob/dev/client/public/img/guess.png)

3. If you do, that clue is marked as invalid and you won't get any points if the guesser is correct for a round. There are four rounds, so each player gets to guess once. 
![duplicates](https://github.com/hatchways/team-coconut/blob/dev/client/public/img/duplicates.png)

4. Every player can see if someone has started tying or if they already submitted a clue.
![typing status](https://github.com/hatchways/team-coconut/blob/dev/client/public/img/typing-status.png)

5. At the end of the game, you can either leave or the host can choose to create a new game. Anyone that is still in the game session when the host presses **Play Again** will be redirected to a new pre-game lobby.
![create game](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/play-again.gif)
