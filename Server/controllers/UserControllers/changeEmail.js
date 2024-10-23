// Import database client.
import client from "../../config/database.js"

// Change user's email.
async function ChangeEmail (username, newEmail) {
    try {
        const users = client.db("EchoBond").collection("Users")

        // Update the user's photo in the database
        const updateResult = await users.updateOne(
            { username: username },
            { $set: { email: newEmail } }  // Storing the image as binary
        )

        if (updateResult.matchedCount === 0) {
            return false
        }

        return true
    } catch (error) {
        console.error("Error updating profile image:", error)
        return false
    }
}

export default ChangeEmail