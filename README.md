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

## Demo
1. Create a new account or login to the application. You can either host a game or join an existing game with a game ID (given to you by the host) or you can join through an invite link in an email. 
![register](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/login-signup.gif)

2. You can only start a game when **four players** are in the pre-game lobby, no more, no less. 
![create game](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/create-game.gif)

3. You have an option to email someone an invite link.
![create game](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/email-invite.gif)

4. When the game starts, click on the **settings button at the top right** and you can stream your video camera and your microphone to the other players in the game.

5. Play the game! There's two phases, a clue giving phase and a guessing phase. Submit a clue and hope that you don't accidentally enter the same clue as another player. 
![guessing](https://github.com/hatchways/team-coconut/blob/dev/client/public/img/guess.png)

6. If you do, that clue is marked as invalid and you won't get any points if the guesser is correct for a round. There are four rounds, so each player gets to guess once. 
![duplicates](https://github.com/hatchways/team-coconut/blob/dev/client/public/img/duplicates.png)

7. Every player can see if someone has started tying or if they already submitted a clue.
![typing status](https://github.com/hatchways/team-coconut/blob/dev/client/public/img/typing-status.png)

8. At the end of the game, you can either leave or the host can choose to create a new game. Anyone that is still in the game session when the host presses **Play Again** will be redirected to a new pre-game lobby.
![create game](https://github.com/hatchways/team-coconut/blob/dev/client/public/gifs/play-again.gif)
