import io from "socket.io-client";
const sockets = io("/");
export default sockets;
