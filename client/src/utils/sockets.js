import io from 'socket.io-client';
const sockets = io('/', { autoConnect: false });
export default sockets;
