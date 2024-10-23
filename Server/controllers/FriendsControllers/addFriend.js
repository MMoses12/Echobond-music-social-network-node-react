// Import database client.
import client from "../../config/database.js"

// Import socket instances.
import { io, connectedUsers } from "../../socket.js"

// Import needed libraries.
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Controller for adding a friend request
async function AddFriend (req, res) {
    let usernameSec = req.body.friendRequest

    try {
        // Verify token.
        let token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const usernameMain = decode.username

        let friends = client.db("EchoBond").collection("Friends")

        // Make friend request.
        await friends.insertOne({ usernameMain : usernameMain, usernameSec : usernameSec, status : 'pending', addedOn: new Date() })

        // Notify user for the new friend request.
        if (connectedUsers.has(usernameSec)) {
            io.to(usernameSec).emit('friendRequest', usernameMain)
        }

        res.status(201).json({ Register: "Friend Request Sent With Success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error adding friend.', error: error.message })
    }
}

export default AddFriend