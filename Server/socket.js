import { Server as SocketIO } from "socket.io"

const connectedUsers = new Map()
let io

function makeSocket (server) {
    // Setup CORS for socket.io
    io = new SocketIO(server, {
        cors: {
            origin: ['http://100.91.43.32:3000', 'http://localhost:3000', 'http://100.90.191.68:3000'],
            methods: ["GET", "POST"]
        }
    });
}

export default makeSocket
export { connectedUsers, io }