// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import bcrypt from "bcrypt"

// Change user's password, after checking matching
// the old password with the given one.
async function ChangePassword (username, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
        return false
    }

    try {
        const users = client.db("EchoBond").collection("Users")
        const user = await users.findOne({ username: username })

        if (!user) {
            return false
        }

        // Check if the current password is correct
        const passwordIsValid = await bcrypt.compare(oldPassword, user.password)
        if (!passwordIsValid) {
            return false
        }

        // Encrypt the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update the user's password
        await users.updateOne(
            { username: username },
            { $set: { password: hashedPassword } }
        )

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export default ChangePassword
