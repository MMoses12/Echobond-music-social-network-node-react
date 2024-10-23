// Import database client.
import client from "../config/database.js"

// Check if a user with a specific username
// or email already exists in the database.
async function FindUser (data) {
    let { username, email } = data

    if (!username && !email) {
        return
    }

    try {
        await client.connect()

        let users = client.db("EchoBond").collection("Users")

        if (await users.findOne({ username: username }) || await users.findOne({ email: email })) {
            return true
        }

        return false
    } catch (error) {

    }
}

export default FindUser