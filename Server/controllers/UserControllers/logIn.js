// Import database client.
import client from "../../config/database.js"

// Import needed libraries.
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Simple login function with jwt token initializing.
// Check the password with the encrypted one in the database.
async function LogIn (req, res) {
    // Get credentials from the request body.
    let username = req.body.username
    let password = req.body.password

    try {
        const users = client.db("EchoBond").collection("Users")
        const user = await users.findOne({ username: username })

        // If there is no user with this username,
        // or the password is not correct.
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(404).json({ error: "Wrong credentials" })
        }

        // Make a new token.
        const payload = {
            username: username
        }

        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "LogIn error" })
    }
} 

export default LogIn