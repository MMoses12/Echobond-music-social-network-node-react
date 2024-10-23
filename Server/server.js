// Import needed libraries.
import express from "express"
import { createServer } from "http"
import bodyParser from "body-parser"

// Import database client.
import client from "./config/database.js"

// Import routes.
import song from "./routes/song.js"
import user from "./routes/user.js"
import otp from "./routes/otp.js"
import token from "./routes/token.js"
import chat from "./routes/chat.js"
import albums from "./routes/albums.js"
import artist from "./routes/artist.js"
import search from "./routes/search.js"

// Import controllers.
import AddMessage from "./controllers/MessageControllers/addMessage.js"
import GetConversationMessages from "./controllers/MessageControllers/getMessages.js"
import GetAudio from "./controllers/SongsController/getAudio.js"
import CountRequests from "./controllers/UserControllers/countRequests.js"
import AddRecentPlayedSong from "./controllers/UserControllers/addRecentPlayedSong.js"
import GetNewMessages from "./controllers/UserControllers/getNewMessages.js"
import GetNextSong from "./controllers/SongsController/getNextSong.js"
import GetPreviousSong from "./controllers/SongsController/getPreviousSong.js"

// Import socket
import makeSocket from "./socket.js"
import { connectedUsers, io } from "./socket.js"

// Able to get requests from the same device as the server.
import cors from "cors"

const app = express()
const PORT = 4000

// Being able to handle requests from client from the same
// device as the server.
const corsOptions = {
    origin: ['http://100.91.43.32:3000', 'http://localhost:3000', 'http://100.90.191.68:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

await client.connect()

app.use(cors(corsOptions))

// Middleware
app.use(bodyParser.json({ limit: '5mb' })) // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true })) // Increase the limit as needed

// Parse json bodies in the request object
app.use(express.json())

 // Use this for parsing form data
app.use(express.urlencoded({ extended: true }))

// Routers
app.use("/song", song)
app.use("/user", user)
app.use("/otp", otp)
app.use("/token", token)
app.use("/chat", chat)
app.use("/albums",albums)
app.use("/artists", artist)
app.use("/search", search)

const server = createServer(app)

// Make the socket with listeners.
makeSocket(server)

// Open a socket to let users join.
io.on('connection', (socket) => {

    // On join open a socket with username.
    socket.on('join', async (username) => {
        socket.join(username)
        connectedUsers.set(username, socket.id)

        const requests = await CountRequests(username)
        io.to(username).emit('requests', requests)

        // Get new messages for user notifications.
        const newMessages = await GetNewMessages(username)
        if (newMessages) {
            newMessages.forEach((message) => 
                io.to(username).emit('newMessage', message.sender, message.message)
            )
        }
    })

    // Open socket with conversationID.
    socket.on('conversation', async (conversationID) => {
        socket.join(conversationID)

        let conversation = await GetConversationMessages(conversationID)
        conversation.forEach(message => {
            socket.emit('message', message)
        })
    })

    // Open socket for messages.
    socket.on('message', (conversationID, message, username) => {
        let now = new Date()
        io.to(conversationID).emit('message', { message, sentFrom: username, sentDate: now })
        AddMessage({ conversationID, sentFrom: username, message, sentDate: now })
    })

    // Open socket for listen a song.
    socket.on('listenSong', async (username, songTitle) => {
        const audio = await GetAudio(songTitle)

        if (audio) {
            io.to(username).emit('getSong', audio)     
            AddRecentPlayedSong(username, songTitle)
        }
    })

    // Open a socket for streaming next song from the same album.
    socket.on('nextSong', async (username, songTitle) => {
        const song = await GetNextSong(songTitle)

        if (song) {
            io.to(username).emit('getNextSong', song)
            AddRecentPlayedSong(username, song.title)
        }        
    })

    // Open a socket for streaming previous song from the same album.
    socket.on('previousSong', async (username, songTitle) => {
        const song = await GetPreviousSong (songTitle)

        if (song) {
            io.to(username).emit('getPreviousSong', song)
            AddRecentPlayedSong(username, song.title)
        }        
    })

    // Open a socket for leaving a chat.
    socket.on('leaveChat', (conversationID) => {
        socket.leave(conversationID)
    })

    // Open a socket for disconnecting.
    socket.on('disconnectUser', (username) => {
        socket.leave(username)
        if (connectedUsers.has(username))  {   
            connectedUsers.delete(username)
        }
    })
})

// Open the server and io sockets.
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
io.listen(4001)