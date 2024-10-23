// Import database client.
import client from "../../config/database.js"

// Import Objectify from MongoDB.
import { ObjectId } from "mongodb"

// Get the receiver of a message, using
// conversationID and the sender.
async function GetReceiver (conversationID, sender) {
    try {
        // Find the conversation and get the other user.
        let messageCollection = client.db("EchoBond").collection("Conversations")

        // Convert the conversationID to ObjectId
        const objectId = new ObjectId(conversationID)

        const conversation = await messageCollection.findOne({ _id: objectId })

        if (!conversation) {
            return null
        }

        const { username1, username2 } = conversation

        const receiver = sender === username1 ? username2 : username1

        return receiver
    } catch (error) {
        console.log(error)
        return null
    }
}

export default GetReceiver