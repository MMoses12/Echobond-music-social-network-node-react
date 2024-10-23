// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config()

// Get a user's friends.
async function GetFriends(req, res) {
    try {
        // Verify token.
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }

        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const usernameMain = decode.username

        // Get user's friends.
        let friends = client.db("EchoBond").collection("Friends")
        const friendships = await friends.find({
            $or: [
                { usernameMain: usernameMain, status: 'confirmed' },
                { usernameSec: usernameMain, status: 'confirmed' }
            ]
        }).toArray()

        if (!friendships.length) {
            return res.status(200).json({ })
        }

        const friendUsernames = friendships.map(friendship => 
            friendship.usernameMain === usernameMain ? friendship.usernameSec : friendship.usernameMain
        )

        // Get friends' data.
        let users = client.db("EchoBond").collection("Users")

        const usersFriends = await users.find({
            username: { $in: friendUsernames }
        }).toArray()

        usersFriends.map((user) => {
            if (user && user.Photo) {
                // Convert the photo buffer to a Base64 string
                user.Photo = `data:image/jpeg;base64,${user.Photo.toString('base64')}`
            }
        })
        
        // const usersFriendsUsername = usersFriends.map(user => user.username)

        return res.status(200).json({ friends: usersFriends})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching friends.', error: error.message })
    }
}

export default GetFriends
