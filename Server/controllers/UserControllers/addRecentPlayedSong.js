// Import database client.
import client from "../../config/database.js"

// Add a recent played song into played history.
async function AddRecentPlayedSong (username, title) {
    try {
        let history = client.db("EchoBond").collection("Listened_History")

        if (history.countDocuments({}) != 0) {
            await history.findOneAndDelete ({title : title,  username : username})
        }

        await history.insertOne({ title : title, username : username})

        return true
    } catch (error) {
        console.error("Error retrieving recent history:", error)
        return false
    }
}

export default AddRecentPlayedSong
