// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Get the conversation ID for those two friends.
async function GetConversationID (req, res) {
    let friend = req.body.friend
    
    try {
        // Verify token.
        let token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const username = decode.username

        // Get the conversationID for the two users.
        let conversations = client.db("EchoBond").collection("Conversations")
        let conversationID = await conversations.findOne({
        $or: [ 
            { username1: friend, username2: username },
            { username1: username, username2: friend}]
        })

        conversationID = conversationID._id

        res.status(200).json({ conversationID })
    } catch (error) {
        console.log(error)
    }
}

export default GetConversationID