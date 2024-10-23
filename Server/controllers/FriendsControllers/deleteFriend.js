// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

async function DeleteFriend (req,res) {
    let usernameSec = req.query.friend
    let token = req.headers.authorization

    try {
        // Verify token.
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const usernameMain = decode.username

        let friends = client.db("EchoBond").collection("Friends")

        // Find friendship and delete it.
        await friends.findOneAndDelete({
            $or: [
                { usernameMain: usernameMain, usernameSec: usernameSec },
                { usernameMain: usernameSec, usernameSec: usernameMain },
            ]
        })

        // Delete converstion and conversation messages.
        let conversations = client.db("EchoBond").collection("Conversations")

        const conversationsData = await conversations.find(
            { $or: [{ username1: usernameMain, username2: usernameSec}, { username1: usernameSec, username2: usernameMain }] },
            { projection: { _id: 1 } }
        ).toArray()

        const conversationIds = conversationsData.map(conversation => conversation._id)

        // Delete conversations where the user is a participant
        await conversations.deleteOne({ 
            $or: [
                { username1: usernameMain, username2: usernameSec}, 
                { username1: usernameSec, username2: usernameMain }
            ]
        })

        if (conversationIds.length > 0) {
            let mesCollection = client.db("EchoBond").collection("Messages")
            
            // Delete all the messages from the conversations of the user
            await mesCollection.deleteMany({ conversationID: { $in: conversationIds } })
        }

        return res.status(200).json({ message: "All good" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error adding friend.', error: error.message })
    }
}

export default DeleteFriend