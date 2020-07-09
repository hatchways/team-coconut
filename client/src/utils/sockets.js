import io from 'socket.io-client'
const sockets = io('http://localhost:3001');
console.log('socket connected')
export default sockets;

