// Import database client.
import client from "../../config/database.js"

// Assume client is already connected and using connection pooling
async function GetConversationMessages (conversationID) {
    try {
        // Get the history of messages in a conversation.
        const messagesCollection = client.db("EchoBond").collection("Messages")
        const conversationMessages = await messagesCollection.find({ conversationID }).toArray()

        return conversationMessages
    } catch (error) {
        console.error('Failed to retrieve conversation messages:', error)
        return []
    }
}

export default GetConversationMessages