// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from 'jsonwebtoken'

// Get all friend requests of a user.
async function GetFriendRequests(req, res) {
    try {
        // Verify token.
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const usernameMain = decode.username

        // Find every friend request.
        let friends = client.db("EchoBond").collection("Friends")
        const friendships = await friends.find({ usernameSec: usernameMain, status: 'pending' }).toArray()

        if (!friendships.length) {
            return res.status(200).json({ message: 'No friend requests pending.' })
        }

        const friendUsernames = friendships.map(friendship => 
            friendship.usernameMain === usernameMain ? friendship.usernameSec : friendship.usernameMain
        )  

        let users = client.db("EchoBond").collection("Users")

        // Get data of every friend request.
        const requests = await users.find({
            username: { $in: friendUsernames }
        }).toArray()

        requests.map((user) => {
            if (user && user.Photo) {
                // Convert the photo buffer to a Base64 string
                user.Photo = `data:image/jpeg;base64,${user.Photo.toString('base64')}`
            }
        })

        return res.status(200).json({message : 'Friend request pending', requests: requests })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching friends.', error: error.message })
    }
}

export default GetFriendRequests
