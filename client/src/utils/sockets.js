import io from 'socket.io-client';
const sockets = io('http://localhost:3001', { autoConnect: false });
export default sockets;
