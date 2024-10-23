// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import dotenv from "dotenv"

dotenv.config()

// Count how many friend requests a user has.
async function CountRequests(username) {
    try {
        const friends = client.db("EchoBond").collection("Friends")

        const requests = await friends.countDocuments({ 
            $or: [
                { usernameSec: username, status: { $in: ['pending'] } }
            ]}
        )

        return requests
    } catch (error) {
        console.log(error)
        return 0
    }
}

export default CountRequests
