import io from 'socket.io-client'
const sockets = io('/');
console.log('socket connected')
export default sockets;

