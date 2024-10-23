// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from "jsonwebtoken"

// Decline friend request.
async function DeclineRequest (req, res) {
    // usernameMain is the accepter, usernameSec is the requester
    let usernameSec = req.body.usernameSec
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
        
        // Find the request pending from Sec to Main user then update the status
        if (await friends.findOneAndDelete({
                $or: [
                    { usernameMain: usernameSec, usernameSec: usernameMain, status: 'pending' }
                ]
        })) {
            return res.status(201).json({ message: 'Friendship declined.' })
        }

        // Friend request can't be found
        return res.status(409).json({ message: 'Friendship request doesnt exist.' })
        
    } catch (error) {
        res.status(500).json({ message: 'Error confirming friend request.', error: error.message })
    }
}

export default DeclineRequest