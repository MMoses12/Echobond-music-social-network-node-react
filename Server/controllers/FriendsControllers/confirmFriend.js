// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Confirm friend request.
async function ConfirmFriend (req, res) {
    // usernameMain is the accepter, usernameSec is the requester
    let usernameSec = req.body.usernameSec

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
        
        // Find the request pending from Sec to Main user then update the status
        if (await friends.findOneAndUpdate(
            { usernameMain: usernameSec, usernameSec: usernameMain, status: 'pending' }, // Find data.
            { $set: { status: 'confirmed' } }, // Update data.
            { returnOriginal: false } // Return new updated file.
        )) {
            // If update was succesfull , then insert a new conversation in the specific collection.
            let conversation = client.db("EchoBond").collection("Conversations")

            await conversation.insertOne({ username1 : usernameSec, username2 : usernameMain})

            return res.status(201).json({ message: 'Friendship request accepted.' })
        }

        // Friend request cant be found
        return res.status(409).json({ message: 'Friendship request doesnt exist.' })
    } catch (error) {
        res.status(500).json({ message: 'Error confirming friend request.', error: error.message })
    }
}

export default ConfirmFriend