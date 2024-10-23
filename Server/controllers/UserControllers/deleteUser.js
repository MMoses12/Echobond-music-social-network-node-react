// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from 'jsonwebtoken'

// Delete user.
async function DeleteUser (req, res) {
    try {
        let token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let username = decode.username
        
        const db = client.db("EchoBond")

        // Collections where the user's data might be present
        const collections = ["Users", "Friends", "Listened_History", "Favourites", "Conversations", "History"]

        let conversationIds = []

        for (const collectionName of collections) {
            const collection = db.collection(collectionName)

            // Remove documents where the username matches
            if (collectionName === "Users") {
                await collection.deleteOne({ username: username })
            } else if (collectionName === "Friends") {
                await collection.deleteMany({
                    $or: [
                        { usernameMain: username },
                        { usernameSec: username }
                    ]
                })
            } else if (collectionName === "Conversations") {
                // Find and collect conversation IDs
                const conversations = await collection.find(
                    { $or: [{ username1: username }, { username2: username }] },
                    { projection: { _id: 1 } }
                ).toArray()

                conversationIds = conversations.map(conversation => conversation._id)

                // Delete conversations where the user is a participant
                await collection.deleteMany(
                    { $or: [{ username1: username }, { username2: username }] }
                )
            } else {
                await collection.deleteMany({ username: username })
            }
        }

        if (conversationIds.length > 0) {
            const mesCollection = db.collection("Messages")

            // Delete all the messages from the conversations of the user
            await mesCollection.deleteMany({ conversationID: { $in: conversationIds } })
        }

        res.status(200).json({ message: `User and related data deleted successfully.` })
    } catch (error) {
        console.error("Error deleting user:", error)
        res.status(500).json({ message: 'Error deleting user.', error: error.message })
    }
}

export default DeleteUser
