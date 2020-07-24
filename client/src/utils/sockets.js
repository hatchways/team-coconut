import io from "socket.io-client";
const sockets = io("http://localhost:3001");
export default sockets;
