// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import jwt from 'jsonwebtoken'

// Search for new friends.
async function SearchFriends(req, res) {
    let friendUsername = req.body.friendUsername

    try {
        // Verify token.
        let token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" })
        }
        token = token.split(' ')[1]
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let username = decode.username

        // Find users that are not friends and get their data.
        const users = client.db("EchoBond").collection("Users")
        const friends = client.db("EchoBond").collection("Friends")

        const friendships = await friends.find({
            $or: [
                { usernameMain: username, status: { $in: ['confirmed', 'pending'] }},
                { usernameSec: username, status: { $in: ['confirmed', 'pending'] } }
            ]
        }).toArray()

        const friendshipUsernames = []
        friendships.forEach(friendship => {
            if (friendship.usernameMain !== username) {
                friendshipUsernames.push(friendship.usernameMain)
            }
            if (friendship.usernameSec !== username) {
                friendshipUsernames.push(friendship.usernameSec)
            }
        })

        const friendData = await users.aggregate([
            {
                $match: {
                    username: { $regex: `^${friendUsername}`, $ne: username, $options: 'i' },
                }
            },
            {
                $match: {                   
                    username: { $ne: username },
                    username: { $nin: friendshipUsernames }
                }
            },
            {
                $project: {
                    username: 1,
                    Photo: 1
                }
            },
            {
                $limit: 3
            }
        ]).toArray()

        // Convert the photo buffer to a Base64 string
        friendData.forEach(user => {
            if (user && user.Photo) {
                user.Photo = `data:image/jpeg;base64,${user.Photo.toString('base64')}`
            }
        })

        res.status(200).json({ searchedFriends: friendData })
        
    } catch (error) {
        console.error("Error retrieving friends:", error)
        res.status(500).json({ message: 'Error retrieving friends.', error: error.message })
    }
}

export default SearchFriends