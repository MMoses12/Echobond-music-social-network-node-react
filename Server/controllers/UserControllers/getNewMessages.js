// Import database client.
import client from "../../config/database.js"

// Get new messages to notify user.
async function GetNewMessages (username) {
    try {
        let notificationCollection = client.db("EchoBond").collection("Notifications")

        const notifications = await notificationCollection.find({ username }).toArray()

        await notificationCollection.deleteMany({ username })

        if (!notifications) {
            return []
        }

        return notifications
    } catch (error) {
        console.log(error)
        return null
    }
}

export default GetNewMessages