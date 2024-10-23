// Import database client.
import client from "../../config/database.js"

// Import needed functions.
import GetReceiver from "./getReceiver.js"

// Import socket instance.
import { io, connectedUsers } from "../../socket.js"

// Add a message into database.
async function AddMessage (details) {
    const { conversationID, sentFrom, message, sentDate } = details

    try {
        // Add the message in database.
        let messageCollection = client.db("EchoBond").collection("Messages")

        await messageCollection.insertOne({ conversationID, sentFrom, message, sentDate })

        const receiver = await GetReceiver(conversationID, sentFrom)

        // Emit the message to user or put it in Notifications
        // to notify the user.
        if (connectedUsers.has(receiver)) {
            io.to(receiver).emit('newMessage', sentFrom, message)
        }
        else {
            let notifications = client.db("EchoBond").collection("Notifications")

            notifications.insertOne({ username: receiver, sender: sentFrom, message: message })
        }
    } catch (error) {
        console.log(error)
    }
}

export default AddMessage